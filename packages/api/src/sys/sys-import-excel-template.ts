import type { Page } from '#/api/base/model/page-model';
import type { SysImportExcelTemplate } from '#/api/sys/model/sys-import-excel-template-model';

import { getRequestClient } from '../request-context';
// base url
const BASE_URL = '/auth/sys/import/excel/template';

/**
 * 查询
 *
 * @param params 查询条件
 * @param page 分页
 */
export function selectSysImportExcelTemplateApi(
  params: SysImportExcelTemplate,
  page: Page<SysImportExcelTemplate>,
) {
  return getRequestClient().get<Page<SysImportExcelTemplate>>(BASE_URL, {
    params: Object.assign(params, page),
  });
}

/**
 * 详情
 *
 * @param id id
 */
export function getSysImportExcelTemplateApi(id: string) {
  return getRequestClient().get<SysImportExcelTemplate>(`${BASE_URL}/${id}`);
}

/**
 * 删除
 *
 * @param ids ids
 */
export function removeSysImportExcelTemplateApi(ids: string) {
  return getRequestClient().delete<boolean>(`${BASE_URL}/${ids}`);
}

/**
 * 保存
 *
 * @param params 表单数据
 */
export function saveSysImportExcelTemplateApi(params: SysImportExcelTemplate) {
  return getRequestClient().post<SysImportExcelTemplate>(BASE_URL, params);
}

/**
 * 下载导入模板
 *
 * @param importCode 模板代码
 * @return 文件下载id
 */
export function downloadTemplateApi(importCode: string) {
  return getRequestClient().get<string>(`${BASE_URL}/template/${importCode}`);
}
