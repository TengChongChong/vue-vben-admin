import type { SysUser } from '#/api/auth/model/sysUserModel';
import type { Page } from '#/api/base/model/pageModel';

import { requestClient } from '#/api/request';

// base url
const BASE_URL = '/auth/sys/user';

/**
 * 查询
 *
 * @param params 查询条件
 */
export function selectApi(params: SysUser) {
  return requestClient.get<Page<SysUser>>(BASE_URL, { params });
}

/**
 * 搜索用户
 *
 * @param keyword 关键字
 * @param range 范围
 * @param deptId 部门Id，传入此参数时将忽略`range`
 * @param page 分页
 */
export function searchApi(
  keyword: string,
  range: string,
  deptId: string,
  page: Page<SysUser>,
) {
  return requestClient.get<Page<SysUser>>(`${BASE_URL}/search`, {
    params: {
      keyword,
      range,
      deptId,
      ...page,
    },
  });
}
/**
 * 获取指定用户信息，用于回显已选择的用户
 *
 * @param ids ids
 */
export function selectUsersByIdsApi(ids: string | string[]) {
  return requestClient.get<SysUser[]>(
    `${BASE_URL}/users/${Array.isArray(ids) ? ids.join(',') : ids}`,
  );
}

/**
 * 详情
 *
 * @param id id
 */
export function getApi(id: string) {
  return requestClient.get<SysUser>(`${BASE_URL}/${id}`);
}

/**
 * 新增
 *
 * @param deptId 部门id
 */
export function addApi(deptId: string) {
  return requestClient.get<SysUser>(`${BASE_URL}/add/${deptId}`);
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
export function saveApi(params: SysUser) {
  return requestClient.post<SysUser>(BASE_URL, params);
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
 * 重置密码
 *
 * @param ids 用户ids
 */
export function resetPasswordApi(ids: string) {
  return requestClient.post<string>(`${BASE_URL}/reset/password/${ids}`);
}
