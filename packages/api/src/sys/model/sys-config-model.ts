import type { BasicModel } from '#/api/base/model/base-model';

/**
 * 系统参数
 */
export interface SysConfig extends BasicModel {
  // 分类
  category: string;
  // 是否系统
  sys: string;
  // key
  sysKey: string;
  // 类型
  type: string;
  // value
  value: string;
}
