import type { Page } from '#/api/base/model/page-model';
import type { SysImportExcelTemporary } from '#/api/sys/model/sys-import-excel-temporary-model';

import { getRequestClient } from '../request-context';
// base url
const BASE_URL = '/auth/sys/import/excel/temporary';

/**
 * 查询
 *
 * @param params 查询条件
 * @param page 分页
 */
export function selectSysImportExcelTemporaryApi(
  params: SysImportExcelTemporary,
  page: Page<SysImportExcelTemporary>,
) {
  return getRequestClient().get<Page<SysImportExcelTemporary>>(BASE_URL, {
    params: Object.assign(params, page),
  });
}

/**
 * 详情
 *
 * @param id id
 */
export function getSysImportExcelTemporaryApi(id: string) {
  return getRequestClient().get<SysImportExcelTemporary>(`${BASE_URL}/${id}`);
}

/**
 * 新增
 */
export function addSysImportExcelTemporaryApi() {
  return getRequestClient().get<SysImportExcelTemporary>(`${BASE_URL}/add`);
}

/**
 * 删除
 *
 * @param ids ids
 */
export function removeSysImportExcelTemporaryApi(ids: string) {
  return getRequestClient().delete<boolean>(`${BASE_URL}/${ids}`);
}

/**
 * 保存
 *
 * @param params 表单数据
 */
export function saveSysImportExcelTemporaryApi(
  params: SysImportExcelTemporary,
) {
  return getRequestClient().post<SysImportExcelTemporary>(BASE_URL, params);
}

/**
 * 清空指定导入代码中数据
 *
 * @param templateId 模板id
 */
export function cleanMyImportApi(templateId: string) {
  return getRequestClient().delete<boolean>(
    `${BASE_URL}/clean/my/import/${templateId}`,
  );
}
