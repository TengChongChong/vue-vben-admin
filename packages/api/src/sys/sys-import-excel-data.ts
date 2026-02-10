import type { FileInfo } from '#/api/file/model/fileInfo-model';
import type { SysImportExcelTemplateDetailVO } from '#/api/sys/model/sys-import-excel-template-detail-model';
import type { SysImportExcelTemplateVO } from '#/api/sys/model/sys-import-excel-template-model';

import { getRequestClient } from '../request-context';
// base url
const BASE_URL = '/auth/sys/import/excel/data';

/**
 * 导入汇总，用于显示导入到临时表后的汇总信息
 */
export interface SysImportSummary {
  fail: number;
  success: number;
  total: number;
}

/**
 * 获取导入模板信息
 *
 * @param importCode 模板代码
 */
export function getImportExcelTemplateApi(importCode: string) {
  return getRequestClient().get<SysImportExcelTemplateVO>(
    `${BASE_URL}/${importCode}`,
  );
}

/**
 * 检查上次导入数据
 *
 * @param templateId 模板id
 */
export function checkLastDataApi(templateId: string) {
  return getRequestClient().get<boolean>(
    `${BASE_URL}/check/last/data/${templateId}`,
  );
}

/**
 * 解析文件
 *
 * @param fileInfo fileInfo
 * @return [[1,2,3]]
 */
export function analysisExcelApi(fileInfo: FileInfo) {
  return getRequestClient().post<Array<Array<string>>>(
    `${BASE_URL}/analysis/excel`,
    fileInfo,
  );
}

/**
 * 验证并解析文件
 *
 * @param templateId 模板id
 * @param startRow 起始行
 * @param fileInfo 上传的Excel
 * @param templateDetailList 配置的导入规则
 */
export function analysisApi(
  templateId: string,
  startRow: number,
  fileInfo: FileInfo,
  templateDetailList: SysImportExcelTemplateDetailVO[],
) {
  return getRequestClient().post<boolean>(
    `${BASE_URL}/analysis/${templateId}`,
    {
      startRow,
      fileInfo,
      templateDetailList,
    },
  );
}

/**
 * 查询指定导入汇总信息
 *
 * @param templateId 模板id
 */
export function selectSummaryApi(templateId: string) {
  return getRequestClient().get<SysImportSummary>(
    `${BASE_URL}/summary/${templateId}`,
  );
}

/**
 * 插入数据
 *
 * @param templateId 模板id
 */
export function insertDataApi(templateId: string) {
  return getRequestClient().post<number>(`${BASE_URL}/data/${templateId}`);
}

/**
 * 导出验证失败数据
 *
 * @param templateId 模板id
 */
export function exportVerificationFailDataApi(templateId: string) {
  return getRequestClient().get<string>(
    `${BASE_URL}/export/verification/fail/data/${templateId}`,
  );
}
