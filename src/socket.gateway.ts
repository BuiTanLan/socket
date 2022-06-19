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

@WebSocketGateway()
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() private server!: Server;

  afterInit(server: Server): void {
    const middle = WSAuthMiddleware();
    server.use(middle);
    console.log(`WS init`);
  }

  handleConnection(client: Socket, ...args: any[]): any {
    console.log('connect', client.id);
  }

  handleDisconnect(client: Socket): any {
    console.log('disconnect', client.id);
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any): string {
    return 'Hello world!';
  }
  getGateway() {
    return this.server;
  }
}
