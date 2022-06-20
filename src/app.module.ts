import { Logger, Module } from "@nestjs/common";
import { SocketGateway } from './socket.gateway';
import { AuthService } from './auth/auth.service';
import { AppController } from './app/app.controller';
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [SocketGateway, AuthService, Logger],
  controllers: [AppController],
})
export class AppModule {}
