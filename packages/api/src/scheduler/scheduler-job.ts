import type { Page } from '#/api/base/model/page-model';
import type { SchedulerJob } from '#/api/scheduler/model/scheduler-job-model';

import { getRequestClient } from '../request-context';
// base url
const BASE_URL = '/auth/scheduler/job';

/**
 * 查询
 *
 * @param params 查询条件
 * @param page 分页
 */
export function selectSchedulerJobApi(
  params: SchedulerJob,
  page: Page<SchedulerJob>,
) {
  return getRequestClient().get<Page<SchedulerJob>>(BASE_URL, {
    params: Object.assign(params, page),
  });
}

/**
 * 详情
 *
 * @param id id
 */
export function getSchedulerJobApi(id: string) {
  return getRequestClient().get<SchedulerJob>(`${BASE_URL}/${id}`);
}

/**
 * 新增
 */
export function addSchedulerJobApi() {
  return getRequestClient().get<SchedulerJob>(`${BASE_URL}/add`);
}

/**
 * 删除
 *
 * @param ids ids
 */
export function removeSchedulerJobApi(ids: string) {
  return getRequestClient().delete<boolean>(`${BASE_URL}/${ids}`);
}

/**
 * 保存
 *
 * @param params 表单数据
 */
export function saveSchedulerJobApi(params: SchedulerJob) {
  return getRequestClient().post<SchedulerJob>(BASE_URL, params);
}

/**
 * 开启
 *
 * @param id 数据id
 */
export function startSchedulerJobApi(id: string) {
  return getRequestClient().post<boolean>(`${BASE_URL}/start/${id}`);
}

/**
 * 暂停
 *
 * @param id 数据id
 */
export function pauseSchedulerJobApi(id: string) {
  return getRequestClient().post<boolean>(`${BASE_URL}/pause/${id}`);
}

/**
 * 全部开启
 */
export function startAllSchedulerJobApi() {
  return getRequestClient().post<boolean>(`${BASE_URL}/start/all`);
}

/**
 * 全部暂停
 */
export function pauseAllSchedulerJobApi() {
  return getRequestClient().post<boolean>(`${BASE_URL}/pause/all`);
}

/**
 * 立即执行指定任务
 *
 * @param id 数据id
 */
export function immediateExecutionSchedulerJobApi(id: string) {
  return getRequestClient().post<boolean>(
    `${BASE_URL}/immediate/execution/${id}`,
  );
}
