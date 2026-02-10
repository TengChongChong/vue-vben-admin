import type { BasicModel } from '#/api/base/model/base-model';

/**
 * 字典
 */
export interface SysDict extends BasicModel {
  // 编码
  code: string;
  // 显示方式
  color?: string;
  // 字典类型
  dictType: string;
  // 图标
  icon?: string;
  // 名称
  name: string;
  // 父编码
  parentCode: string;
}

export interface SysDictVO extends SysDict {
  // 父字典名称
  parentName: string;
}

/**
 * 字典树
 */
export interface SysDictTree extends SysDict {
  children?: SysDict[];
}
