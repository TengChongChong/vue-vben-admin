type UserSelectRange = 'all' | 'currentDept';

export interface UserSelect {
  class?: any;
  // value
  value: Array<string> | string | undefined;
  // 设置 Select 的模式为多选或标签
  mode?: 'multiple' | 'tags' | undefined;
  // 范围 'all' | 'currentDept'
  range?: UserSelectRange;
  // 查询指定部门用户
  deptIds?: string[];
}
