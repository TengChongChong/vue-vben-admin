import type { SysImportExcelTemplateDetail } from '#/api/sys/model/sys-import-excel-template-detail-model';

import { requestClient } from '#/api/request';
// base url
const BASE_URL = '/auth/sys/import/excel/template/details';

/**
 * 获取已配置字段
 *
 * @param templateId 导入模板id
 * @return List<SysImportExcelTemplateDetails>
 */
export function selectDetailsApi(templateId: string) {
  return requestClient.get<SysImportExcelTemplateDetail[]>(
    `${BASE_URL}/details/${templateId}`,
  );
}

/**
 * 保存
 *
 * @param templateId 导入模板id
 * @param list       表单内容
 * @return true/false
 */
export function saveDataApi(
  templateId: string,
  list: SysImportExcelTemplateDetail[],
) {
  return requestClient.post<boolean>(`${BASE_URL}/${templateId}`, list);
}
