import type { BasicModel } from '#/api/base/model/base-model.ts';

/**
 * 部门
 */
export interface SysDept extends BasicModel {
  // 全称
  name: string;
  // 简称
  simpleName?: string;
  // 部门类型编码
  typeCode: string;
  // 部门代码
  code?: string;
  // 备注
  remarks?: string;
  // 排序值
  orderNo: number;
}

export interface SysDeptVO extends SysDept {
  // 部门类型名称
  typeName: string;
}
