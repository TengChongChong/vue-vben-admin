import type { Page } from '#/api/base/model/page-model';
import type { TreeNodeModel } from '#/api/base/model/tree-model';
import type { WorkflowCategoryVO } from '#/api/workflow/model/workflow-category-model';

import { getRequestClient } from '../request-context';

// base url
const BASE_URL = '/auth/workflow/category';
/**
 * 查询数据（无分页）
 *
 * @param params 查询条件
 */
export function selectWorkflowCategoryApi(params: WorkflowCategoryVO) {
  return getRequestClient().get<Page<WorkflowCategoryVO>>(BASE_URL, {
    params,
  });
}
/**
 * 查询所有数据（Tree）
 */
export function selectAllWorkflowCategoryApi() {
  return getRequestClient().get<TreeNodeModel[]>(`${BASE_URL}/all`);
}

/**
 * 查询详情
 *
 * @param id id
 */
export function getWorkflowCategoryApi(id: string) {
  return getRequestClient().get<WorkflowCategoryVO>(`${BASE_URL}/${id}`);
}
/**
 * 新增或新增下级
 *
 * @param parentId 父id
 */
export function addWorkflowCategoryApi(parentId: string | undefined) {
  return getRequestClient().get<WorkflowCategoryVO>(
    `${BASE_URL}/add${parentId ? `/${parentId}` : ''}`,
  );
}

/**
 * 删除
 *
 * @param ids ids
 */
export function removeWorkflowCategoryApi(ids: string) {
  return getRequestClient().delete<boolean>(`${BASE_URL}/${ids}`);
}

/**
 * 保存/修改
 *
 * @param params 表单数据
 */
export function saveWorkflowCategoryApi(params: WorkflowCategoryVO) {
  return getRequestClient().post<WorkflowCategoryVO>(BASE_URL, params);
}

/**
 * 保存排序&结构
 *
 * @param params 表单数据
 */
export function saveWorkflowCategoryOrderApi(params: WorkflowCategory[]) {
  return getRequestClient().post<WorkflowCategory>(`${BASE_URL}/order`, params);
}
