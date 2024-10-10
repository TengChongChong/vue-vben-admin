import type { BasicModel } from '#/api/base/model/baseModel';

/**
 * 系统参数
 */
export interface SysConfig extends BasicModel {
  // 分类
  category: string;
  // key
  sysKey: string;
  // value
  value: string;
  // 类型
  type: string;
  // 是否系统
  sys: string;
}
