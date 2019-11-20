import { Atendee } from './atendee/atendee.entity';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AtendeeModule } from './atendee/atendee.module';

import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [AtendeeModule,

    // database
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'burgosDB',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    })],
  controllers: [],
  providers: [],
})
export class AppModule { }
