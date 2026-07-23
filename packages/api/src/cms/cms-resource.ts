import type { Page } from '#/api/base/model/page-model';
import type { CmsResource } from '#/api/cms/model/cms-resource-model';

import { getRequestClient } from '../request-context';

const BASE_URL = '/auth/cms/resource';

/**
 * 查询资源
 */
export function selectCmsResourceApi(
  params: CmsResource,
  page: Page<CmsResource>,
) {
  return getRequestClient().get<Page<CmsResource>>(BASE_URL, {
    params: { ...params, ...page },
  });
}

/**
 * 资源详情
 */
export function getCmsResourceApi(id: string) {
  return getRequestClient().get<CmsResource>(`${BASE_URL}/${id}`);
}

/**
 * 删除资源
 */
export function removeCmsResourceApi(ids: string) {
  return getRequestClient().delete<boolean>(`${BASE_URL}/${ids}`);
}

/**
 * 获取资源下载 id
 */
export function getCmsResourceDownloadIdApi(id: string) {
  return getRequestClient().get<string>(`${BASE_URL}/download/${id}`);
}
