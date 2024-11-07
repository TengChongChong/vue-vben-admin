import type { SysUserOnline } from '#/api/auth/model/sys-user-online-model';

import { requestClient } from '#/api/request';

// base url
const BASE_URL = '/auth/sys/online';

/**
 * 获取在线用户
 *
 * @param params 查询条件
 */
export function selectApi(params: SysUserOnline) {
  return requestClient.get<SysUserOnline[]>(BASE_URL, { params });
}

/**
 * 踢出用户
 *
 * @param token token
 */
export function forceLoginApi(token: string) {
  return requestClient.post<boolean>(`${BASE_URL}/force/logout/${token}`);
}
