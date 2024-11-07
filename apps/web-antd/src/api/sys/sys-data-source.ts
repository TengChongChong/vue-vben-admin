import type { Page } from '#/api/base/model/page-model';
import type { SelectModel } from '#/api/base/model/select-model';
import type { SysDataSource } from '#/api/sys/model/sys-data-source-model';

import { requestClient } from '#/api/request';
// base url
const BASE_URL = '/auth/sys/data/source';

/**
 * 查询
 *
 * @param params 查询条件
 * @param page 分页
 */
export function selectApi(params: SysDataSource, page: Page<SysDataSource>) {
  return requestClient.get<Page<SysDataSource>>(BASE_URL, {
    params: Object.assign(params, page),
  });
}

/**
 * 详情
 *
 * @param id id
 */
export function getApi(id: string) {
  return requestClient.get<SysDataSource>(`${BASE_URL}/${id}`);
}

/**
 * 新增
 */
export function addApi() {
  return requestClient.get<SysDataSource>(`${BASE_URL}/add`);
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
export function saveApi(params: SysDataSource) {
  return requestClient.post<SysDataSource>(BASE_URL, params);
}

/**
 * 获取数据源
 */
export function selectOptionsApi() {
  return requestClient.get<SelectModel[]>(`${BASE_URL}/select/options`);
}
