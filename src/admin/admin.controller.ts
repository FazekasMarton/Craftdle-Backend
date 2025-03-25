import { Controller, Get, Post, Body, Patch, Param, Delete, Headers, HttpException, HttpStatus } from '@nestjs/common';
import { AdminService } from './admin.service';
import { SocketGateway } from 'src/socket/socket.gateway';
import { EmailService } from 'src/email/email.service';
import { StatisticsService } from 'src/statistics/statistics.service';
import { CliService } from 'src/cli/cli.service';
import { LoginDataDto } from 'src/users/dtos/login.dto';
import { CreateMaintenanceDto } from '../maintenance/dto/createMaintenance.dto';
import { UpdateAdminRightsDto } from './dto/updateAdminRights.dto';
import { MaintenanceService } from 'src/maintenance/maintenance.service';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly maintenanceService: MaintenanceService,
    private readonly socketGateway: SocketGateway,
    private readonly emailService: EmailService,
    private readonly statisticsService: StatisticsService,
    private readonly cliService: CliService
  ) { }

  @Post("login")
  async login(@Body() loginDataDto: LoginDataDto) {
    const result = await this.adminService.login(loginDataDto);
    await this.emailService.sendAdminVerificationEmail(result.email, { code: result.code, name: result.name });
    return { token: result.token };
  }

  @Post("verifyAdmin")
  async verifyAdmin(@Headers('authorization') authHeader: string, @Body() body: { code: string }) {
    return this.adminService.verifyAdmin(authHeader, body.code);
  }

  @Delete("login")
  logout(@Headers('authorization') authHeader: string) {
    return this.adminService.logout(authHeader);
  }

  @Get("maintenance")
  async getMaintenance(@Headers('authorization') authHeader: string) {
    return this.maintenanceService.getAllMaintenance(authHeader);
  }

  @Post("maintenance")
  async createMaintenance(@Headers('authorization') authHeader: string, @Body() createMaintenanceDto: CreateMaintenanceDto) {
    const addedMaintenance = await this.maintenanceService.createMaintenance(createMaintenanceDto, authHeader);
    this.socketGateway.emitMaintenanceUpdate(await this.maintenanceService.getCurrentMaintenance());
    return addedMaintenance;
  }

  @Patch("maintenance/:id")
  async updateMaintenance(@Headers('authorization') authHeader: string, @Param('id') id: string, @Body() createMaintenanceDto: CreateMaintenanceDto) {
    const updatedMaintenance = await this.maintenanceService.updateMaintenance(id, createMaintenanceDto, authHeader);
    this.socketGateway.emitMaintenanceUpdate(await this.maintenanceService.getCurrentMaintenance());
    return updatedMaintenance;
  }

  @Delete("maintenance/:id")
  async deleteMaintenance(@Headers('authorization') authHeader: string, @Param('id') id: string) {
    const deletedMaintenance = await this.maintenanceService.deleteMaintenance(id, authHeader);
    this.socketGateway.emitMaintenanceUpdate(await this.maintenanceService.getCurrentMaintenance());
    return deletedMaintenance;
  }

  @Get("admins")
  async getAdmins(@Headers('authorization') authHeader: string) {
    return this.adminService.getAllAdmins(authHeader);
  }

  @Patch("admin/:id")
  async updateAdmin(@Headers('authorization') authHeader: string, @Param('id') id: string, @Body() body: UpdateAdminRightsDto) {
    return this.adminService.updateAdmin(+id, authHeader, body);
  }

  @Get("users")
  async getUsers(@Headers('authorization') authHeader: string) {
    return this.adminService.getAllUsers(authHeader);
  }

  @Get("user/:id")
  async getUser(@Headers('authorization') authHeader: string, @Param('id') id: string) {
    return this.adminService.getUser(+id, authHeader);
  }

  @Get("statistics")
  async getStatistics(@Headers('authorization') authHeader: string) {
    return this.statisticsService.getStatistics(authHeader);
  }

  @Get("cli")
  async getCommands(@Headers('authorization') authHeader: string) {
    return this.cliService.getCommands(authHeader);
  }

  @Post("cli")
  async executeCommand(@Headers('authorization') authHeader: string, @Body() body: { command: string }) {
    return this.cliService.executeCommand(authHeader, body.command);
  }
}
