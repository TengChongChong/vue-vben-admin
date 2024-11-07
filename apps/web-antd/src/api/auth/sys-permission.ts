import type { SysPermission } from '#/api/auth/model/sys-permission-model';
import type { TreeNodeModel } from '#/api/base/model/tree-model';

import { requestClient } from '#/api/request';

// base url
const BASE_URL = '/auth/sys/permission';

/**
 * 查询
 *
 * @param params 查询条件
 */
export function selectApi(params: SysPermission) {
  return requestClient.get<SysPermission[]>(BASE_URL, { params });
}

/**
 * 查询所有
 */
export function selectAllApi() {
  return requestClient.get<TreeNodeModel[]>(`${BASE_URL}/all`);
}

/**
 * 详情
 *
 * @param id id
 */
export function getApi(id: string) {
  return requestClient.get<SysPermission>(`${BASE_URL}/${id}`);
}

/**
 * 新增
 *
 * @param id 父id
 */
export function addApi(id: string | undefined) {
  return requestClient.get<SysPermission>(`${BASE_URL}/add/${id || ''}`);
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
 * 保存
 *
 * @param params 表单数据
 */
export function saveApi(params: SysPermission) {
  return requestClient.post<SysPermission>(BASE_URL, params);
}

/**
 * 保存排序
 *
 * @param params 表单数据
 */
export function saveOrderApi(params: SysPermission[]) {
  return requestClient.post<SysPermission>(`${BASE_URL}/order`, params);
}

/**
 * 设置状态
 *
 * @param ids ids
 * @param status 状态
 * @param type 类型
 */
export function setStatusApi(ids: string, status: string, type: string) {
  return requestClient.post<boolean>(
    `${BASE_URL}/${ids}/status/${status}/type/${type}`,
  );
}
