import type { SysRole, SysRoleVO } from '#/api/auth/model/sys-role-model';
import type { Page } from '#/api/base/model/page-model';

import { getRequestClient } from '../request-context';

// base url
const BASE_URL = '/auth/sys/role';

/**
 * 查询
 *
 * @param params 查询条件
 * @param page 分页
 */
export function selectSysRoleApi(params: SysRole, page: Page<SysRole>) {
  return getRequestClient().get<Page<SysRole>>(BASE_URL, {
    params: Object.assign(params, page),
  });
}

/**
 * 查询所有
 */
export function selectAllSysRoleApi() {
  return getRequestClient().get<SysRole[]>(`${BASE_URL}/all`);
}

/**
 * 详情
 *
 * @param id id
 */
export function getSysRoleApi(id: string) {
  return getRequestClient().get<SysRole>(`${BASE_URL}/${id}`);
}

/**
 * 新增
 */
export function addSysRoleApi() {
  return getRequestClient().get<SysRoleVO>(`${BASE_URL}/add`);
}

/**
 * 删除
 *
 * @param ids ids
 */
export function removeSysRoleApi(ids: string) {
  return getRequestClient().delete<boolean>(`${BASE_URL}/${ids}`);
}

/**
 * 保存
 *
 * @param params 表单数据
 */
export function saveSysRoleApi(params: SysRoleVO) {
  return getRequestClient().post<SysRoleVO>(BASE_URL, params);
}

/**
 * 设置状态
 *
 * @param ids ids
 * @param status 状态
 */
export function setSysRoleStatusApi(ids: string, status: string) {
  return getRequestClient().post<boolean>(
    `${BASE_URL}/${ids}/status/${status}`,
  );
}

/**
 * 根据部门类型获取可分配的角色数据
 *
 * @param deptId 部门id
 * @return List<SysRole>
 */
export function selectRoleByDeptApi(deptId: string) {
  return getRequestClient().get<SysRole[]>(`${BASE_URL}/select/role/by/dept`, {
    params: { deptId },
  });
}

/**
 * 刷新缓存数据
 */
export function refreshSysRoleCacheApi() {
  return getRequestClient().post<boolean>(`${BASE_URL}/refresh`);
}
