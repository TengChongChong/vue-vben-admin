import type { TreeDataItem } from 'ant-design-vue/es/tree/Tree';

export enum ToolbarEnum {
  SELECT_ALL,
  UN_SELECT_ALL,
  EXPAND_ALL,
  UN_EXPAND_ALL,
  CHECK_STRICTLY,
  CHECK_UN_STRICTLY,
}

export type KeyType = number | string;

export type CheckKeys =
  | { checked: number[] | string[]; halfChecked: number[] | string[] }
  | KeyType[];

export interface TreeState {
  expandedKeys: KeyType[];
  selectedKeys: KeyType[];
  checkedKeys: CheckKeys;
  checkStrictly: boolean;
}

export interface FieldNames {
  children?: string;
  title?: string;
  key?: string;
}

export interface ContextMenuItem {
  label: string;
  icon?: string;
  hidden?: boolean;
  disabled?: boolean;
  handler?: Fn;
  divider?: boolean;
  children?: ContextMenuItem[];
}

export interface ContextMenuOptions {
  icon?: string;
  styles?: any;
  items?: ContextMenuItem[];
}

export interface TreeItem extends TreeDataItem {
  icon?: any;
}

export interface TreeActionItem {
  render: (record: Recordable) => any;
  show?: ((record: Recordable) => boolean) | boolean;
}

export interface InsertNodeParams {
  parentKey: null | string;
  node?: TreeDataItem;
  list?: TreeDataItem[];
  push?: 'push' | 'unshift';
}

export interface TreeActionType {
  getTreeData: () => TreeDataItem[];
  checkAll: (checkAll: boolean) => void;
  expandAll: (expandAll: boolean) => void;
  setExpandedKeys: (keys: KeyType[]) => void;
  getExpandedKeys: () => KeyType[];
  setSelectedKeys: (keys: KeyType[]) => void;
  getSelectedKeys: () => KeyType[];
  setCheckedKeys: (keys: CheckKeys) => void;
  getCheckedKeys: () => CheckKeys;
  filterByLevel: (level: number) => void;
  insertNodeByKey: (opt: InsertNodeParams) => void;
  insertNodesByKey: (opt: InsertNodeParams) => void;
  deleteNodeByKey: (key: string, list?: TreeDataItem[]) => void;
  updateNodeByKey: (key: string, node: Omit<TreeDataItem, 'key'>) => void;
  setSearchValue: (value: string) => void;
  getSearchValue: () => string;
  getSelectedNode: (
    key: KeyType,
    treeList?: TreeItem[],
    selectNode?: null | TreeItem,
  ) => null | TreeItem;
}

export interface BasicTreeProps {
  class?: any;
  headStyle?: object;
  value?: CheckKeys | KeyType[];
  helpMessage?: string | string[];
  title?: string;
  size?: string;
  showToolbar?: boolean;
  height?: number;
  showSearch?: boolean;
  searchValue?: string;
  checkStrictly?: boolean;
  checkable?: boolean;
  defaultExpandLevel?: number | string;
  defaultExpandAll?: boolean;
  fieldNames?: FieldNames;
  treeData: TreeDataItem[];
  actionList?: TreeActionItem[];
  expandedKeys?: KeyType[];
  selectedKeys?: KeyType[];
  checkedKeys?: CheckKeys;
  beforeRightClick?: (
    ...arg: any
  ) => Promise<ContextMenuItem[] | ContextMenuOptions>;
  rightMenuList?: ContextMenuItem[];
  // 自定义数据过滤判断方法(注: 不是整个过滤方法，而是内置过滤的判断方法，用于增强原本仅能通过title进行过滤的方式)
  filterFn?: (
    searchValue: any,
    node: TreeItem,
    fieldNames: FieldNames,
  ) => boolean;
  // 高亮搜索值，仅高亮具体匹配值（通过title）值为true时使用默认色值，值为#xxx时使用此值替代且高亮开启
  highlight?: boolean | string;
  // 搜索完成时自动展开结果
  expandOnSearch?: boolean;
  // 搜索完成自动选中所有结果,当且仅当 checkable===true 时生效
  checkOnSearch?: boolean;
  // 搜索完成自动select所有结果
  selectedOnSearch?: boolean;
  loading?: boolean;
  treeWrapperClassName?: string;
}
