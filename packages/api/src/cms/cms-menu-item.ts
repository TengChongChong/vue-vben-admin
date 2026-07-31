import type { TreeNodeModel } from '#/api/base/model/tree-model';
import type { CmsMenuItem } from '#/api/cms/model/cms-menu-model';

import { getRequestClient } from '../request-context';

const BASE_URL = '/auth/cms/menu/item';

export function selectCmsMenuItemApi(params: CmsMenuItem) {
  return getRequestClient().get<CmsMenuItem[]>(BASE_URL, { params });
}

export function selectAllCmsMenuItemApi(menuId: string) {
  return getRequestClient().get<TreeNodeModel[]>(`${BASE_URL}/all`, {
    params: { menuId },
  });
}

export function getCmsMenuItemApi(id: string) {
  return getRequestClient().get<CmsMenuItem>(`${BASE_URL}/${id}`);
}

export function addCmsMenuItemApi(menuId: string, parentId?: string) {
  return getRequestClient().get<CmsMenuItem>(
    parentId ? `${BASE_URL}/add/${menuId}/${parentId}` : `${BASE_URL}/add/${menuId}`,
  );
}

export function removeCmsMenuItemApi(ids: string) {
  return getRequestClient().delete<boolean>(`${BASE_URL}/${ids}`);
}

export function saveCmsMenuItemApi(params: CmsMenuItem) {
  return getRequestClient().post<CmsMenuItem>(BASE_URL, params);
}

export function saveCmsMenuItemOrderApi(params: CmsMenuItem[]) {
  return getRequestClient().post<boolean>(`${BASE_URL}/order`, params);
}
