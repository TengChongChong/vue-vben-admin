import type { Page } from '#/api/base/model/page-model';
import type { SysException } from '#/api/sys/model/sys-exception-model';

import { getRequestClient } from '../request-context';
// base url
const BASE_URL = '/auth/sys/exception';

/**
 * 查询
 *
 * @param params 查询条件
 * @param page 分页
 */
export function selectSysExceptionApi(
  params: SysException,
  page: Page<SysException>,
) {
  return getRequestClient().get<Page<SysException>>(BASE_URL, {
    params: Object.assign(params, page),
  });
}

/**
 * 详情
 *
 * @param id id
 */
export function getSysExceptionApi(id: string) {
  return getRequestClient().get<SysException>(`${BASE_URL}/${id}`);
}
/**
 * 删除
 *
 * @param ids ids
 */
export function removeSysExceptionApi(ids: string) {
  return getRequestClient().delete<boolean>(`${BASE_URL}/${ids}`);
}
