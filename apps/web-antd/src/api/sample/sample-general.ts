import type { Page } from '#/api/base/model/page-model';
import type { SampleGeneralVO } from '#/api/sample/model/sample-general-model';

import { requestClient } from '#/api/request';

// base url
const BASE_URL = '/auth/sample/general';
/**
 * 查询数据
 *
 * @param params 查询条件
 * @param page 分页
 */
export function selectApi(
  params: SampleGeneralVO,
  page: Page<SampleGeneralVO>,
) {
  return requestClient.get<Page<SampleGeneralVO>>(BASE_URL, {
    params: Object.assign(params, page),
  });
}

/**
 * 查询详情
 *
 * @param id id
 */
export function getApi(id: string) {
  return requestClient.get<SampleGeneralVO>(`${BASE_URL}/${id}`);
}
/**
 * 新增
 */
export function addApi() {
  return requestClient.get<SampleGeneralVO>(`${BASE_URL}/add`);
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
 * 保存/修改
 *
 * @param params 表单数据
 */
export function saveApi(params: SampleGeneralVO) {
  return requestClient.post<SampleGeneralVO>(BASE_URL, params);
}

/**
 * 导出数据
 *
 * @param params 查询条件
 */
export function exportDataApi(params: SampleGeneralVO) {
  return requestClient.get<string>(`${BASE_URL}/export/data`, {
    params,
  });
}
