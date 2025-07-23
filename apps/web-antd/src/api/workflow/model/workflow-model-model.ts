import type { BasicModel } from '#/api/base/model/base-model';

/**
 * 流程分类
 */
export interface WorkflowModel extends BasicModel {
  // 名称
  name?: string;
  // key
  key?: string;
  // 分类
  category?: string;
  // 描述
  description?: string;
  // 模型路径
  path?: string;
  // 创建时间
  createTime?: Date;
  // 上次更新时间
  lastUpdateTime?: Date;
  // 版本
  version?: number;
  // meta info
  metaInfo?: string;
  // 部署id
  deploymentId?: string;
  // 资源id
  editorSourceValueId?: string;
  // 资源拓展id
  editorSourceExtraValueId?: string;
  // 租户id
  tenantId?: string;
}

export interface WorkflowModelVO extends WorkflowModel {
  // 非表字段
}
