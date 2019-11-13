import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AtendeeModule } from './atendee/atendee.module';

import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [AtendeeModule,

    // database
    TypeOrmModule.forRoot({
      type: 'sqlite', // type SGBD
      database: 'burgesDB', // name database
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
