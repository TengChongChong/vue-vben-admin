import type { Page } from '#/api/base/model/page-model';
import type { SchedulerJob } from '#/api/scheduler/model/scheduler-job-model';

import { requestClient } from '#/api/request';
// base url
const BASE_URL = '/auth/scheduler/job';

/**
 * 查询
 *
 * @param params 查询条件
 * @param page 分页
 */
export function selectApi(params: SchedulerJob, page: Page<SchedulerJob>) {
  return requestClient.get<Page<SchedulerJob>>(BASE_URL, {
    params: Object.assign(params, page),
  });
}

/**
 * 详情
 *
 * @param id id
 */
export function getApi(id: string) {
  return requestClient.get<SchedulerJob>(`${BASE_URL}/${id}`);
}

/**
 * 新增
 */
export function addApi() {
  return requestClient.get<SchedulerJob>(`${BASE_URL}/add`);
}

/**
 * 删除
 *
 * @param ids ids
 */
export function removeApi(ids: string) {
  return requestClient.delete<boolean>(`${BASE_URL}/${ids}`);
}

/**
 * 保存
 *
 * @param params 表单数据
 */
export function saveApi(params: SchedulerJob) {
  return requestClient.post<SchedulerJob>(BASE_URL, params);
}

/**
 * 开启
 *
 * @param id 数据id
 */
export function startApi(id) {
  return requestClient.post<boolean>(`${BASE_URL}/start/${id}`);
}

/**
 * 暂停
 *
 * @param id 数据id
 */
export function pauseApi(id) {
  return requestClient.post<boolean>(`${BASE_URL}/pause/${id}`);
}

/**
 * 全部开启
 */
export function startAllApi() {
  return requestClient.post<boolean>(`${BASE_URL}/start/all`);
}

/**
 * 全部暂停
 */
export function pauseAllApi() {
  return requestClient.post<boolean>(`${BASE_URL}/pause/all`);
}

/**
 * 立即执行指定任务
 *
 * @param id 数据id
 */
export function immediateExecutionApi(id) {
  return requestClient.post<boolean>(`${BASE_URL}/immediate/execution/${id}`);
}
