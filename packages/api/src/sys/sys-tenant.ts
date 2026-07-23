import type { Page } from '#/api/base/model/page-model';
import type {
  SessionTenant,
  SysTenant,
  SysTenantMember,
  SysTenantMemberBatch,
  SysTenantRemovePreview,
  SysTenantSave,
  SysTenantUserDefault,
  SysTenantUserSave,
} from '#/api/sys/model/sys-tenant-model';
import type {
  SysTenantPackageSyncResult,
  SysTenantSyncPackageMenu,
} from '#/api/sys/model/sys-tenant-package-model';

import { getRequestClient } from '../request-context';

const BASE_URL = '/auth/sys/tenant';

export function selectSysTenantApi(params: SysTenant, page: Page<SysTenant>) {
  return getRequestClient().get<Page<SysTenant>>(BASE_URL, {
    params: Object.assign(params, page),
  });
}

export function getSysTenantApi(id: string) {
  return getRequestClient().get<SysTenant>(`${BASE_URL}/${id}`);
}

export function getTenantRemovePreviewApi(id: string) {
  return getRequestClient().get<SysTenantRemovePreview>(
    `${BASE_URL}/${id}/remove-preview`,
  );
}

export function removeSysTenantApi(ids: string) {
  return getRequestClient().delete<boolean>(`${BASE_URL}/${ids}`);
}

export function saveSysTenantApi(params: SysTenantSave) {
  return getRequestClient().post<SysTenant>(BASE_URL, params);
}

export function setSysTenantStatusApi(ids: string, status: string) {
  return getRequestClient().post<boolean>(`${BASE_URL}/${ids}/status/${status}`);
}

export function listSysTenantOptionsApi() {
  return getRequestClient().get<SessionTenant[]>(`${BASE_URL}/options`);
}

export function listUserTenantsApi(userId: string) {
  return getRequestClient().get<SessionTenant[]>(`${BASE_URL}/user/${userId}`);
}

export function saveUserTenantsApi(params: SysTenantUserSave) {
  return getRequestClient().post<boolean>(`${BASE_URL}/user`, params);
}

export function selectTenantMembersApi(
  tenantId: string,
  params: { keyword?: string },
  page: Page<SysTenantMember>,
) {
  return getRequestClient().get<Page<SysTenantMember>>(
    `${BASE_URL}/${tenantId}/users`,
    {
      params: Object.assign(params, page),
    },
  );
}

export function addTenantMembersApi(tenantId: string, userIds: string[]) {
  return getRequestClient().post<boolean>(`${BASE_URL}/${tenantId}/users`, {
    userIds,
  } satisfies SysTenantMemberBatch);
}

export function removeTenantMembersApi(tenantId: string, userIds: string) {
  return getRequestClient().delete<boolean>(
    `${BASE_URL}/${tenantId}/users/${userIds}`,
  );
}

export function setUserDefaultTenantApi(params: SysTenantUserDefault) {
  return getRequestClient().post<boolean>(`${BASE_URL}/user/default`, params);
}

export function syncTenantPackageMenusApi(
  tenantId: string,
  params: SysTenantSyncPackageMenu,
) {
  return getRequestClient().post<SysTenantPackageSyncResult>(
    `${BASE_URL}/${tenantId}/sync-package-menus`,
    params,
  );
}
