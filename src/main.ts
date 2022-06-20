import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RedisIoAdapter } from './socket.adapter';
import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { SeqTransport } from '@datalust/winston-seq';
import { format } from "winston";


async function bootstrap() {
  const transports  = createTransports();
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      level: 'info',
      format: winston.format.combine(  /* This is required to get errors to log with stack traces. See https://github.com/winstonjs/winston/issues/1498 */
        winston.format.errors({ stack: true }),
      ),
      transports: transports
    }),

  });

  const redisIoAdapter = new RedisIoAdapter(app);
  redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);
  await app.listen(3000);

}

function createTransports(): winston.transport[]{
  let transports: winston.transport[] = [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        nestWinstonModuleUtilities.format.nestLike(),
      ),
    })
  ];

  if (process.env['NODE_ENV'] === 'production') {
    transports = [
      ...transports,
      new winston.transports.DailyRotateFile({
        filename: 'tmt.tdeskapp-%DATE%.log',
        dirname: 'logs',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
        format: format.combine(
          winston.format.timestamp(),
          winston.format.ms(),
          nestWinstonModuleUtilities.format.nestLike(),
          winston.format.uncolorize(),
        ),
        level: 'warn'
      }),
      new SeqTransport({
        serverUrl: process.env['SEQ_API_URL'],
        apiKey: process.env['SEQ_API_KEY'],
        onError: (e => { console.error(e) }),
        handleExceptions: true,
        handleRejections: true,
        level: 'warn',
      })
    ]
  }
  return transports;
}

void bootstrap();
