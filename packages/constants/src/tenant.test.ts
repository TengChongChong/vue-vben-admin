import { describe, expect, it } from 'vitest';

import {
  shouldAttachTenantHeader,
  TENANT_HEADER,
  TENANT_NOT_ASSIGNED_ERROR_CODE,
} from './tenant';

describe('tenant constants', () => {
  it('exports tenant header name', () => {
    expect(TENANT_HEADER).toBe('X-Tenant-Id');
  });

  it('exports tenant not assigned error code', () => {
    expect(TENANT_NOT_ASSIGNED_ERROR_CODE).toBe('05005');
  });

  it('attaches tenant header for auth scoped apis', () => {
    expect(shouldAttachTenantHeader('/auth/sys/user/select')).toBe(true);
    expect(shouldAttachTenantHeader('/auth/sys/dept/select')).toBe(true);
    expect(shouldAttachTenantHeader('/auth/sys/role/select')).toBe(true);
  });

  it('attaches tenant header for dept type apis', () => {
    expect(shouldAttachTenantHeader('/auth/sys/dept/type/select')).toBe(true);
  });

  it('skips tenant header for platform global apis', () => {
    expect(shouldAttachTenantHeader('/auth/switch-tenant')).toBe(false);
    expect(shouldAttachTenantHeader('/auth/sys/config/select')).toBe(false);
    expect(shouldAttachTenantHeader('/auth/sys/dict/select')).toBe(false);
    expect(shouldAttachTenantHeader('/auth/sys/menu/select')).toBe(false);
    expect(shouldAttachTenantHeader('/auth/sys/tenant/select')).toBe(false);
    expect(shouldAttachTenantHeader('/login/account')).toBe(false);
    expect(shouldAttachTenantHeader('/logout')).toBe(false);
  });

  it('ignores query string when matching path', () => {
    expect(shouldAttachTenantHeader('/auth/sys/user/select?page=1')).toBe(true);
    expect(shouldAttachTenantHeader('/auth/sys/dict/select?dictType=sex')).toBe(
      false,
    );
  });
});
