import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [],
  providers: [SocketGateway, AuthService],
})
export class AppModule {}
