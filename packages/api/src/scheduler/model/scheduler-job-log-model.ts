import type { BasicModel } from '#/api/base/model/base-model';

/**
 * 定时任务执行日志
 */
export interface SchedulerJobLog extends BasicModel {
  // 执行时间
  runDate: Date;
  // 任务id
  schedulerJobId: string;
  // 耗时
  timeConsuming: number;
}
