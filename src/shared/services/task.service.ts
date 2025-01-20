import { Injectable, Logger } from "@nestjs/common";
import {
  Cron,
  CronExpression,
  SchedulerRegistry,
  Timeout,
} from "@nestjs/schedule";
import { CronJob } from "cron";

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(private schedulerRegistry: SchedulerRegistry) {}

  scheduleCronTask(
    name: string,
    cronExpression: string,
    callback: () => void,
  ): void {
    const job = new CronJob(cronExpression, callback);

    this.schedulerRegistry.addCronJob(name, job);
    job.start();

    this.logger.log(
      `Scheduled task '${name}' with cron expression '${cronExpression}'`,
    );
  }

  scheduleTimeoutTask(
    name: string,
    milliseconds: number,
    callback: () => void,
  ): void {
    const timeout = setTimeout(callback, milliseconds);
    this.schedulerRegistry.addTimeout(name, timeout);

    this.logger.log(
      `Scheduled one-time task '${name}' with timeout of ${milliseconds}ms`,
    );
  }

  scheduleIntervalTask(
    name: string,
    milliseconds: number,
    callback: () => void,
  ): void {
    const interval = setInterval(callback, milliseconds);
    this.schedulerRegistry.addInterval(name, interval);

    this.logger.log(
      `Scheduled interval task '${name}' with interval of ${milliseconds}ms`,
    );
  }

  cancelTask(name: string): void {
    if (this.schedulerRegistry.doesExist("cron", name)) {
      this.schedulerRegistry.deleteCronJob(name);
      this.logger.log(`Cancelled cron task '${name}'`);
    } else if (this.schedulerRegistry.doesExist("interval", name)) {
      this.schedulerRegistry.deleteInterval(name);
      this.logger.log(`Cancelled interval task '${name}'`);
    } else if (this.schedulerRegistry.doesExist("timeout", name)) {
      this.schedulerRegistry.deleteTimeout(name);
      this.logger.log(`Cancelled timeout task '${name}'`);
    } else {
      this.logger.warn(`No task found with name '${name}'`);
    }
  }
}
