import type { BasicModel } from '#/api/base/model/base-model';

/**
 * 字典类型
 */
export interface SysDictType extends BasicModel {
  // 名称
  name: string;
  // 状态
  status: string;
  // 是否系统
  sys: string;
  // 类型
  type: string;
}
