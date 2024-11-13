/**
 * 代码生成版本
 */
export enum GeneratorVersion {
  VBEN2 = 'vben2',
  VBEN5 = 'vben5',
}

/**
 * 生成文件
 */
export enum GenFile {
  API_TS = 'api.ts',
  CONTROLLER = 'controller',
  INPUT_VUE = 'input.vue',
  LIST_VUE = 'list.vue',
  MAPPER = 'mapper',
  MODEL = 'model',
  SERVICE = 'service',
}

/**
 * 生成方法
 */
export enum GenMethod {
  ADD = 'add',
  EXPORT_DATA = 'exportData',
  IMPORT_DATA = 'importData',
  REMOVE = 'remove',
  SAVE = 'save',
  SELECT = 'select',
}

// 所有文件
const allFile = [
  GenFile.MODEL,
  GenFile.MAPPER,
  GenFile.SERVICE,
  GenFile.CONTROLLER,
  GenFile.LIST_VUE,
  GenFile.INPUT_VUE,
  GenFile.API_TS,
];

// 所有方法
const allMethod = [
  GenMethod.ADD,
  GenMethod.REMOVE,
  GenMethod.SAVE,
  GenMethod.SELECT,
  GenMethod.EXPORT_DATA,
  GenMethod.IMPORT_DATA,
];

/**
 * 生成模板
 */
export enum GeneratorTemplate {
  MAIN_TABLE = 'main-table',
  SUB_TABLE = 'sub-table',
}

/**
 * 生成模板 - 列表
 */
export enum ListGeneratorTemplate {
  TABLE = 'table',
  TREE = 'tree',
  TREE_TABLE = 'tree-table',
}

/**
 * 生成模板 - 表单
 */
export enum FormGeneratorTemplate {
  DRAWER = 'drawer',
  MODAL = 'modal',
  PAGE = 'page',
}

/**
 * 模板详情
 */
export const TEMPLATE = {
  table: { file: allFile, method: allMethod },
  'tree-table': { file: allFile, method: allMethod },
  tree: { file: allFile, method: allMethod },
};
// 表单类型
export type FormType = 'input' | 'query';

// 表单类型
export const FORM_TYPE = {
  QUERY: 'query',
  INPUT: 'input',
};

// 匹配方式
export enum MatchingMode {
  DATE_RANGE = 'start_end',
  EQ = 'eq',
  GT = 'gt',
  GTE = 'gte',
  LEFT_LIKE = 'left_like',
  LIKE = 'like',
  LT = 'lt',
  LTE = 'lte',
  NE = 'ne',
  RIGHT_LIKE = 'right_like',
}
