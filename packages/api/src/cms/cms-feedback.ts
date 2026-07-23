import type { Page } from '#/api/base/model/page-model';
import type { CmsFeedback } from '#/api/cms/model/cms-feedback-model';

import { getRequestClient } from '../request-context';

const BASE_URL = '/auth/cms/feedback';

/**
 * 查询数据
 */
export function selectCmsFeedbackApi(
  params: CmsFeedback,
  page: Page<CmsFeedback>,
) {
  return getRequestClient().get<Page<CmsFeedback>>(BASE_URL, {
    params: { ...params, ...page },
  });
}

/**
 * 查询详情
 */
export function getCmsFeedbackApi(id: string) {
  return getRequestClient().get<CmsFeedback>(`${BASE_URL}/${id}`);
}

/**
 * 删除
 */
export function removeCmsFeedbackApi(ids: string) {
  return getRequestClient().delete<boolean>(`${BASE_URL}/${ids}`);
}

/**
 * 保存/修改
 */
export function saveCmsFeedbackApi(params: CmsFeedback) {
  return getRequestClient().post<CmsFeedback>(BASE_URL, params);
}

/**
 * 导出数据
 */
export function exportCmsFeedbackDataApi(params?: CmsFeedback) {
  return getRequestClient().get<string>(`${BASE_URL}/export/data`, {
    params,
  });
}
