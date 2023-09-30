# HOW TO RUN PROJECT

## Step 1

- Open your terminal or Command Line (CMD) then paste the command below to download source code

```bash
git clone https://github.com/nguyenduchoa0130/sakila.git
```

- Or you can download zip

## Step 2

- Open source with your editor like VS Code,...

## Step 3

- Open terminal again, then enter the command

```bash
npm install
```

## Step 4

- Please download MySQL before go ahead the next step. You can download MySQL from MySQL homepage or use Docker

- Modify the database connection configuration in app.module.ts

```ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActorsModule } from './modules/actors/actors.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: <your host>,
      port: <your port>,
      username: <your username>,
      password: <your password>,
      database: <your database name>,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
```

## Step 4

- Start running server

```bash
npm start
```

or

```bash
# Start with live reload
npm run start:dev
```

## Step 5

- Please use PostMan or something like that for testing.
- If you wanna visit docs, Please following this link: http://localhost:3000/docs

# Happy Coding
