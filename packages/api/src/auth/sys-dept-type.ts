import type {
  SysDeptType,
  SysDeptTypeVO,
} from '#/api/auth/model/sys-dept-type-model';
import type { TreeNodeModel } from '#/api/base/model/tree-model';

import { getRequestClient } from '../request-context';

// base url
const BASE_URL = '/auth/sys/dept/type';

/**
 * 查询
 *
 * @param params 查询条件
 */
export function selectSysDeptTypeApi(params: SysDeptType) {
  return getRequestClient().get<SysDeptType[]>(BASE_URL, { params });
}

/**
 * 查询所有
 */
export function selectAllDeptTypeApi() {
  return getRequestClient().get<TreeNodeModel[]>(`${BASE_URL}/all`);
}

/**
 * 详情
 *
 * @param id id
 */
export function getSysDeptTypeApi(id: string) {
  return getRequestClient().get<SysDeptTypeVO>(`${BASE_URL}/${id}`);
}

/**
 * 新增
 *
 * @param id 父id
 */
export function addSysDeptTypeApi(id: string | undefined) {
  return getRequestClient().get<SysDeptTypeVO>(
    `${BASE_URL}/add${id ? `/${id}` : ''}`,
  );
}

/**
 * 删除
 *
 * @param ids ids
 */
export function removeSysDeptTypeApi(ids: string) {
  return getRequestClient().delete<boolean>(`${BASE_URL}/${ids}`);
}

/**
 * 保存
 *
 * @param params 表单数据
 */
export function saveSysDeptTypeApi(params: SysDeptTypeVO) {
  return getRequestClient().post<SysDeptTypeVO>(BASE_URL, params);
}

/**
 * 保存排序
 *
 * @param params 表单数据
 */
export function saveSysDeptTypeOrderApi(params: SysDeptType[]) {
  return getRequestClient().post<SysDeptType>(`${BASE_URL}/order`, params);
}

/**
 * 设置状态
 *
 * @param ids ids
 * @param status 状态
 */
export function setSysDeptTypeStatusApi(ids: string, status: string) {
  return getRequestClient().post<boolean>(
    `${BASE_URL}/${ids}/status/${status}`,
  );
}
