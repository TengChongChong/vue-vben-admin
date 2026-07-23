import type { Page } from '#/api/base/model/page-model';
import type { TreeNodeModel } from '#/api/base/model/tree-model';
import type {
  CmsRelease,
  CmsReleaseProgress,
} from '#/api/cms/model/cms-release-model';

import { getRequestClient } from '../request-context';

const BASE_URL = '/auth/cms/release';

/**
 * 查询数据
 */
export function selectCmsReleaseApi(
  params: CmsRelease,
  page: Page<CmsRelease>,
) {
  return getRequestClient().get<Page<CmsRelease>>(BASE_URL, {
    params: { ...params, ...page },
  });
}

/**
 * 获取发布资源
 */
export function selectCmsReleaseAssetsApi() {
  return getRequestClient().get<TreeNodeModel[]>(`${BASE_URL}/assets`);
}

/**
 * 保存/修改
 */
export function saveCmsReleaseApi(params: CmsRelease) {
  return getRequestClient().post<CmsRelease>(BASE_URL, params);
}

/**
 * 开始发布
 */
export function startCmsReleaseApi(id: string) {
  return getRequestClient().post<boolean>(`${BASE_URL}/start/${id}`);
}

/**
 * 取消发布
 */
export function cancelCmsReleaseApi(id: string) {
  return getRequestClient().post<CmsReleaseProgress>(`${BASE_URL}/cancel/${id}`);
}

/**
 * 获取发布进度
 */
export function getCmsReleaseProgressApi(id: string) {
  return getRequestClient().get<CmsReleaseProgress>(
    `${BASE_URL}/progress/${id}`,
  );
}

/**
 * 发布单个队列数据
 */
export function releaseCmsQueueItemApi(id: string) {
  return getRequestClient().post<boolean>(`${BASE_URL}/release/queue/${id}`);
}

export interface CmsReleaseIncrementalParams {
  dataId: string;
  siteId?: string;
  type: string;
}

/**
 * 增量发布单项资源
 */
export function releaseCmsIncrementalApi(params: CmsReleaseIncrementalParams) {
  return getRequestClient().post<boolean>(`${BASE_URL}/incremental`, params);
}

export interface CmsReleasePreviewParams {
  dataId?: string;
  siteId?: string;
  type: string;
}

/**
 * 预览静态页 HTML
 */
export function previewCmsReleaseApi(params: CmsReleasePreviewParams) {
  return getRequestClient().post<string>(`${BASE_URL}/preview`, params);
}
