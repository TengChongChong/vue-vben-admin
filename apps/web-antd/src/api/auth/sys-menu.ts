import type { Page } from '#/api/base/model/page-model';
import type { TreeNodeModel } from '#/api/base/model/tree-model';
import type { SysMenu, SysMenuVO } from '#/api/sys/model/sys-menu-model';

import { requestClient } from '#/api/request';

// base url
const BASE_URL = '/auth/sys/menu';
/**
 * 查询数据（无分页）
 *
 * @param params 查询条件
 */
export function selectApi(params: SysMenuVO) {
  return requestClient.get<Page<SysMenuVO>>(BASE_URL, {
    params,
  });
}
/**
 * 查询所有数据（Tree）
 */
export function selectAllApi() {
  return requestClient.get<TreeNodeModel[]>(`${BASE_URL}/all`);
}

/**
 * 查询详情
 *
 * @param id id
 */
export function getApi(id: string) {
  return requestClient.get<SysMenuVO>(`${BASE_URL}/${id}`);
}
/**
 * 新增或新增下级
 *
 * @param parentId 父id
 */
export function addApi(parentId: string | undefined) {
  return requestClient.get<SysMenuVO>(
    `${BASE_URL}/add${parentId ? `/${parentId}` : ''}`,
  );
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
export function saveApi(params: SysMenuVO) {
  return requestClient.post<SysMenuVO>(BASE_URL, params);
}

/**
 * 保存排序&结构
 *
 * @param params 表单数据
 */
export function saveOrderApi(params: SysMenu[]) {
  return requestClient.post<SysMenu>(`${BASE_URL}/order`, params);
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
