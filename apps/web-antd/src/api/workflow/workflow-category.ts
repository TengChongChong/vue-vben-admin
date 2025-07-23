import type { Page } from '#/api/base/model/page-model';
import type { TreeNodeModel } from '#/api/base/model/tree-model';
import type { WorkflowCategoryVO } from '#/api/workflow/model/workflow-category-model';

import { requestClient } from '#/api/request';

// base url
const BASE_URL = '/auth/workflow/category';
/**
 * 查询数据（无分页）
 *
 * @param params 查询条件
 */
export function selectApi(params: WorkflowCategoryVO) {
  return requestClient.get<Page<WorkflowCategoryVO>>(BASE_URL, {
    params: params,
  });
}
/**
 * 查询所有数据（Tree）
 */
export function selectAllApi() {
  return requestClient.get<TreeNodeModel[]>(`${BASE_URL}/all`);
}

/**
 * 查询详情
 *
 * @param id id
 */
export function getApi(id: string) {
  return requestClient.get<WorkflowCategoryVO>(`${BASE_URL}/${id}`);
}
/**
 * 新增或新增下级
 *
 * @param parentId 父id
 */
export function addApi(parentId: string | undefined) {
  return requestClient.get<WorkflowCategoryVO>(
    `${BASE_URL}/add${parentId ? `/${parentId}` : ''}`,
  );
}

/**
 * 删除
 *
 * @param ids ids
 */
export function removeApi(ids: string) {
  return requestClient.delete<boolean>(`${BASE_URL}/${ids}`);
}

/**
 * 保存/修改
 *
 * @param params 表单数据
 */
export function saveApi(params: WorkflowCategoryVO) {
  return requestClient.post<WorkflowCategoryVO>(BASE_URL, params);
}

/**
 * 保存排序&结构
 *
 * @param params 表单数据
 */
export function saveOrderApi(params: WorkflowCategory[]) {
  return requestClient.post<WorkflowCategory>(`${BASE_URL}/order`, params);
}
