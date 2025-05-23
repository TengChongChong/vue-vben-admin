import type { BasicModel } from '#/api/base/model/base-model';
import type { SysImportExcelTemplateDetail } from '#/api/sys/model/sys-import-excel-template-detail-model';

/**
 * 导入模板
 */
export interface SysImportExcelTemplate extends BasicModel {
  // 模板名称
  name: string;
  // 表
  importTable: string;
  // 起始行
  startRow: number;
  // 回调
  callback: string;
  // 模板代码
  importCode: string;
  // 权限标识，用于检查当前登录用户是否允许使用此模板
  permissionCode?: string;
}

export interface SysImportExcelTemplateVO extends SysImportExcelTemplate {
  // 导入配置
  detailList: SysImportExcelTemplateDetail[];
}
