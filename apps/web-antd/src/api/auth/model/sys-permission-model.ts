import type { BasicModel } from '#/api/base/model/base-model.ts';

/**
 * 权限
 */
export interface SysPermission extends BasicModel {
  // 类型
  type: string;
  // 标题
  title: string;
  // 组件名称
  name?: string;
  // 标识
  code?: string;
  // 图标
  icon?: string;
  // path
  path?: string;
  // 组件路径
  component?: string;
  // 是否外部链接
  externalLink?: string;
  // 在菜单中显示
  showInMenu?: string;
  // 打开方式
  openMode?: string;
  // 父权限&菜单名称
  parentName?: string;
}
