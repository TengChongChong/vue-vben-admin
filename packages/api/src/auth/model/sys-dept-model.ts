import type { BasicModel } from '#/api/base/model/base-model';

/**
 * 部门
 */
export interface SysDept extends BasicModel {
  // 部门代码
  code?: string;
  // 全称
  name: string;
  // 排序值
  orderNo: number;
  // 备注
  remarks?: string;
  // 简称
  simpleName?: string;
  // 部门类型编码
  typeCode: string;
}

export interface SysDeptVO extends SysDept {
  // 部门类型名称
  typeName: string;
}
