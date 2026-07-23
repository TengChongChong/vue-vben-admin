import type { Page } from '#/api/base/model/page-model';
import type {
  SysTenantBrief,
  SysTenantPackage,
  SysTenantPackageOption,
  SysTenantPackageSync,
  SysTenantPackageSyncResult,
} from '#/api/sys/model/sys-tenant-package-model';

import { getRequestClient } from '../request-context';

const BASE_URL = '/auth/sys/tenant/package';

export function selectSysTenantPackageApi(
  params: SysTenantPackage,
  page: Page<SysTenantPackage>,
) {
  return getRequestClient().get<Page<SysTenantPackage>>(BASE_URL, {
    params: Object.assign(params, page),
  });
}

export function getSysTenantPackageApi(id: string) {
  return getRequestClient().get<SysTenantPackage>(`${BASE_URL}/${id}`);
}

export function saveSysTenantPackageApi(params: SysTenantPackage) {
  return getRequestClient().post<SysTenantPackage>(BASE_URL, params);
}

export function removeSysTenantPackageApi(ids: string) {
  return getRequestClient().delete<boolean>(`${BASE_URL}/${ids}`);
}

export function listSysTenantPackageOptionsApi() {
  return getRequestClient().get<SysTenantPackageOption[]>(`${BASE_URL}/options`);
}

export function selectPackageTenantsApi(
  packageId: string,
  params: SysTenantBrief,
  page: Page<SysTenantBrief>,
) {
  return getRequestClient().get<Page<SysTenantBrief>>(
    `${BASE_URL}/${packageId}/tenants`,
    {
      params: Object.assign(params, page),
    },
  );
}

export function syncPackageMenusApi(
  packageId: string,
  params: SysTenantPackageSync,
) {
  return getRequestClient().post<SysTenantPackageSyncResult>(
    `${BASE_URL}/${packageId}/sync-menus`,
    params,
  );
}
