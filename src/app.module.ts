import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActorsModule } from './modules/actors/actors.module';
import { FilmsModule } from './modules/films/films.module';
import { LoggerMiddleware } from './shared/middleware/logger.middleware';
import { WinstonModule } from 'nest-winston';
import { loggerConfig } from './configs/logger.config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'sakila',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
    }),
    WinstonModule.forRoot({ ...loggerConfig }),
    ActorsModule,
    FilmsModule,
  ],
  controllers: [],
  providers: [Logger],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
