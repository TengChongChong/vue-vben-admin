import type { FormType } from '../types/generator.data';

import type { SelectModel } from '#/api/base/model/select-model';
import type {
  BasicsConfigModel,
  FieldConfig,
  ImportCellConfig,
  TableCellConfig,
  TableField,
  TableInfo,
} from '#/api/generator/model/generatorModel';

import { useDictStore } from '#/store';

import {
  FORM_TYPE,
  GenFile,
  GenMethod,
  MatchingMode,
} from '../types/generator.data';
import { PREFERENCE_SETTING } from '../types/preference-setting';

/**
 * 获取controller中@RequestMapping值
 * @param tableName 表名
 */
export function getControllerMapping(tableName: string): string {
  return tableName.replaceAll('_', '/');
}

/**
 * 根据表名获取前端路径
 *
 * @param tableName 表名
 */
export function getFrontEndPath(tableName: string): string {
  return tableName.includes('_')
    ? tableName
        .slice(0, Math.max(0, tableName.lastIndexOf('_')))
        .replaceAll('_', '/')
    : tableName;
}
/**
 * 根据表名获取前端Api路径
 *
 * @param tableName 表名
 */
export function getFrontEndApiPath(tableName: string): string {
  return tableName.includes('_')
    ? tableName.slice(0, Math.max(0, tableName.indexOf('_')))
    : tableName;
}

/**
 * 是否需要生成列表页
 *
 * @param basicsConfig 配置
 */
export function needGeneratorList(basicsConfig: BasicsConfigModel): boolean {
  return basicsConfig.genFile.includes(GenFile.LIST_VUE);
}
/**
 * 是否需要生成表单页
 *
 * @param basicsConfig 配置
 */
export function needGeneratorInput(basicsConfig: BasicsConfigModel): boolean {
  return basicsConfig.genFile.includes(GenFile.INPUT_VUE);
}
/**
 * 是否需要生成导入或导出
 *
 * @param basicsConfig 配置
 */
export function needGeneratorImportOrExport(
  basicsConfig: BasicsConfigModel,
): boolean {
  return needGeneratorImport(basicsConfig) || needGeneratorExport(basicsConfig);
}

export function needGeneratorImport(basicsConfig: BasicsConfigModel): boolean {
  return basicsConfig?.genMethod?.indexOf(GenMethod.IMPORT_DATA) > -1;
}

export function needGeneratorExport(basicsConfig: BasicsConfigModel): boolean {
  return basicsConfig?.genMethod?.indexOf(GenMethod.EXPORT_DATA) > -1;
}

/**
 * 获取controller方法中@RequiresPermissions值
 * @param tableName 表名
 */
export function getPermissionCode(tableName: string): string {
  return tableName.replaceAll('_', ':');
}

/**
 * 获取默认的表格
 *
 * @param tableInfo 表信息
 * @param dictTypeArray 字典类型，用于检查字段是否为字典
 */
export function getDefaultTable(
  tableInfo: TableInfo,
  dictTypeArray: string[],
): TableCellConfig[] {
  const defaultConfig: TableCellConfig[] = [];
  if (tableInfo.fields && tableInfo.fields.length > 0) {
    tableInfo.fields.forEach((field) => {
      const config = getTableCellConfig(tableInfo, field, dictTypeArray);
      if (config) {
        defaultConfig.push(config);
      }
    });
  }
  return defaultConfig;
}

/**
 * 获取表格配置
 *
 * @param tableInfo 表信息
 * @param field 字段
 * @param dictTypeArray 字典
 */
function getTableCellConfig(
  tableInfo: TableInfo,
  field: TableField,
  dictTypeArray: string[],
): TableCellConfig {
  const { name, comment, type, propertyName, propertyType, keyFlag, metaInfo } =
    field;

  // 是否在偏好设置中排除此字段
  const isExclude =
    PREFERENCE_SETTING.list.table.excludeTable.includes(propertyName);
  // 是否需要显示
  const isEnable = !keyFlag && !isExclude && !isLongField(field);

  // 公共参数
  const config: TableCellConfig = {
    isEnable,
    name,
    comment,
    type,
    propertyName,
    propertyType,
    keyFlag,
    metaInfo,
    title: comment,
    sorter: true,
  };
  // 查找字段字典
  const dictType = getDictType(tableInfo, field, dictTypeArray);
  if (dictType) {
    config.dictType = dictType;
    config.width = 150;
  } else {
    switch (propertyType) {
      case 'Date': {
        config.format = 'dateTime';
        config.width = 160;
        break;
      }
      case 'Double': {
        config.width = 160;
        break;
      }
      case 'Integer': {
        config.width = 160;
        break;
      }
      case 'Long': {
        config.width = 200;
        break;
      }
      case 'String': {
        if (
          PREFERENCE_SETTING.list.table.excludeSorter.includes(propertyName)
        ) {
          // 不支持排序的字段
          delete config.sorter;
        }
        // 计算单元格显示宽度
        if (field.metaInfo.length > 0) {
          // 计算大致宽度，如字段长度32：32 * 5 = 160，切最大宽度不超过偏好设置中设置的最大值
          config.width = Math.min(
            field.metaInfo.length * 5,
            PREFERENCE_SETTING.list.table.cellMaxWidth,
          );
          // 宽度最小为100px
          config.width = Math.max(config.width, 100);
        }
        break;
      }
      default: {
        console.warn('不支持的propertyType', field);
      }
    }
  }
  return config;
}

/**
 * 获取默认的查询条件
 *
 * @param tableInfo 表信息
 * @param dictTypeArray 字典类型，用于检查字段是否为字典
 * @param formType 表单类型
 */
export function getDefaultForm(
  tableInfo: TableInfo,
  dictTypeArray: string[],
  formType: FormType,
): FieldConfig[] {
  const defaultConfig: FieldConfig[] = [];
  if (tableInfo.fields && tableInfo.fields.length > 0) {
    tableInfo.fields.forEach((field) => {
      const config = getFieldConfig(tableInfo, field, dictTypeArray, formType);
      if (config) {
        defaultConfig.push(config);
      }
    });
  }
  return defaultConfig;
}

/**
 * 获取查询条件/表单配置
 *
 * @param tableInfo 表信息
 * @param field 字段
 * @param dictTypeArray 字典
 * @param formType 表单类型
 */
function getFieldConfig(
  tableInfo: TableInfo,
  field: TableField,
  dictTypeArray: string[],
  formType: FormType,
): FieldConfig {
  const { name, comment, type, propertyName, propertyType, keyFlag, metaInfo } =
    field;

  // 是否在偏好设置中排除此字段
  let isExclude = false;
  if (FORM_TYPE.QUERY === formType) {
    isExclude = PREFERENCE_SETTING.list.query.exclude.includes(propertyName);
    if (
      comment.includes('头像') ||
      comment.includes('封面') ||
      comment.includes('url')
    ) {
      isExclude = true;
    }
  } else if (FORM_TYPE.INPUT === formType) {
    isExclude = PREFERENCE_SETTING.input.exclude.includes(propertyName);
  }
  // 是否需要显示
  const isEnable = !keyFlag && !isExclude && !comment.includes('保留字段');

  // 公共参数
  const config: FieldConfig = {
    isEnable,
    name,
    comment,
    type,
    propertyName,
    propertyType,
    keyFlag,
    metaInfo,
    label: comment,
  };
  // 如果字段名是xx_id一般也不作为查询条件使用
  if (field.name.includes('_id')) {
    config.isEnable = false;
  }

  if (FORM_TYPE.INPUT === formType && !metaInfo.nullable && config.isEnable) {
    // 表单 & 必填 & 启用
    config.required = true;
  }

  // 查找字段字典
  const dictType = getDictType(tableInfo, field, dictTypeArray);
  if (dictType) {
    // 有字典
    config.dictType = dictType;
    if (FORM_TYPE.QUERY === formType) {
      config.componentType = 'DictSelect';
      config.matchingMode = MatchingMode.EQ;
    } else if (FORM_TYPE.INPUT === formType) {
      // 检查字典数量，如果>=5就用DictSelect，反之DictRadio
      const dictStore = useDictStore();
      const dictArray = dictStore.selectDictArray(dictType);
      config.componentType = dictArray.length >= 5 ? 'DictSelect' : 'DictRadio';
      config.required = false;
    }
  } else {
    /**
     * 默认规则如下：
     * 1、从字段中提取长度
     * 2、根据propertyType、字段长度、表单类型推断使用什么componentType
     */
    switch (field.propertyType) {
      case 'Date': {
        if (FORM_TYPE.QUERY === formType) {
          // 日期范围
          config.componentType = 'RangePicker';
          config.matchingMode = MatchingMode.DATE_RANGE;
        } else if (FORM_TYPE.INPUT === formType) {
          config.componentType = 'DatePicker';
        }
        break;
      }
      case 'Double':
      case 'Integer':
      case 'Long': {
        config.componentType = 'InputNumber';
        if (FORM_TYPE.QUERY === formType) {
          config.isEnable = PREFERENCE_SETTING.list.query.enableNumber;
          config.matchingMode = MatchingMode.EQ;
        }
        break;
      }
      case 'String': {
        if (FORM_TYPE.QUERY === formType) {
          // 如果字段中包含id，可能是其他表关联字段
          config.matchingMode = field.name.includes('_id')
            ? MatchingMode.EQ
            : MatchingMode.LIKE;
        }
        if (isPassword(field)) {
          config.componentType = 'InputPassword';
        } else {
          if (FORM_TYPE.QUERY === formType) {
            // 查询表单统一使用Input
            config.componentType = 'Input';
          } else {
            const length = field.metaInfo.length;
            config.componentType =
              length && length > PREFERENCE_SETTING.input.inputMaxLength
                ? 'Textarea'
                : 'Input';
          }
        }
        break;
      }
      default: {
        console.warn('不支持的propertyType', field);
      }
    }
  }
  return config;
}

/**
 * 字段是否为密码/密钥
 *
 * @param field
 */
function isPassword(field: TableField): boolean {
  return (
    field.comment.includes('密码') ||
    field.comment.includes('密钥') ||
    field.name.includes('password') ||
    field.name.includes('pwd') ||
    field.name.includes('secret')
  );
}

/**
 * 是否较长字段，
 *
 * @param field 字段
 */
function isLongField(field: TableField): boolean {
  // 长字段类型
  const textFieldType: string[] = ['text', 'mediumtext', 'longtext'];
  if (textFieldType.includes(field.metaInfo.jdbcType.toLowerCase())) {
    return true;
  }
  if (field.propertyType === 'String' && field.metaInfo.length > 0) {
    return (
      field.metaInfo.length >= PREFERENCE_SETTING.list.table.autoHideFieldLength
    );
  }
  return false;
}

/**
 * 获取默认的导出
 *
 * @param tableInfo 表信息
 * @param dictTypeArray 字典类型，用于检查字段是否为字典
 */
export function getDefaultExport(
  tableInfo: TableInfo,
  dictTypeArray: string[],
): TableCellConfig[] {
  const defaultConfig: TableCellConfig[] = [];
  if (tableInfo.fields && tableInfo.fields.length > 0) {
    tableInfo.fields.forEach((field) => {
      const config = getExportConfig(tableInfo, field, dictTypeArray);
      if (config) {
        defaultConfig.push(config);
      }
    });
  }
  return defaultConfig;
}

/**
 * 获取表格配置
 *
 * @param tableInfo 表信息
 * @param field 字段
 * @param dictTypeArray 字典
 */
function getExportConfig(
  tableInfo: TableInfo,
  field: TableField,
  dictTypeArray: string[],
): TableCellConfig {
  const { name, comment, type, propertyName, propertyType, keyFlag, metaInfo } =
    field;

  // 是否在偏好设置中排除此字段
  const isExclude = PREFERENCE_SETTING.export.exclude.includes(propertyName);
  // 是否需要导出
  const isEnable = !keyFlag && !isExclude;

  // 公共参数
  const config: TableCellConfig = {
    isEnable,
    name,
    comment,
    type,
    propertyName,
    propertyType,
    keyFlag,
    title: comment,
    metaInfo,
  };
  // 查找字段字典
  const dictType = getDictType(tableInfo, field, dictTypeArray);
  if (dictType) {
    config.dictType = dictType;
    config.width = 150;
  } else {
    switch (propertyType) {
      case 'Date': {
        config.width = 160;
        break;
      }
      case 'Double': {
        config.width = 160;
        break;
      }
      case 'Integer': {
        config.width = 160;
        break;
      }
      case 'Long': {
        config.width = 200;
        break;
      }
      case 'String': {
        // 计算单元格显示宽度
        if (field.metaInfo.length > 0) {
          // 按字段长度 * 16px / 2，省略个位数，计算大致宽度，如字段长度32：32 * 16 / 2 = 256取250为宽度，切最大宽度不超过偏好设置中设置的最大值
          config.width = Math.min(
            Math.floor(field.metaInfo.length * 0.8) * 10,
            PREFERENCE_SETTING.export.cellMaxWidth,
          );
        }
        break;
      }
      default: {
        console.warn('不支持的propertyType', field);
      }
    }
  }
  return config;
}

/**
 * 获取默认的导出
 *
 * @param tableInfo 表信息
 * @param dictTypeArray 字典类型，用于检查字段是否为字典
 */
export function getDefaultImport(
  tableInfo: TableInfo,
  dictTypeArray: string[],
): ImportCellConfig[] {
  const defaultConfig: ImportCellConfig[] = [];
  if (tableInfo.fields && tableInfo.fields.length > 0) {
    tableInfo.fields.forEach((field) => {
      const config = getImportConfig(tableInfo, field, dictTypeArray);
      if (config) {
        defaultConfig.push(config);
      }
    });
  }
  return defaultConfig;
}

/**
 * 获取表格配置
 *
 * @param tableInfo 表信息
 * @param field 字段
 * @param dictTypeArray 字典
 */
function getImportConfig(
  tableInfo: TableInfo,
  field: TableField,
  dictTypeArray: string[],
): ImportCellConfig {
  const { name, comment, type, propertyName, propertyType, keyFlag, metaInfo } =
    field;

  // 是否在偏好设置中排除此字段
  const isExclude = PREFERENCE_SETTING.export.exclude.includes(propertyName);
  // 是否需要导出
  const isEnable = !keyFlag && !isExclude;

  // 公共参数
  const config: ImportCellConfig = {
    isEnable,
    name,
    comment,
    type,
    propertyName,
    propertyType,
    keyFlag,
    metaInfo,
    title: comment,
    required: false,
  };
  // 查找字段字典
  const dictType = getDictType(tableInfo, field, dictTypeArray);
  if (dictType) {
    config.dictType = dictType;
    config.width = 150;
  } else {
    switch (propertyType) {
      case 'Date': {
        config.width = 160;
        break;
      }
      case 'Double': {
        config.width = 160;
        break;
      }
      case 'Integer': {
        config.width = 160;
        break;
      }
      case 'Long': {
        config.width = 200;
        break;
      }
      case 'String': {
        // 计算单元格显示宽度
        if (field.metaInfo.length > 0) {
          // 按字段长度 * 16px / 2，省略个位数，计算大致宽度，如字段长度32：32 * 16 / 2 = 256取250为宽度，切最大宽度不超过偏好设置中设置的最大值
          config.width = Math.min(
            Math.floor(field.metaInfo.length * 0.8) * 10,
            PREFERENCE_SETTING.export.cellMaxWidth,
          );
        }
        break;
      }
      default: {
        console.warn('不支持的propertyType', field);
      }
    }
  }
  return config;
}

/**
 * 查找字段字典
 * 如 business_sample 表的 apply_status 字段，
 * 查找字典优先级为: businessSampleApplyStatus > BusinessSampleApplyStatus > businessApplyStatus > BusinessApplyStatus > applyStatus > ApplyStatus > apply_status
 *
 * @param tableInfo 表信息
 * @param field 字段
 * @param dictTypeArray 字典
 */
export function getDictType(
  tableInfo: TableInfo,
  field: TableField,
  dictTypeArray: string[],
): string {
  // 实体类首字母小写 + 属性
  let dictType =
    firstLowerCase(tableInfo.entityName) + firstUpperCase(field.propertyName);
  if (dictTypeArray.includes(dictType)) {
    return dictType;
  }

  // 实体类 + 属性
  dictType = tableInfo.entityName + firstUpperCase(field.propertyName);
  if (dictTypeArray.includes(dictType)) {
    return dictType;
  }

  const tableName = tableInfo.name.toLowerCase();
  if (tableName.includes('_')) {
    // 表前缀
    const tablePrefix = tableName.slice(0, Math.max(0, tableName.indexOf('_')));
    // 表前缀 + 属性
    dictType = tablePrefix + firstUpperCase(field.propertyName);
    if (dictTypeArray.includes(dictType)) {
      return dictType;
    }

    // 表前缀首字母大写 + 属性
    dictType = firstUpperCase(dictType);
    if (dictTypeArray.includes(dictType)) {
      return dictType;
    }

    // 表后缀 + 属性
    const tableSuffix = tableName.slice(
      Math.max(0, tableName.indexOf('_') + 1),
    );
    // 表后缀 + 属性
    dictType = tableSuffix + firstUpperCase(field.propertyName);
    if (dictTypeArray.includes(dictType)) {
      return dictType;
    }

    // 表后缀首字母大写 + 属性
    dictType = firstUpperCase(dictType);
    if (dictTypeArray.includes(dictType)) {
      return dictType;
    }
  } else {
    // 表 + 属性
    dictType = tableName + firstUpperCase(field.propertyName);
    if (dictTypeArray.includes(dictType)) {
      return dictType;
    }

    // 表首字母大写 + 属性
    dictType = firstUpperCase(dictType);
    if (dictTypeArray.includes(dictType)) {
      return dictType;
    }
  }

  // 属性
  dictType = field.propertyName;
  if (dictTypeArray.includes(dictType)) {
    return dictType;
  }

  // 属性 - 首字母大写
  dictType = firstUpperCase(field.propertyName);
  if (dictTypeArray.includes(dictType)) {
    return dictType;
  }

  // 字段
  if (dictTypeArray.includes(field.name)) {
    return field.name;
  }

  // 状态可能使用通用状态
  if (field.propertyName === 'status') {
    return 'commonStatus';
  }

  if (
    field.comment && // 是否
    field.comment.includes('是否')
  ) {
    return 'whether';
  }

  return null;
}

export function getApiFileName(table: string) {
  return table.replaceAll('_', '-');
}

/**
 * 首字母大写
 *
 * @param str 字符串
 */
export function firstUpperCase(str: string): string {
  return str.replaceAll(/( |^)[a-z]/g, (L) => L.toUpperCase());
}

/**
 * 首字母小写
 *
 * @param str 字符串
 */
export function firstLowerCase(str: string): string {
  return str.replaceAll(/( |^)[A-Z]/g, (L) => L.toLowerCase());
}

/**
 * 把字典类型转为只有代码的数组
 *
 * @param dictTypeOptions 字典类型
 */
export function toDictTypeArray(dictTypeOptions: SelectModel[]): string[] {
  const dictTypeArray: string[] = [];
  dictTypeOptions.forEach((item) => {
    dictTypeArray.push(item.value as string);
  });
  return dictTypeArray;
}
