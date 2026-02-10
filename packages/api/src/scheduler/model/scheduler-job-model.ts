import type { BasicModel } from '#/api/base/model/base-model';

/**
 * 定时任务
 */
export interface SchedulerJob extends BasicModel {
  // bean
  bean: string;
  // 代码
  code: string;
  // cron表达式
  cron: string;
  // 上次执行时间
  lastRunDate: Date;
  // 方法
  method: string;
  // 名称
  name: string;
  // 是否系统
  sys: string;
}
