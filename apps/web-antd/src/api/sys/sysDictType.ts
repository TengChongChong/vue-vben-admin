import type { Page } from '#/api/base/model/pageModel';
import type { SelectModel } from '#/api/base/model/selectModel';
import type { SysDictType } from '#/api/sys/model/sysDictTypeModel';

import { requestClient } from '#/api/request';
// base url
const BASE_URL = '/auth/sys/dict/type';

/**
 * 查询
 *
 * @param params 查询条件
 * @param page 分页
 */
export function selectApi(params: SysDictType, page: Page<SysDictType>) {
  return requestClient.get<Page<SysDictType>>(BASE_URL, {
    params: Object.assign(params, page),
  });
}

/**
 * 查询所有
 */
export function selectAllApi() {
  return requestClient.get<SelectModel[]>(`${BASE_URL}/all`);
}

/**
 * 详情
 *
 * @param id id
 */
export function getApi(id: string) {
  return requestClient.get<SysDictType>(`${BASE_URL}/${id}`);
}

/**
 * 新增
 */
export function addApi() {
  return requestClient.get<SysDictType>(`${BASE_URL}/add`);
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
export function saveApi(params: SysDictType) {
  return requestClient.post<SysDictType>(BASE_URL, params);
}

/**
 * 导出数据
 *
 * @param params 查询条件
 */
export function exportDataApi(params: SysDictType) {
  return requestClient.get<string>(`${BASE_URL}/export/data`, { params });
}
