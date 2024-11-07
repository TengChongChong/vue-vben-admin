import type { Page } from '#/api/base/model/page-model';
import type { SysImportExcelTemporary } from '#/api/sys/model/sys-importExcelTemporary-model';

import { requestClient } from '#/api/request';
// base url
const BASE_URL = '/auth/sys/import/excel/temporary';

/**
 * 查询
 *
 * @param params 查询条件
 * @param page 分页
 */
export function selectApi(
  params: SysImportExcelTemporary,
  page: Page<SysImportExcelTemporary>,
) {
  return requestClient.get<Page<SysImportExcelTemporary>>(BASE_URL, {
    params: Object.assign(params, page),
  });
}

/**
 * 详情
 *
 * @param id id
 */
export function getApi(id: string) {
  return requestClient.get<SysImportExcelTemporary>(`${BASE_URL}/${id}`);
}

/**
 * 新增
 */
export function addApi() {
  return requestClient.get<SysImportExcelTemporary>(`${BASE_URL}/add`);
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
 * 保存
 *
 * @param params 表单数据
 */
export function saveApi(params: SysImportExcelTemporary) {
  return requestClient.post<SysImportExcelTemporary>(BASE_URL, params);
}

/**
 * 清空指定导入代码中数据
 *
 * @param templateId 模板id
 */
export function cleanMyImportApi(templateId: string) {
  return requestClient.delete<boolean>(
    `${BASE_URL}/clean/my/import/${templateId}`,
  );
}
