import { Module } from '@nestjs/common';
import { RecipientService } from './recipient.service';
import { RecipientController } from './recipient.controller';
import { SchedulerService } from '../scheduler/scheduler.service';

@Module({
  controllers: [RecipientController],
  providers: [RecipientService, SchedulerService],
})
export class RecipientModule {}
