import type { BasicModel } from '#/api/base/model/base-model';

/**
 * 代码生成示例
 */
export interface SampleGeneral extends BasicModel {
  // 地址
  address?: string;
  // 年龄
  age: number;
  // 姓名
  name: string;
  // 手机号码
  phone: string;
  // 性别
  sex?: string;
}

export interface SampleGeneralVO extends SampleGeneral {
  // 非表字段
}
