import type { Page } from '#/api/base/model/page-model';
import type { WorkflowModelVO } from '#/api/workflow/model/workflow-model-model';

import { getRequestClient } from '../request-context';

// base url
const BASE_URL = '/auth/workflow/model';

/**
 * 查询
 *
 * @param params 查询条件
 * @param page 分页
 */
export function selectWorkflowModelApi(
  params: WorkflowModelVO,
  page: Page<WorkflowModelVO>,
) {
  return getRequestClient().get<Page<WorkflowModelVO>>(BASE_URL, {
    params: Object.assign(params, page),
  });
}

/**
 * 详情
 *
 * @param id id
 */
export function getWorkflowModelApi(id: string) {
  return getRequestClient().get<WorkflowModelVO>(`${BASE_URL}/${id}`);
}

/**
 * 删除
 *
 * @param ids ids
 */
export function removeWorkflowModelApi(ids: string) {
  return getRequestClient().delete<boolean>(`${BASE_URL}/${ids}`);
}

/**
 * 保存
 *
 * @param params 表单数据
 */
export function saveWorkflowModelApi(params: WorkflowModelVO) {
  return getRequestClient().post<WorkflowModelVO>(BASE_URL, params);
}

/**
 * 部署流程
 *
 * @param id id
 */
export function deploymentProcessApi(id: string) {
  return getRequestClient().post<boolean>(
    `${BASE_URL}/deployment/process/${id}`,
  );
}

/**
 * 导出模型 xml
 *
 * @param id 模型id
 * @return sys download id
 */
export function exportXmlApi(id: string) {
  return getRequestClient().get<string>(`${BASE_URL}/export/${id}`);
}

/**
 * 根据模型标识查询流程定义ID
 *
 * @param key 模型标识
 * @return 流程定义ID
 */
export function getProcessDefinitionIdApi(key: string) {
  return getRequestClient().get<string>(
    `${BASE_URL}/process/definition/id/${key}`,
  );
}
