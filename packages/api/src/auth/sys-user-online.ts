import type { SysUserOnline } from '#/api/auth/model/sys-user-online-model';

import { getRequestClient } from '../request-context';

// base url
const BASE_URL = '/auth/sys/online';

/**
 * 获取在线用户
 *
 * @param params 查询条件
 */
export function selectSysUserOnlineApi(params: SysUserOnline) {
  return getRequestClient().get<SysUserOnline[]>(BASE_URL, { params });
}

/**
 * 踢出用户
 *
 * @param token token
 */
export function forceLoginApi(token: string) {
  return getRequestClient().post<boolean>(`${BASE_URL}/force/logout/${token}`);
}
