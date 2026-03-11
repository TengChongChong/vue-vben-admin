export interface DeptSelectProps {
  // 支持多选（当设置 treeCheckable 时自动变为 true）
  multiple?: boolean;
  // value
  value: Array<string> | string | undefined;
}

export interface DeptTreeProps {
  // value
  value: Array<string> | undefined;
}
