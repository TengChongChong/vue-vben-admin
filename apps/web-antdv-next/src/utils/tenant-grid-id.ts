import { useTenantStore } from '@vben/stores';

/**
 * 为 VxeGrid 生成带租户前缀的 id，避免切换租户后复用上一租户的表格/表单缓存。
 */
export function buildTenantGridId(baseId: string): string {
  const tenantStore = useTenantStore();
  if (tenantStore.enabled && tenantStore.currentTenantId) {
    return `${tenantStore.currentTenantId}:${baseId}`;
  }
  return baseId;
}
