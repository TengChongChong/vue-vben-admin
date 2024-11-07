import type { Page } from '#/api/base/model/page-model';
import type { SysImportExcelTemplate } from '#/api/sys/model/sys-import-excel-template-model';

import { requestClient } from '#/api/request';
// base url
const BASE_URL = '/auth/sys/import/excel/template';

/**
 * 查询
 *
 * @param params 查询条件
 * @param page 分页
 */
export function selectApi(
  params: SysImportExcelTemplate,
  page: Page<SysImportExcelTemplate>,
) {
  return requestClient.get<Page<SysImportExcelTemplate>>(BASE_URL, {
    params: Object.assign(params, page),
  });
}

/**
 * 详情
 *
 * @param id id
 */
export function getApi(id: string) {
  return requestClient.get<SysImportExcelTemplate>(`${BASE_URL}/${id}`);
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
export function saveApi(params: SysImportExcelTemplate) {
  return requestClient.post<SysImportExcelTemplate>(BASE_URL, params);
}

/**
 * 下载导入模板
 *
 * @param importCode 模板代码
 * @return 文件下载id
 */
export function downloadTemplateApi(importCode: string) {
  return requestClient.get<string>(`${BASE_URL}/template/${importCode}`);
}
