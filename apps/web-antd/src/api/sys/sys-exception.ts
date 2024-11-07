import type { Page } from '#/api/base/model/page-model';
import type { SysException } from '#/api/sys/model/sys-exception-model';

import { requestClient } from '#/api/request';
// base url
const BASE_URL = '/auth/sys/exception';

/**
 * 查询
 *
 * @param params 查询条件
 * @param page 分页
 */
export function selectApi(params: SysException, page: Page<SysException>) {
  return requestClient.get<Page<SysException>>(BASE_URL, {
    params: Object.assign(params, page),
  });
}

/**
 * 详情
 *
 * @param id id
 */
export function getApi(id: string) {
  return requestClient.get<SysException>(`${BASE_URL}/${id}`);
}
/**
 * 删除
 *
 * @param ids ids
 */
export function removeApi(ids: string) {
  return requestClient.delete<boolean>(`${BASE_URL}/${ids}`);
}
