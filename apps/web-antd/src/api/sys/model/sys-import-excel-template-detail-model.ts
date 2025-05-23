import type { BasicModel } from '#/api/base/model/base-model';

/**
 * 导入模板详情
 */
export interface SysImportExcelTemplateDetail extends BasicModel {
  // 模板id
  templateId?: string;
  // 数据库字段名
  fieldName: string;
  // 标题
  title?: string;
  // 字段长度
  fieldLength?: number;
  // 字段类型
  fieldType?: string;
  // 替换表表名
  replaceTable?: string;
  // 替换表 - 名称
  replaceTableFieldName?: string;
  // 替换表 - 值
  replaceTableFieldValue?: string;
  // 替换表 - 字典类型
  replaceTableDictType?: string;
  // 是否需要导入
  needImport?: boolean;
  // 是否需要替换
  needReplace?: boolean;
  // 是否必填
  dataRequired?: boolean;
  // 是否唯一
  dataOnly?: boolean;
  // 导入时Excel 字段下标
  index?: number;
}

export interface SysImportExcelTemplateDetailVO {
  fieldName: string;
  index: number;
}
