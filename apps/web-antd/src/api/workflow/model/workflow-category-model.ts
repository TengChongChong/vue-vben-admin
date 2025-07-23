import type { BasicModel } from '#/api/base/model/base-model';

/**
 * 流程分类
 */
export interface WorkflowCategory extends BasicModel {
  // 分类名称
  name: string;
  // 分类编码
  code?: string;
}

export interface WorkflowCategoryVO extends WorkflowCategory {
  // 非表字段
}
