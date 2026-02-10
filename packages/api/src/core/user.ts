import type { UserInfo } from '@vben/types';

import { getRequestClient } from '../request-context';

/**
 * 获取用户信息
 */
export function getUserInfoApi() {
  return getRequestClient().get<UserInfo>('/user/info');
}
