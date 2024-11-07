import type { Page } from '#/api/base/model/page-model';
import type { SchedulerJobLog } from '#/api/scheduler/model/scheduler-job-log-model';

import { requestClient } from '#/api/request';

// base url
const BASE_URL = '/auth/scheduler/job/log';

/**
 * 查询
 *
 * @param params 查询条件
 * @param page 分页
 */
export function selectApi(
  params: SchedulerJobLog,
  page: Page<SchedulerJobLog>,
) {
  return requestClient.get<Page<SchedulerJobLog>>(BASE_URL, {
    params: Object.assign(params, page),
  });
}
