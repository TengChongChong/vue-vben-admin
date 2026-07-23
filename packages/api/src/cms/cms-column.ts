import type { Page } from '#/api/base/model/page-model';
import type { TreeNodeModel } from '#/api/base/model/tree-model';
import type {
  CmsColumn,
  CmsColumnMember,
} from '#/api/cms/model/cms-column-model';

import { getRequestClient } from '../request-context';

const BASE_URL = '/auth/cms/column';

/**
 * 查询数据（无分页）
 */
export function selectCmsColumnApi(params?: CmsColumn) {
  return getRequestClient().get<CmsColumn[]>(BASE_URL, { params });
}

/**
 * 查询所有数据（Tree）
 */
export function selectAllCmsColumnApi() {
  return getRequestClient().get<TreeNodeModel[]>(`${BASE_URL}/all`);
}

/**
 * 查询详情
 */
export function getCmsColumnApi(id: string) {
  return getRequestClient().get<CmsColumn>(`${BASE_URL}/${id}`);
}

/**
 * 新增或新增下级
 */
export function addCmsColumnApi(parentId?: string) {
  return getRequestClient().get<CmsColumn>(
    parentId ? `${BASE_URL}/add/${parentId}` : `${BASE_URL}/add`,
  );
}

/**
 * 删除
 */
export function removeCmsColumnApi(ids: string) {
  return getRequestClient().delete<boolean>(`${BASE_URL}/${ids}`);
}

/**
 * 保存/修改
 */
export function saveCmsColumnApi(params: CmsColumn) {
  return getRequestClient().post<CmsColumn>(BASE_URL, params);
}

/**
 * 保存排序
 */
export function saveCmsColumnOrderApi(params: CmsColumn[]) {
  return getRequestClient().post<boolean>(`${BASE_URL}/order`, params);
}

/**
 * 导出数据
 */
export function exportCmsColumnDataApi(params?: CmsColumn) {
  return getRequestClient().get<string>(`${BASE_URL}/export/data`, {
    params,
  });
}

const COLUMN_USER_BASE_URL = '/auth/cms/column/user';

export function selectCmsColumnMembersApi(
  columnId: string,
  params: { keyword?: string },
  page: Page<CmsColumnMember>,
) {
  return getRequestClient().get<Page<CmsColumnMember>>(
    `${COLUMN_USER_BASE_URL}/${columnId}/users`,
    {
      params: { ...params, ...page },
    },
  );
}

export function addCmsColumnMembersApi(columnId: string, userIds: string[]) {
  return getRequestClient().post<boolean>(
    `${COLUMN_USER_BASE_URL}/${columnId}/users`,
    { userIds },
  );
}

export function removeCmsColumnMembersApi(columnId: string, userIds: string) {
  return getRequestClient().delete<boolean>(
    `${COLUMN_USER_BASE_URL}/${columnId}/users/${userIds}`,
  );
}

export function getUserCmsColumnIdsApi(userId: string, siteId: string) {
  return getRequestClient().get<string[]>(
    `${COLUMN_USER_BASE_URL}/user/${userId}/site/${siteId}/columns`,
  );
}

export function listCmsSiteColumnsForAuthApi(siteId: string) {
  return getRequestClient().get<CmsColumn[]>(
    `${COLUMN_USER_BASE_URL}/site/${siteId}/columns`,
  );
}

export function saveUserCmsColumnsApi(params: {
  columnIds: string[];
  siteId: string;
  userId: string;
}) {
  return getRequestClient().post<boolean>(`${COLUMN_USER_BASE_URL}/user/columns`, params);
}

export function saveUserCmsColumnsBatchApi(params: {
  items: Array<{ columnIds: string[]; siteId: string; }>;
  userId: string;
}) {
  return getRequestClient().post<boolean>(
    `${COLUMN_USER_BASE_URL}/user/columns/batch`,
    params,
  );
}
