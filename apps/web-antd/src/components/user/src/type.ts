type UserSelectRange = 'all' | 'currentDept';

export interface UserSelect {
  class?: any;
  // value
  value: Array<string> | string | undefined;
  // 是否为多选
  multiple?: boolean;
  // 范围 'all' | 'currentDept'
  range?: UserSelectRange;
  // 查询指定部门用户
  deptIds?: string[];
}
