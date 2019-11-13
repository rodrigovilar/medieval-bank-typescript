import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AtendeeModule } from './atendee/atendee.module';

@Module({
  imports: [AtendeeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
