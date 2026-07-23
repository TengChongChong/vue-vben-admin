import type { Page } from '#/api/base/model/page-model';
import type { CmsArticle } from '#/api/cms/model/cms-article-model';

import { getRequestClient } from '../request-context';

const BASE_URL = '/auth/cms/article';

/**
 * 查询数据
 */
export function selectCmsArticleApi(params: CmsArticle, page: Page<CmsArticle>) {
  return getRequestClient().get<Page<CmsArticle>>(BASE_URL, {
    params: { ...params, ...page },
  });
}

/**
 * 查询详情
 */
export function getCmsArticleApi(id: string) {
  return getRequestClient().get<CmsArticle>(`${BASE_URL}/${id}`);
}

/**
 * 新增
 */
export function addCmsArticleApi() {
  return getRequestClient().get<CmsArticle>(`${BASE_URL}/add`);
}

/**
 * 删除
 */
export function removeCmsArticleApi(ids: string) {
  return getRequestClient().delete<boolean>(`${BASE_URL}/${ids}`);
}

/**
 * 保存/修改
 */
export function saveCmsArticleApi(params: CmsArticle) {
  return getRequestClient().post<CmsArticle>(BASE_URL, params);
}

/**
 * 发布
 */
export function releaseCmsArticleApi(ids: string) {
  return getRequestClient().post<boolean>(`${BASE_URL}/release/${ids}`);
}

/**
 * 撤销
 */
export function revokeCmsArticleApi(ids: string) {
  return getRequestClient().post<boolean>(`${BASE_URL}/revoke/${ids}`);
}

/**
 * 重建当前站点文章搜索索引
 */
export function rebuildCmsArticleSearchIndexApi(siteId?: string) {
  const url = siteId
    ? `${BASE_URL}/search/rebuild?siteId=${encodeURIComponent(siteId)}`
    : `${BASE_URL}/search/rebuild`;
  return getRequestClient().post<boolean>(url);
}
