export interface RoleSelectProps {
  class?: any;
  // 部门id type = deptId 时必须
  deptId?: string;
  // 设置 Select 的模式为多选或标签
  mode?: 'multiple' | 'tags' | undefined;
  // 类型
  type?: 'all' | 'current' | 'deptId';
  // value
  value: Array<string> | string | undefined;
}
