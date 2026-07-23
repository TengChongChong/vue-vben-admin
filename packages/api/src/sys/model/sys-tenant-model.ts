import type { BasicModel } from '#/api/base/model/base-model';

/**
 * 会话租户信息
 */
export interface SessionTenant {
  id: string;
  isDefault?: string;
  name: string;
  tenantCode: string;
}

/**
 * 租户
 */
export interface SysTenant extends BasicModel {
  contacts?: string;
  expireTime?: Date;
  maxUserCount?: number;
  name: string;
  packageId?: string;
  packageName?: string;
  phoneNumber?: string;
  tenantCode: string;
  userCount?: number;
}

/**
 * 租户删除预览
 */
export interface SysTenantRemovePreview {
  deptCount: number;
  exclusiveUserCount: number;
  memberCount: number;
  roleCount: number;
}

/**
 * 租户保存（含套餐与管理员）
 */
export interface SysTenantSave extends SysTenant {
  adminEmail?: string;
  adminNickname?: string;
  adminPassword?: string;
  adminPhoneNumber?: string;
  adminUsername?: string;
  createAdmin?: boolean;
}

/**
 * 租户成员
 */
export interface SysTenantMember {
  createDate?: Date;
  deptName?: string;
  isDefault?: string;
  nickname: string;
  userId: string;
  username: string;
}

/**
 * 用户租户绑定
 */
export interface SysTenantUserSave {
  defaultTenantId: string;
  tenantIds: string[];
  userId: string;
}

/**
 * 租户批量添加成员
 */
export interface SysTenantMemberBatch {
  userIds: string[];
}

/**
 * 设置用户默认租户
 */
export interface SysTenantUserDefault {
  defaultTenantId: string;
  userId: string;
}
