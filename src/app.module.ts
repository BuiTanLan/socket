import { Logger, Module } from "@nestjs/common";
import { SocketGateway } from './socket.gateway';
import { AuthService } from './auth/auth.service';
import { AppController } from './app/app.controller';
import { ConfigModule } from "@nestjs/config";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [ConfigModule.forRoot(), HttpModule],
  providers: [SocketGateway, AuthService, Logger],
  controllers: [AppController],
})
export class AppModule {}
