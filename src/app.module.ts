import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { AuthService } from './auth/auth.service';
import { AppController } from './app/app.controller';

@Module({
  imports: [],
  providers: [SocketGateway, AuthService],
  controllers: [AppController],
})
export class AppModule {}
