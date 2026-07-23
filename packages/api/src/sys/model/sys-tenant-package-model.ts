import type { BasicModel } from '#/api/base/model/base-model';

/**
 * 租户套餐
 */
export interface SysTenantPackage extends BasicModel {
  code: string;
  maxUserCount?: number;
  menuIds?: string[];
  name: string;
  tenantCount?: number;
}

/**
 * 租户套餐下拉选项
 */
export interface SysTenantPackageOption {
  code: string;
  id: string;
  maxUserCount?: number;
  name: string;
}

/**
 * 套餐绑定租户简要信息
 */
export interface SysTenantBrief {
  id: string;
  name: string;
  tenantCode: string;
}

/**
 * 套餐菜单同步模式
 */
export type PackageMenuSyncMode =
  | 'add_and_clip'
  | 'add_only'
  | 'clip_all'
  | 'replace_admin';

/**
 * 套餐菜单同步范围（add_only 时生效）
 */
export type PackageMenuSyncScope = 'admin_only' | 'all_roles';

export interface SysTenantPackageSync {
  mode: PackageMenuSyncMode;
  scope?: PackageMenuSyncScope;
  tenantIds?: string[];
}

export interface SysTenantSyncPackageMenu {
  mode: PackageMenuSyncMode;
  scope?: PackageMenuSyncScope;
}

export interface SysTenantPackageSyncResult {
  roleCount: number;
  skippedTenantIds: string[];
  tenantCount: number;
  updatedRoleCount: number;
}
