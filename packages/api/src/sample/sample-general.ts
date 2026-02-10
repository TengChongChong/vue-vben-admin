import type { Page } from '#/api/base/model/page-model';
import type { SampleGeneralVO } from '#/api/sample/model/sample-general-model';

import { getRequestClient } from '../request-context';

// base url
const BASE_URL = '/auth/sample/general';
/**
 * 查询数据
 *
 * @param params 查询条件
 * @param page 分页
 */
export function selectSampleGeneralApi(
  params: SampleGeneralVO,
  page: Page<SampleGeneralVO>,
) {
  return getRequestClient().get<Page<SampleGeneralVO>>(BASE_URL, {
    params: Object.assign(params, page),
  });
}

/**
 * 查询详情
 *
 * @param id id
 */
export function getSampleGeneralApi(id: string) {
  return getRequestClient().get<SampleGeneralVO>(`${BASE_URL}/${id}`);
}
/**
 * 新增
 */
export function addSampleGeneralApi() {
  return getRequestClient().get<SampleGeneralVO>(`${BASE_URL}/add`);
}

/**
 * 删除
 *
 * @param ids ids
 */
export function removeSampleGeneralApi(ids: string) {
  return getRequestClient().delete<boolean>(`${BASE_URL}/${ids}`);
}

/**
 * 保存/修改
 *
 * @param params 表单数据
 */
export function saveSampleGeneralApi(params: SampleGeneralVO) {
  return getRequestClient().post<SampleGeneralVO>(BASE_URL, params);
}

/**
 * 导出数据
 *
 * @param params 查询条件
 */
export function exportSampleGeneralDataApi(params: SampleGeneralVO) {
  return getRequestClient().get<string>(`${BASE_URL}/export/data`, {
    params,
  });
}
