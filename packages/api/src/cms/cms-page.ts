import type { Page } from '#/api/base/model/page-model';
import type { SelectModel } from '#/api/base/model/select-model';
import type { CmsPage } from '#/api/cms/model/cms-page-model';

import { getRequestClient } from '../request-context';

const BASE_URL = '/auth/cms/page';

/**
 * 查询数据
 */
export function selectCmsPageApi(params: CmsPage, page: Page<CmsPage>) {
  return getRequestClient().get<Page<CmsPage>>(BASE_URL, {
    params: { ...params, ...page },
  });
}

/**
 * 查询详情
 */
export function getCmsPageApi(id: string) {
  return getRequestClient().get<CmsPage>(`${BASE_URL}/${id}`);
}

/**
 * 新增
 */
export function addCmsPageApi() {
  return getRequestClient().get<CmsPage>(`${BASE_URL}/add`);
}

/**
 * 删除
 */
export function removeCmsPageApi(ids: string) {
  return getRequestClient().delete<boolean>(`${BASE_URL}/${ids}`);
}

/**
 * 保存/修改
 */
export function saveCmsPageApi(params: CmsPage) {
  return getRequestClient().post<CmsPage>(BASE_URL, params);
}

/**
 * 查询主题中的页面模版
 */
export function selectCmsThemePageTemplateApi() {
  return getRequestClient().get<SelectModel[]>(`${BASE_URL}/theme/page/template`);
}
