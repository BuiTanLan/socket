import { Controller, Get, Logger } from "@nestjs/common";
import { SocketGateway } from "../socket.gateway";

@Controller('app')
export class AppController {
  private logger = new Logger(AppController.name);
  constructor(private readonly socketGateway: SocketGateway,
  ) {
  }
  @Get()
  findAll(): string {
    this.socketGateway.getIO().to('6').emit('chat','lan');
    this.logger.log('Just emit event');
    return 'This action returns all cats';
  }
}
