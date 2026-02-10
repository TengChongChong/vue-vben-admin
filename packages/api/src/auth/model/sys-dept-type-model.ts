import type { BasicModel } from '#/api/base/model/base-model';

/**
 * 部门类型
 */
export interface SysDeptType extends BasicModel {
  // 代码
  code: string;
  // 名称
  name: string;
}

export interface SysDeptTypeVO extends SysDeptType {
  // 该部门类型可以选择的角色列表 1,2,3
  roleIdList?: string[];
}
