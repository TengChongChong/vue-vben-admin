import type { SysRole, SysRoleVO } from '#/api/auth/model/sys-role-model';
import type { Page } from '#/api/base/model/page-model';

import { requestClient } from '#/api/request';

// base url
const BASE_URL = '/auth/sys/role';

/**
 * 查询
 *
 * @param params 查询条件
 * @param page 分页
 */
export function selectApi(params: SysRole, page: Page<SysRole>) {
  return requestClient.get<Page<SysRole>>(BASE_URL, {
    params: Object.assign(params, page),
  });
}

/**
 * 查询所有
 */
export function selectAllApi() {
  return requestClient.get<SysRole[]>(`${BASE_URL}/all`);
}

/**
 * 详情
 *
 * @param id id
 */
export function getApi(id: string) {
  return requestClient.get<SysRole>(`${BASE_URL}/${id}`);
}

/**
 * 新增
 */
export function addApi() {
  return requestClient.get<SysRoleVO>(`${BASE_URL}/add`);
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
export function saveApi(params: SysRoleVO) {
  return requestClient.post<SysRoleVO>(BASE_URL, params);
}

/**
 * 设置状态
 *
 * @param ids ids
 * @param status 状态
 */
export function setStatusApi(ids: string, status: string) {
  return requestClient.post<boolean>(`${BASE_URL}/${ids}/status/${status}`);
}

/**
 * 根据部门类型获取可分配的角色数据
 *
 * @param deptId 部门id
 * @return List<SysRole>
 */
export function selectRoleByDeptApi(deptId: string) {
  return requestClient.get<SysRole[]>(`${BASE_URL}/select/role/by/dept`, {
    params: { deptId },
  });
}

/**
 * 刷新缓存数据
 */
export function refreshApi() {
  return requestClient.post<boolean>(`${BASE_URL}/refresh`);
}
