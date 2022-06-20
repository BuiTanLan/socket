import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WSAuthMiddleware } from './auth.middleware';
import { AuthService } from './auth/auth.service';

@WebSocketGateway()
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() private server!: Server;
  constructor(private readonly authService: AuthService) {}

  afterInit(server: Server): void {
    const middle = WSAuthMiddleware(this.authService);
    server.use(middle);
  }

  handleConnection(client: AuthSocket, ...args: any[]): any {
    console.log('connect', client.id);
  }

  handleDisconnect(client: AuthSocket): any {
    console.log('disconnect', client.userId);
  }

  @SubscribeMessage('message')
  handleMessage(client: AuthSocket, payload: any): string {
    return 'Hello world!';
  }
  getGateway() {
    return this.server;
  }
}

export interface AuthSocket extends Socket {
  userId: string;
}
