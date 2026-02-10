import type { BasicModel } from '#/api/base/model/base-model';

/**
 * 流程分类
 */
export interface WorkflowModel extends BasicModel {
  // 分类
  category?: string;
  // 创建时间
  createTime?: Date;
  // 部署id
  deploymentId?: string;
  // 描述
  description?: string;
  // 资源拓展id
  editorSourceExtraValueId?: string;
  // 资源id
  editorSourceValueId?: string;
  // key
  key?: string;
  // 上次更新时间
  lastUpdateTime?: Date;
  // meta info
  metaInfo?: string;
  // 名称
  name?: string;
  // 模型路径
  path?: string;
  // 租户id
  tenantId?: string;
  // 版本
  version?: number;
}

export interface WorkflowModelVO extends WorkflowModel {
  // 非表字段
}
