import type { BasicModel } from '#/api/base/model/base-model';

/**
 * 菜单
 */
export interface SysMenu extends BasicModel {
  // 类型
  type?: string;
  // 名称
  title: string;
  // 权限标识
  authCode?: string;
  // 路由地址
  path?: string;
  // 激活路径
  activePath?: string;
  // 图标
  icon?: string;
  // 激活图标
  activeIcon?: string;
  // 页面组件
  component?: string;
  // 组件Name
  name?: string;
  // 链接地址
  linkSrc?: string;
  // 徽标类型
  badgeType?: string;
  // 徽标内容
  badge?: string;
  // 徽标样式
  badgeVariants?: string;
  // 缓存标签页
  keepAlive?: string;
  // 固定在标签栏
  affixTab?: string;
  // 隐藏菜单
  hideInMenu?: string;
  // 隐藏子菜单
  hideChildrenInMenu?: string;
  // 在面包屑中隐藏
  hideInBreadcrumb?: string;
  // 在标签栏中隐藏
  hideInTab?: string;
}

export interface SysMenuVO extends SysMenu {
  // 非表字段
}
