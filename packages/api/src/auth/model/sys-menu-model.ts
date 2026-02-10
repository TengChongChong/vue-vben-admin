import type { BasicModel } from '#/api/base/model/base-model';

/**
 * 菜单
 */
export interface SysMenu extends BasicModel {
  // 激活图标
  activeIcon?: string;
  // 激活路径
  activePath?: string;
  // 固定在标签栏
  affixTab?: string;
  // 权限标识
  authCode?: string;
  // 徽标内容
  badge?: string;
  // 徽标类型
  badgeType?: string;
  // 徽标样式
  badgeVariants?: string;
  // 页面组件
  component?: string;
  // 隐藏子菜单
  hideChildrenInMenu?: string;
  // 在面包屑中隐藏
  hideInBreadcrumb?: string;
  // 隐藏菜单
  hideInMenu?: string;
  // 在标签栏中隐藏
  hideInTab?: string;
  // 图标
  icon?: string;
  // 缓存标签页
  keepAlive?: string;
  // 链接地址
  linkSrc?: string;
  // 组件Name
  name?: string;
  // 路由地址
  path?: string;
  // 名称
  title: string;
  // 类型
  type?: string;
}

export interface SysMenuVO extends SysMenu {
  // 非表字段
}
