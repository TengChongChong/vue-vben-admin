import type {
  SysQuickNavigation,
  SysQuickNavigationVO,
} from '#/api/sys/model/sys-quick-navigation-model';

import { requestClient } from '#/api/request';

// base url
const BASE_URL = '/auth/sys/quick/navigation';
/**
 * 查询数据
 *
 * @param params 查询条件
 */
export function selectApi(params: SysQuickNavigationVO) {
  return requestClient.get<SysQuickNavigationVO[]>(BASE_URL, {
    params,
  });
}

/**
 * 查询详情
 *
 * @param id id
 */
export function getApi(id: string) {
  return requestClient.get<SysQuickNavigationVO>(`${BASE_URL}/${id}`);
}
/**
 * 新增
 */
export function addApi() {
  return requestClient.get<SysQuickNavigationVO>(`${BASE_URL}/add`);
}

/**
 * 删除
 *
 * @param ids ids
 */
export function removeApi(ids: string) {
  return requestClient.delete<boolean>(`${BASE_URL}/${ids}`);
}

/**
 * 保存/修改
 *
 * @param params 表单数据
 */
export function saveApi(params: SysQuickNavigationVO) {
  return requestClient.post<SysQuickNavigationVO>(BASE_URL, params);
}

/**
 * 保存排序
 *
 * @param params 表单数据
 */
export function saveOrderNoApi(params: SysQuickNavigation[]) {
  return requestClient.post<SysQuickNavigationVO>(
    `${BASE_URL}/order/no`,
    params,
  );
}
