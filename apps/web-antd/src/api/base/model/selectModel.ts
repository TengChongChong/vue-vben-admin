/**
 * Select Model
 */
export interface SelectModel {
  value: number | string;
  label: string;
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
  value: number | string;
  label: string;
  children?: TreeSelectModel[];
}

/**
 * 表格过滤
 */
export interface TableFilterModel {
  value: number | string;
  text: string;
  children?: TableFilterModel[];
}
