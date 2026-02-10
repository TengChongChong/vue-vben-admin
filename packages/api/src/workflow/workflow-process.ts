import type { Page } from '#/api/base/model/page-model';
import type { WorkflowProcess } from '#/api/workflow/model/workflow-process-model';

import { getRequestClient } from '../request-context';

// base url
const BASE_URL = '/auth/workflow/process';

/**
 * 查询
 *
 * @param params 查询条件
 * @param page 分页
 */
export function selectWorkflowProcessApi(
  params: WorkflowProcess,
  page: Page<WorkflowProcess>,
) {
  return getRequestClient().get<Page<WorkflowProcess>>(BASE_URL, {
    params: Object.assign(params, page),
  });
}

/**
 * 删除
 *
 * @param ids ids
 */
export function removeWorkflowProcessApi(ids: string) {
  return getRequestClient().delete<boolean>(`${BASE_URL}/${ids}`);
}

/**
 * 流程转模型
 *
 * @param params 表单数据
 */
export function convertToModelApi(params: WorkflowProcess) {
  return getRequestClient().post<boolean>(
    `${BASE_URL}/convert/to/model`,
    params,
  );
}

/**
 * 挂起流程
 *
 * @param processDefinitionId     流程id
 * @param suspendProcessInstances 如果为true，将同时挂起此流程正在进行的任务
 */
export function suspendWorkflowProcessApi(
  processDefinitionId: string,
  suspendProcessInstances: boolean,
) {
  return getRequestClient().post<boolean>(
    `${BASE_URL}/suspend/${processDefinitionId}/${suspendProcessInstances}`,
  );
}

/**
 * 激活流程
 *
 * @param processDefinitionId     流程id
 * @param suspendProcessInstances 如果为true，将同时激活此流程正在进行的任务
 */
export function activationWorkflowProcessApi(
  processDefinitionId: string,
  suspendProcessInstances: boolean,
) {
  return getRequestClient().post<boolean>(
    `${BASE_URL}/activation/${processDefinitionId}/${suspendProcessInstances}`,
  );
}
