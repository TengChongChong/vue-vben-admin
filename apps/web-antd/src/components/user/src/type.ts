import type { SysUserVO } from '#/api';

export type UserSelectRange = 'all' | 'currentDept' | 'role';

export interface UserFilterProps {
  class?: any;
  // 范围
  range?: UserSelectRange;
  // 查询指定部门用户
  deptId?: string;
  // 按角色筛选（range 为 role 时生效）
  roleCode?: string;
}

export interface UserSelectProps extends UserFilterProps {
  // value
  value?: Array<string> | string;
  // 设置 Select 的模式为多选或标签
  mode?: 'multiple' | 'tags';
}

export interface UserPickerProps extends UserFilterProps {
  value?: string[];
  disabled?: boolean;
  maxCount?: number;
  placeholder?: string;
}

export interface UserPickerModalData extends UserFilterProps {
  selectedIds?: string[];
  maxCount?: number;
}

export type UserOption = SysUserVO;
