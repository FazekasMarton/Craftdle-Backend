import { AchievementsGateway } from 'src/achievements/achievements.gateway';
import { Game } from 'src/game/classes/game.class';
import { UsersService } from 'src/users/users.service';
import { Server, Socket } from 'socket.io';
import { WebSocketGateway, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { AchievementsCollection } from 'src/achievements/classes/achievementsCollection';
import { PrismaService } from 'src/prisma/prisma.service';
import { RecipesService } from 'src/recipes/recipes.service';
import { CacheService } from 'src/cache/cache.service';
import { GameService } from 'src/game/game.service';
import { TokenService } from 'src/token/token.service';
import { MaintenanceService } from 'src/maintenance/maintenance.service';

@WebSocketGateway({ cors: true })
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(SocketGateway.name);

  private server: Server;
  private reporter: NodeJS.Timeout | null = null;

  static gameToClient: Map<string, Game> = new Map();

  constructor(
    private readonly usersService: UsersService,
    private readonly maintenanceService: MaintenanceService,
    private readonly achievementGateway: AchievementsGateway,
    private readonly prisma: PrismaService,
    private readonly cacheService: CacheService,
    private readonly recipesService: RecipesService,
    private readonly gameService: GameService,
    private readonly tokenService: TokenService
  ) { }

  afterInit(server: Server) {
    this.server = server;
    this.logger.log('Socket Gateway initialized!');
  }

  /**
   * Eltávolítja a gamet a socket ID alapján.
   * @param socketId - A socket ID.
   */
  removeUserBySocketId(socketId: string): void {
    const game = SocketGateway.gameToClient.get(socketId);
    if (game) {
      SocketGateway.gameToClient.delete(socketId);
    };
  };

  // Kliens csatlakozása
  async handleConnection(client: Socket) {
    const token = client.handshake.auth?.token;
    if (!token) {
      this.logger.error('Connection rejected: No token provided.');
      client.emit("error", 'UnauthorizedError');
      client.disconnect();
      return;
    }

    // Token validáció a UsersService-en keresztül
    const user = this.usersService.getUserByToken(token);

    if (!user) {
      this.logger.error('Connection rejected: Invalid token.');
      client.emit("error", 'UnauthorizedError');
      client.disconnect();
      return;
    }

    const oldSocketId = user.socketId;
    this.usersService.associateSocketId(token, client.id);

    if(oldSocketId){
      this.server.to(oldSocketId).disconnectSockets();
    }
    
    // Socket ID társítása a UsersService-ben
    if (!user.isGuest) {
      const achievementsCollection = new AchievementsCollection(this.prisma);
      await achievementsCollection.achievementEventListener(user, [{ name: "regist", targets: ["regist"] }]);
      await this.achievementGateway.emitAchievements(client.id, achievementsCollection.achievementList)
    }
    this.logger.log(`Client connected: ${client.id} (User: ${user.username})`);
    const maintenance = await this.maintenanceService.getCurrentMaintenance();
    client.emit('maintenance', maintenance);

    if (maintenance.countdown != null) {
      clearTimeout(this.reporter);
      this.reporter = setTimeout(async () => {
        this.emitMaintenanceUpdate(await this.maintenanceService.getCurrentMaintenance());
      }, (maintenance.countdown + 1) * 1000);
    }
  }

  // Broadcast üzenet küldése minden kliensnek
  broadcastEvent(eventName: string, payload: any) {
    this.server.emit(eventName, payload);
  }

  // Kliens lecsatlakozása
  async handleDisconnect(client: Socket) {
    // Felhasználó eltávolítása socket ID alapján
    const user = this.usersService.getUserBySocketId(client.id);
    if (user) {
      this.logger.log(`Client disconnected: ${client.id} (User: ${user.username})`);
      this.usersService.removeUserBySocketId(client.id);
      if(user.isGuest){
        this.tokenService.deleteToken(user.id);
      }
      if(await this.usersService.deleteUnnecessaryGuestsData(user)){
        console.log("Guest data deleted");
        this.gameService.deleteAllUnnecessaryGamesDataByUser(user.id);
      }
    } else {
      this.logger.log(`Client disconnected: ${client.id} (No associated user found)`);
    }
  }

  @SubscribeMessage('credits')
  async handleCredits(client: Socket) {
      const user = this.usersService.getUserBySocketId(client.id);
      const achievementsCollection = new AchievementsCollection(this.prisma);
      
      // Várjuk meg, hogy a listener befejezze!
      await achievementsCollection.achievementEventListener(user, [{ name: "credits", targets: ["watched"] }]);
      
      // Csak akkor emitálunk, ha már biztosan kész a lista!
      await this.achievementGateway.emitAchievements(client.id, achievementsCollection.achievementList);
  }
  

  emitMaintenanceUpdate(maintenance: {
    started: boolean,
    countdown: number | null
  }) {
    console.log(maintenance);
    this.broadcastEvent('maintenance', maintenance);
    if (maintenance.countdown != null) {
      clearTimeout(this.reporter);
      this.reporter = setTimeout(async () => {
        this.emitMaintenanceUpdate(await this.maintenanceService.getCurrentMaintenance());
      }, (maintenance.countdown + 1) * 1000);
    }
  }
}