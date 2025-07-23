import type { BasicModel } from '#/api/base/model/base-model';

/**
 * 快捷导航
 */
export interface SysQuickNavigation extends BasicModel {
  // 名称
  name: string;
  // 地址
  url: string;
  // 图标
  icon?: string;
  // 颜色
  color?: string;
}

export interface SysQuickNavigationVO extends SysQuickNavigation {
  // 非表字段
}
