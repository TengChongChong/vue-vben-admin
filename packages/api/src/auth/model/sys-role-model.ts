import type { BasicModel } from '#/api/base/model/base-model';

/**
 * 角色
 */
export interface SysRole extends BasicModel {
  // 角色标识
  code: string;
  // 数据权限
  dataPermission: string;
  // 名称
  name: string;
  // 备注
  remarks: string;
}

export interface SysRoleVO extends SysRole {
  // 部门ids - 数据权限
  dataPermissionDeptIds: string[];
  // 菜单ids
  menuIds: string[];
}
