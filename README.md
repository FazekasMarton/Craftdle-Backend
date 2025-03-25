# Craftdle Backend

## Description
The Craftdle backend powers the game's core functionalities, handling user authentication, game state management, and real-time multiplayer interactions using WebSockets. It ensures secure data storage and communication between players and the server.

## Technologies
- **Nest.js** – Backend framework
- **Prisma** – ORM for database management
- **MySQL** – Relational database
- **Socket.io** – Real-time communication
- **bcrypt** – Password hashing

## Installation & Running

1. **Obtain the `.env` file** – Request it from an existing developer and place it in the root directory.
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Generate Prisma client:**
   ```sh
   npm run prisma:generate
   ```
4. **Apply database migrations:**
   ```sh
   npm run prisma:push
   ```
5. **Load seed data:**
   ```sh
   npm run seed
   ```
6. **Start the application:**
   - Development mode:
     ```sh
     npm run start:dev
     ```
   - Production mode:
     ```sh
     npm run start:prod
     ```

## Available Scripts

The following scripts are available in the `package.json`:

- `npm run prisma:generate` – Generate Prisma client
- `npm run prisma:push` – Apply database migrations
- `npm run seed` – Seed the database
- `npm run build` – Build the application
- `npm run format` – Format code using Prettier
- `npm run start` – Start the application
- `npm run start:dev` – Start the application in development mode
- `npm run start:debug` – Start the application in debug mode
- `npm run start:prod` – Start the application in production mode
- `npm run lint` – Run ESLint and fix issues
- `npm run test` – Run unit tests
- `npm run test:watch` – Run unit tests in watch mode
- `npm run test:cov` – Run tests with coverage
- `npm run test:debug` – Debug tests
- `npm run test:e2e` – Run end-to-end tests

## Environment Variables
The application requires the following environment variables to be set in a `.env` file:

- `DATABASE_URL` – Connection string for MySQL database  
- `BACKENDURL` – Base URL of the backend server  
- `ENCRYPTION_KEY` – Key used for encryption  
- `GMAILADDRESS` – Email address for outgoing emails  
- `GMAILPASSWORD` – Password for Gmail integration  

A `.env` file should be obtained from an existing developer.