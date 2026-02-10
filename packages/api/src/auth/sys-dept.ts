import type { SysDept, SysDeptVO } from '#/api/auth/model/sys-dept-model';
import type { TreeNodeModel } from '#/api/base/model/tree-model';

import { getRequestClient } from '../request-context';

// base url
const BASE_URL = '/auth/sys/dept';

/**
 * 查询
 *
 * @param params 查询条件
 */
export function selectSysDeptApi(params: SysDeptVO) {
  return getRequestClient().get<SysDeptVO[]>(BASE_URL, { params });
}

/**
 * 查询所有
 */
export function selectAllSysDeptApi() {
  return getRequestClient().get<TreeNodeModel[]>(`${BASE_URL}/all`);
}

/**
 * 详情
 *
 * @param id id
 */
export function getSysDeptApi(id: string) {
  return getRequestClient().get<SysDept>(`${BASE_URL}/${id}`);
}

/**
 * 新增
 *
 * @param id 父id
 * @param typeCode 部门类型代码
 */
export function addSysDeptApi(
  id: string | undefined,
  typeCode: string | undefined,
) {
  return getRequestClient().get<SysDept>(
    `${BASE_URL}/add${id ? `/${id}` : ''}`,
    {
      params: { typeCode },
    },
  );
}

/**
 * 删除
 *
 * @param ids ids
 */
export function removeSysDeptApi(ids: string) {
  return getRequestClient().delete<boolean>(`${BASE_URL}/${ids}`);
}

/**
 * 保存
 *
 * @param params 表单数据
 */
export function saveSysDeptApi(params: SysDept) {
  return getRequestClient().post<SysDept>(BASE_URL, params);
}

/**
 * 保存排序
 *
 * @param params 表单数据
 */
export function saveSysDeptOrderApi(params: SysDept[]) {
  return getRequestClient().post<SysDept>(`${BASE_URL}/order`, params);
}

/**
 * 设置状态
 *
 * @param ids ids
 * @param status 状态
 */
export function setSysDeptStatusApi(ids: string, status: string) {
  return getRequestClient().post<boolean>(
    `${BASE_URL}/${ids}/status/${status}`,
  );
}
