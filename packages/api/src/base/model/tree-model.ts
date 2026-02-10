/**
 * TreeNode for ApiTreeSelect
 */
export interface TreeNode {
  children?: TreeNode[];
  id?: string;
  key: string;
  label: string;
  parentId?: string;
  value: string;
}

/**
 * TreeNode Model for Tree
 */
export interface TreeNodeModel {
  [key: string]: any;
  // 当树为 checkable 时，设置独立节点是否展示 Checkbox
  checkable?: boolean;
  // 子节点
  children?: TreeNodeModel[];
  // 节点的 class
  clazz?: string;
  // 禁掉 checkbox
  disableCheckbox?: boolean;
  // 禁掉响应
  disabled?: boolean;
  // 自定义图标。可接收组件，props 为当前节点 props
  icon?: string;
  // id
  id: string;
  // 设置为叶子节点(设置了loadData时有效)
  isLeaf?: boolean;
  // 标题
  label: string;
  // 父id
  parentId?: string;
  // 设置节点是否可被选中
  selectable?: string;
  // 节点的 style
  style?: string;
}
