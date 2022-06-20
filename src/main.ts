import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RedisIoAdapter } from './socket.adapter';
import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { SeqTransport } from '@datalust/winston-seq';
import { format } from "winston";
import { INestApplication } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";


async function bootstrap() {

  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: createTransports()
    }),
  });
  const configService = app.get<ConfigService>(ConfigService);

  const redisIoAdapter = new RedisIoAdapter(app);
  redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      port: 3001,
    },
  });
  createKafkaTransport(app,configService);


  await app.startAllMicroservices();
  await app.listen(3001)
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
function createKafkaTransport(
  app: INestApplication,
  configService: ConfigService) {
  const KAFKA_BROKER = configService.get<string>('KAFKA_BROKER') ?? 'localhost:9092';
  const KAFKA_GROUP_ID = configService.get<string>('KAFKA_GROUP_ID') ?? 'socket';
  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [KAFKA_BROKER],
        retry: {
          initialRetryTime: 1000,
          retries: 100
        }
      },
      consumer: {
        groupId: KAFKA_GROUP_ID,
      },
    },
  });
}

void bootstrap();
