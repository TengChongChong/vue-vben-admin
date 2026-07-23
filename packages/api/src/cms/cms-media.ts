import type { Page } from '#/api/base/model/page-model';
import type { CmsMedia } from '#/api/cms/model/cms-media-model';

import { getRequestClient } from '../request-context';

const BASE_URL = '/auth/cms/media';

/**
 * 查询数据
 */
export function selectCmsMediaApi(params: CmsMedia, page: Page<CmsMedia>) {
  return getRequestClient().get<Page<CmsMedia>>(BASE_URL, {
    params: { ...params, ...page },
  });
}

/**
 * 查询详情
 */
export function getCmsMediaApi(id: string) {
  return getRequestClient().get<CmsMedia>(`${BASE_URL}/${id}`);
}

/**
 * 新增
 */
export function addCmsMediaApi() {
  return getRequestClient().get<CmsMedia>(`${BASE_URL}/add`);
}

/**
 * 删除
 */
export function removeCmsMediaApi(ids: string) {
  return getRequestClient().delete<boolean>(`${BASE_URL}/${ids}`);
}

/**
 * 保存/修改
 */
export function saveCmsMediaApi(params: CmsMedia) {
  return getRequestClient().post<CmsMedia>(BASE_URL, params);
}
