
import { Module } from '@nestjs/common';
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
