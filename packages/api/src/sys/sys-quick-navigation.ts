import type {
  SysQuickNavigation,
  SysQuickNavigationVO,
} from '#/api/sys/model/sys-quick-navigation-model';

import { getRequestClient } from '../request-context';

// base url
const BASE_URL = '/auth/sys/quick/navigation';
/**
 * 查询数据
 *
 * @param params 查询条件
 */
export function selectSysQuickNavigationApi(params: SysQuickNavigationVO) {
  return getRequestClient().get<SysQuickNavigationVO[]>(BASE_URL, {
    params,
  });
}

/**
 * 查询详情
 *
 * @param id id
 */
export function getSysQuickNavigationApi(id: string) {
  return getRequestClient().get<SysQuickNavigationVO>(`${BASE_URL}/${id}`);
}
/**
 * 新增
 */
export function addSysQuickNavigationApi() {
  return getRequestClient().get<SysQuickNavigationVO>(`${BASE_URL}/add`);
}

/**
 * 删除
 *
 * @param ids ids
 */
export function removeSysQuickNavigationApi(ids: string) {
  return getRequestClient().delete<boolean>(`${BASE_URL}/${ids}`);
}

/**
 * 保存/修改
 *
 * @param params 表单数据
 */
export function saveSysQuickNavigationApi(params: SysQuickNavigationVO) {
  return getRequestClient().post<SysQuickNavigationVO>(BASE_URL, params);
}

/**
 * 保存排序
 *
 * @param params 表单数据
 */
export function saveOrderNoApi(params: SysQuickNavigation[]) {
  return getRequestClient().post<SysQuickNavigationVO>(
    `${BASE_URL}/order/no`,
    params,
  );
}
