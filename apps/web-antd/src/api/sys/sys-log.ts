import type { Page } from '#/api/base/model/page-model';
import type { SysLog } from '#/api/sys/model/sys-log-model';

import { requestClient } from '#/api/request';
// base url
const BASE_URL = '/auth/sys/log';

/**
 * 查询
 *
 * @param params 查询条件
 * @param page 分页
 */
export function selectApi(params: SysLog, page: Page<SysLog>) {
  return requestClient.get<Page<SysLog>>(BASE_URL, {
    params: Object.assign(params, page),
  });
}

/**
 * 详情
 *
 * @param id id
 */
export function getApi(id: string) {
  return requestClient.get<SysLog>(`${BASE_URL}/${id}`);
}
