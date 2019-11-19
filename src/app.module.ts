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
      type: 'postgres',
      host: '192.168.99.100',
      port: 5432,
      username: 'postgres',
      password: '1234',
      database: 'teste',
      entities: [Atendee],
      synchronize: true,
    })],
  controllers: [],
  providers: [],
})
export class AppModule { }
