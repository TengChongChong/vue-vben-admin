import type { CmsMenu } from '#/api/cms/model/cms-menu-model';

import { getRequestClient } from '../request-context';

const BASE_URL = '/auth/cms/menu';

export function selectCmsMenuApi(params?: CmsMenu) {
  return getRequestClient().get<CmsMenu[]>(BASE_URL, { params });
}

export function getCmsMenuApi(id: string) {
  return getRequestClient().get<CmsMenu>(`${BASE_URL}/${id}`);
}

export function addCmsMenuApi() {
  return getRequestClient().get<CmsMenu>(`${BASE_URL}/add`);
}

export function removeCmsMenuApi(ids: string) {
  return getRequestClient().delete<boolean>(`${BASE_URL}/${ids}`);
}

export function saveCmsMenuApi(params: CmsMenu) {
  return getRequestClient().post<CmsMenu>(BASE_URL, params);
}
