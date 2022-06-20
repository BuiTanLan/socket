import { Controller, Get } from "@nestjs/common";
import { SocketGateway } from "../socket.gateway";
import { Server } from "socket.io";

@Controller('app')
export class AppController {
  io: Server | null = null;
  constructor(private readonly socketGateway: SocketGateway,
  ) {
    this.io = this.socketGateway.getGateway();
  }
  @Get()
  findAll(): string {
    this.socketGateway.getGateway().to('6').emit('chat','lan');
    return 'This action returns all cats';
  }
}
