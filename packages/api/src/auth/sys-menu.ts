import type { Page } from '#/api/base/model/page-model';
import type { TreeNodeModel } from '#/api/base/model/tree-model';
import type { SysMenu, SysMenuVO } from '#/api/sys/model/sys-menu-model';

import { getRequestClient } from '../request-context';

// base url
const BASE_URL = '/auth/sys/menu';
/**
 * 查询数据（无分页）
 *
 * @param params 查询条件
 */
export function selectSysMenuApi(params: SysMenuVO) {
  return getRequestClient().get<Page<SysMenuVO>>(BASE_URL, {
    params,
  });
}
/**
 * 查询所有数据（Tree）
 */
export function selectAllSysMenuApi() {
  return getRequestClient().get<TreeNodeModel[]>(`${BASE_URL}/all`);
}

/**
 * 查询详情
 *
 * @param id id
 */
export function getSysMenuApi(id: string) {
  return getRequestClient().get<SysMenuVO>(`${BASE_URL}/${id}`);
}
/**
 * 新增或新增下级
 *
 * @param parentId 父id
 */
export function addSysMenuApi(parentId: string | undefined) {
  return getRequestClient().get<SysMenuVO>(
    `${BASE_URL}/add${parentId ? `/${parentId}` : ''}`,
  );
}

/**
 * 删除
 *
 * @param ids ids
 */
export function removeSysMenuApi(ids: string) {
  return getRequestClient().delete<boolean>(`${BASE_URL}/${ids}`);
}

/**
 * 保存/修改
 *
 * @param params 表单数据
 */
export function saveSysMenuApi(params: SysMenuVO) {
  return getRequestClient().post<SysMenuVO>(BASE_URL, params);
}

/**
 * 保存排序&结构
 *
 * @param params 表单数据
 */
export function saveSysMenuOrderApi(params: SysMenu[]) {
  return getRequestClient().post<SysMenu>(`${BASE_URL}/order`, params);
}

/**
 * 设置状态
 *
 * @param ids ids
 * @param status 状态
 * @param type 类型
 */
export function setSysMenuStatusApi(ids: string, status: string, type: string) {
  return getRequestClient().post<boolean>(
    `${BASE_URL}/${ids}/status/${status}/type/${type}`,
  );
}
