import { useTenantStore } from '@vben/stores';

import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it } from 'vitest';

import { buildTenantGridId } from './tenant-grid-id';

describe('buildTenantGridId', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('returns base id when multi tenant disabled', () => {
    const tenantStore = useTenantStore();
    tenantStore.applyLoginResult({ enableMultiTenant: false });
    expect(buildTenantGridId('sys-user')).toBe('sys-user');
  });

  it('prefixes grid id with current tenant when enabled', () => {
    const tenantStore = useTenantStore();
    tenantStore.applyLoginResult({
      enableMultiTenant: true,
      currentTenantId: '1990030000000000002',
    });
    expect(buildTenantGridId('sys-user')).toBe(
      '1990030000000000002:sys-user',
    );
  });

  it('isolates cache keys across tenants', () => {
    const tenantStore = useTenantStore();
    tenantStore.applyLoginResult({
      enableMultiTenant: true,
      currentTenantId: '1',
    });
    const tenantA = buildTenantGridId('sys-role');

    tenantStore.setCurrentTenantId('1990030000000000002');
    const tenantB = buildTenantGridId('sys-role');

    expect(tenantA).not.toBe(tenantB);
  });
});
