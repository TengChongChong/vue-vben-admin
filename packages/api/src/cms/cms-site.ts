import type { Page } from '#/api/base/model/page-model';
import type { TreeNodeModel } from '#/api/base/model/tree-model';
import type {
  CmsSite,
  CmsSiteMember,
} from '#/api/cms/model/cms-site-model';

import { getRequestClient } from '../request-context';

const BASE_URL = '/auth/cms/site';

/**
 * 查询数据（无分页）
 */
export function selectCmsSiteApi(params?: CmsSite) {
  return getRequestClient().get<CmsSite[]>(BASE_URL, { params });
}

/**
 * 查询所有数据（Tree）
 */
export function selectAllCmsSiteApi() {
  return getRequestClient().get<TreeNodeModel[]>(`${BASE_URL}/all`);
}

/**
 * 查询详情
 */
export function getCmsSiteApi(id: string) {
  return getRequestClient().get<CmsSite>(`${BASE_URL}/${id}`);
}

/**
 * 新增或新增下级
 */
export function addCmsSiteApi(parentId?: string) {
  return getRequestClient().get<CmsSite>(
    parentId ? `${BASE_URL}/add/${parentId}` : `${BASE_URL}/add`,
  );
}

/**
 * 删除
 */
export function removeCmsSiteApi(ids: string) {
  return getRequestClient().delete<boolean>(`${BASE_URL}/${ids}`);
}

/**
 * 保存/修改
 */
export function saveCmsSiteApi(params: CmsSite) {
  return getRequestClient().post<CmsSite>(BASE_URL, params);
}

/**
 * 保存排序&结构
 */
export function saveCmsSiteOrderApi(params: CmsSite[]) {
  return getRequestClient().post<boolean>(`${BASE_URL}/order`, params);
}

/**
 * 设置用户当前编辑站点
 */
export function setUserActiveSiteApi(params: Pick<CmsSite, 'id'>) {
  return getRequestClient().post<boolean>(
    `${BASE_URL}/set/user/active/site`,
    params,
  );
}

/**
 * 获取用户当前编辑站点
 */
export function getUserActiveSiteApi() {
  return getRequestClient().get<CmsSite | null>(
    `${BASE_URL}/get/user/active/site`,
  );
}

/**
 * 导出数据
 */
export function exportCmsSiteDataApi(params?: CmsSite) {
  return getRequestClient().get<string>(`${BASE_URL}/export/data`, {
    params,
  });
}

const SITE_USER_BASE_URL = '/auth/cms/site/user';

export function selectCmsSiteMembersApi(
  siteId: string,
  params: { keyword?: string },
  page: Page<CmsSiteMember>,
) {
  return getRequestClient().get<Page<CmsSiteMember>>(
    `${SITE_USER_BASE_URL}/${siteId}/users`,
    {
      params: { ...params, ...page },
    },
  );
}

export function addCmsSiteMembersApi(siteId: string, userIds: string[]) {
  return getRequestClient().post<boolean>(`${SITE_USER_BASE_URL}/${siteId}/users`, {
    userIds,
  });
}

export function removeCmsSiteMembersApi(siteId: string, userIds: string) {
  return getRequestClient().delete<boolean>(
    `${SITE_USER_BASE_URL}/${siteId}/users/${userIds}`,
  );
}

export function getUserCmsSiteIdsApi(userId: string) {
  return getRequestClient().get<string[]>(
    `${SITE_USER_BASE_URL}/user/${userId}/sites`,
  );
}

export function saveUserCmsSitesApi(params: {
  siteIds: string[];
  userId: string;
}) {
  return getRequestClient().post<boolean>(`${SITE_USER_BASE_URL}/user/sites`, params);
}
