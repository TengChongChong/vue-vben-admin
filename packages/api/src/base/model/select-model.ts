/**
 * Select Model
 */
export interface SelectModel {
  label: string;
  value: number | string;
}

/**
 * 中转select
 */
export interface TempSelectModel extends SelectModel {
  id?: number | string;
  parentId?: number | string;
}

/**
 * 级联选择
 */
export interface TreeSelectModel {
  children?: TreeSelectModel[];
  label: string;
  value: number | string;
}

/**
 * 表格过滤
 */
export interface TableFilterModel {
  children?: TableFilterModel[];
  text: string;
  value: number | string;
}
