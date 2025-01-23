import { SchedulerRegistry } from "@nestjs/schedule";
export declare class TaskService {
    private schedulerRegistry;
    private readonly logger;
    constructor(schedulerRegistry: SchedulerRegistry);
    scheduleCronTask(name: string, cronExpression: string, callback: () => void): void;
    scheduleTimeoutTask(name: string, milliseconds: number, callback: () => void): void;
    scheduleIntervalTask(name: string, milliseconds: number, callback: () => void): void;
    cancelTask(name: string): void;
}
