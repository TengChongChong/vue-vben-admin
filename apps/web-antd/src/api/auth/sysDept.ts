import type { SysDept, SysDeptVO } from '#/api/auth/model/sysDeptModel';
import type { TreeNodeModel } from '#/api/base/model/treeModel';

import { requestClient } from '#/api/request';

// base url
const BASE_URL = '/auth/sys/dept';

/**
 * 查询
 *
 * @param params 查询条件
 */
export function selectApi(params: SysDeptVO) {
  return requestClient.get<SysDeptVO[]>(BASE_URL, { params });
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
  return requestClient.get<SysDept>(`${BASE_URL}/${id}`);
}

/**
 * 新增
 *
 * @param id 父id
 * @param typeCode 部门类型代码
 */
export function addApi(id: string | undefined, typeCode: string | undefined) {
  return requestClient.get<SysDept>(`${BASE_URL}/add/${id || ''}`, {
    params: { typeCode },
  });
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
export function saveApi(params: SysDept) {
  return requestClient.post<SysDept>(BASE_URL, params);
}

/**
 * 保存排序
 *
 * @param params 表单数据
 */
export function saveOrderApi(params: SysDept[]) {
  return requestClient.post<SysDept>(`${BASE_URL}/order`, params);
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
