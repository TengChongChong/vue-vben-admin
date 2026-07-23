/** 租户请求头，与后端 TenantConst.TENANT_HEADER 一致 */
export const TENANT_HEADER = 'X-Tenant-Id';

/** 账号未分配租户，与后端 BusinessException.TENANT_NOT_ASSIGNED 一致 */
export const TENANT_NOT_ASSIGNED_ERROR_CODE = '05005';

/**
 * 平台全局 API 路径前缀/模式，不注入租户头
 * （菜单、字典、参数、租户管理等）
 */
const TENANT_HEADER_IGNORE_PATTERNS: RegExp[] = [
  /^\/login\//,
  /^\/logout$/,
  /^\/auth\/switch-tenant$/,
  /^\/auth\/sys\/config/,
  /^\/sys\/config\/key\//,
  /^\/auth\/sys\/dict/,
  /^\/auth\/sys\/menu/,
  /^\/auth\/sys\/tenant/,
];

/**
 * 是否应为该请求附加租户头
 */
export function shouldAttachTenantHeader(url?: string): boolean {
  if (!url) {
    return false;
  }
  const path = url.split('?')[0] ?? '';
  return !TENANT_HEADER_IGNORE_PATTERNS.some((pattern) => pattern.test(path));
}
