import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActorsModule } from './modules/actors/actors.module';

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
    ActorsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
