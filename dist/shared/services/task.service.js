"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var TaskService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const cron_1 = require("cron");
let TaskService = TaskService_1 = class TaskService {
    constructor(schedulerRegistry) {
        this.schedulerRegistry = schedulerRegistry;
        this.logger = new common_1.Logger(TaskService_1.name);
    }
    scheduleCronTask(name, cronExpression, callback) {
        const job = new cron_1.CronJob(cronExpression, callback);
        this.schedulerRegistry.addCronJob(name, job);
        job.start();
        this.logger.log(`Scheduled task '${name}' with cron expression '${cronExpression}'`);
    }
    scheduleTimeoutTask(name, milliseconds, callback) {
        const timeout = setTimeout(callback, milliseconds);
        this.schedulerRegistry.addTimeout(name, timeout);
        this.logger.log(`Scheduled one-time task '${name}' with timeout of ${milliseconds}ms`);
    }
    scheduleIntervalTask(name, milliseconds, callback) {
        const interval = setInterval(callback, milliseconds);
        this.schedulerRegistry.addInterval(name, interval);
        this.logger.log(`Scheduled interval task '${name}' with interval of ${milliseconds}ms`);
    }
    cancelTask(name) {
        if (this.schedulerRegistry.doesExist("cron", name)) {
            this.schedulerRegistry.deleteCronJob(name);
            this.logger.log(`Cancelled cron task '${name}'`);
        }
        else if (this.schedulerRegistry.doesExist("interval", name)) {
            this.schedulerRegistry.deleteInterval(name);
            this.logger.log(`Cancelled interval task '${name}'`);
        }
        else if (this.schedulerRegistry.doesExist("timeout", name)) {
            this.schedulerRegistry.deleteTimeout(name);
            this.logger.log(`Cancelled timeout task '${name}'`);
        }
        else {
            this.logger.warn(`No task found with name '${name}'`);
        }
    }
};
TaskService = TaskService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [schedule_1.SchedulerRegistry])
], TaskService);
exports.TaskService = TaskService;
//# sourceMappingURL=task.service.js.map