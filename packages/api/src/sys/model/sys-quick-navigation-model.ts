import type { BasicModel } from '#/api/base/model/base-model';

/**
 * 快捷导航
 */
export interface SysQuickNavigation extends BasicModel {
  // 颜色
  color?: string;
  // 图标
  icon?: string;
  // 名称
  name: string;
  // 地址
  url: string;
}

export interface SysQuickNavigationVO extends SysQuickNavigation {
  // 非表字段
}
