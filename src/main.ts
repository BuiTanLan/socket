import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RedisIoAdapter } from './socket.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);

  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);
}

void bootstrap();
