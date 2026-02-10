import type { RouteRecordStringComponent } from '@vben/types';

import { getRequestClient } from '../request-context';

/**
 * 获取用户所有菜单
 */
export async function getAllMenusApi() {
  return getRequestClient().get<RouteRecordStringComponent[]>('/menu/all');
}
