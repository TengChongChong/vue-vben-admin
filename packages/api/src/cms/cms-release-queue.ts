import type { Page } from '#/api/base/model/page-model';
import type { CmsReleaseQueue } from '#/api/cms/model/cms-release-model';

import { getRequestClient } from '../request-context';

const BASE_URL = '/auth/cms/release/queue';

/**
 * 查询发布队列
 */
export function selectCmsReleaseQueueApi(
  params: CmsReleaseQueue,
  page: Page<CmsReleaseQueue>,
) {
  return getRequestClient().get<Page<CmsReleaseQueue>>(BASE_URL, {
    params: { ...params, ...page },
  });
}
