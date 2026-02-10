/**
 * Workflow 流程
 */
export interface WorkflowProcess {
  // 命名空间
  category?: string;
  // 部署编号
  deploymentId?: string;
  // 部署时间
  deployTime?: Date;
  // 描述
  description?: string;
  // 图片资源文件名称
  dgrmResourceName?: string;
  hasGraphicalNotation?: string;
  // 启动节点有无外置表单
  hasStartFormKey?: string;
  // 标识
  key?: string;
  // 名称
  name?: string;
  // 流程定义ID
  processDefinitionId?: string;
  // 资源文件名称
  resourceName?: string;
  // 挂起状态
  suspensionState?: number;
  // 租户id
  tenantId?: string;
  // 版本号
  version?: number;
}
