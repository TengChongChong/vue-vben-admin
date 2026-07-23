import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it } from 'vitest';

import { useTenantStore } from './tenant';

describe('useTenantStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('initializes disabled without tenant header', () => {
    const store = useTenantStore();
    expect(store.enabled).toBe(false);
    expect(store.headerTenantId).toBeUndefined();
  });

  it('applies login result when multi tenant enabled', () => {
    const store = useTenantStore();
    store.applyLoginResult({
      enableMultiTenant: true,
      currentTenantId: '2',
      defaultTenantId: '1',
      tenantList: [{ id: '1', tenantCode: 'default', name: '默认' }],
      tenantSwitchable: true,
    });
    expect(store.enabled).toBe(true);
    expect(store.headerTenantId).toBe('2');
    expect(store.switchable).toBe(true);
  });

  it('does not expose header when disabled', () => {
    const store = useTenantStore();
    store.applyLoginResult({
      enableMultiTenant: false,
      currentTenantId: '1',
    });
    expect(store.headerTenantId).toBeUndefined();
  });

  it('syncs session user tenant fields after switch', () => {
    const store = useTenantStore();
    store.applyLoginResult({
      enableMultiTenant: true,
      currentTenantId: '1',
      defaultTenantId: '1',
      tenantList: [
        { id: '1', tenantCode: 'default', name: '默认' },
        { id: '2', tenantCode: 'pilot-b', name: '试点B' },
      ],
      tenantSwitchable: true,
    });

    store.applySessionUser({
      currentTenantId: '2',
      tenantSwitchable: true,
    });

    expect(store.currentTenantId).toBe('2');
    expect(store.headerTenantId).toBe('2');
    expect(store.switchable).toBe(true);
  });

  it('clears header when session disables multi tenant', () => {
    const store = useTenantStore();
    store.applyLoginResult({
      enableMultiTenant: true,
      currentTenantId: '1',
    });
    store.applySessionUser({ enableMultiTenant: false });
    expect(store.enabled).toBe(false);
    expect(store.headerTenantId).toBeUndefined();
  });
});
