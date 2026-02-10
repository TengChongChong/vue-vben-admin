import type { Page } from '#/api/base/model/page-model';
import type { SelectModel } from '#/api/base/model/select-model';
import type { SysDictType } from '#/api/sys/model/sys-dict-type-model';

import { getRequestClient } from '../request-context';
// base url
const BASE_URL = '/auth/sys/dict/type';

/**
 * 查询
 *
 * @param params 查询条件
 * @param page 分页
 */
export function selectSysDictTypeApi(
  params: SysDictType,
  page: Page<SysDictType>,
) {
  return getRequestClient().get<Page<SysDictType>>(BASE_URL, {
    params: Object.assign(params, page),
  });
}

/**
 * 查询所有
 */
export function selectAllSysDictTypeApi() {
  return getRequestClient().get<SelectModel[]>(`${BASE_URL}/all`);
}

/**
 * 详情
 *
 * @param id id
 */
export function getSysDictTypeApi(id: string) {
  return getRequestClient().get<SysDictType>(`${BASE_URL}/${id}`);
}

/**
 * 新增
 */
export function addSysDictTypeApi() {
  return getRequestClient().get<SysDictType>(`${BASE_URL}/add`);
}

/**
 * 删除
 *
 * @param ids ids
 */
export function removeSysDictTypeApi(ids: string) {
  return getRequestClient().delete<boolean>(`${BASE_URL}/${ids}`);
}

/**
 * 保存
 *
 * @param params 表单数据
 */
export function saveSysDictTypeApi(params: SysDictType) {
  return getRequestClient().post<SysDictType>(BASE_URL, params);
}

/**
 * 导出数据
 *
 * @param params 查询条件
 */
export function exportSysDictTypeDataApi(params: SysDictType) {
  return getRequestClient().get<string>(`${BASE_URL}/export/data`, { params });
}
