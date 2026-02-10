import type { Page } from '#/api/base/model/page-model';
import type { SelectModel } from '#/api/base/model/select-model';
import type { SysDataSource } from '#/api/sys/model/sys-data-source-model';

import { getRequestClient } from '../request-context';
// base url
const BASE_URL = '/auth/sys/data/source';

/**
 * 查询
 *
 * @param params 查询条件
 * @param page 分页
 */
export function selectSysDataSourceApi(
  params: SysDataSource,
  page: Page<SysDataSource>,
) {
  return getRequestClient().get<Page<SysDataSource>>(BASE_URL, {
    params: Object.assign(params, page),
  });
}

/**
 * 详情
 *
 * @param id id
 */
export function getSysDataSourceApi(id: string) {
  return getRequestClient().get<SysDataSource>(`${BASE_URL}/${id}`);
}

/**
 * 新增
 */
export function addSysDataSourceApi() {
  return getRequestClient().get<SysDataSource>(`${BASE_URL}/add`);
}

/**
 * 删除
 *
 * @param ids ids
 */
export function removeSysDataSourceApi(ids: string) {
  return getRequestClient().delete<boolean>(`${BASE_URL}/${ids}`);
}

/**
 * 保存
 *
 * @param params 表单数据
 */
export function saveSysDataSourceApi(params: SysDataSource) {
  return getRequestClient().post<SysDataSource>(BASE_URL, params);
}

/**
 * 获取数据源
 */
export function selectOptionsApi() {
  return getRequestClient().get<SelectModel[]>(`${BASE_URL}/select/options`);
}
