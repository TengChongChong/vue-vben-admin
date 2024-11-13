import type { GeneratorVersion } from '#/views/generator/types/generator.data';

/**
 * 表信息
 */
export interface TableInfo {
  // 表名
  name: string;
  // 注释
  comment: string;
  // 实体类名称
  entityName: string;
  // 是否有主键
  havePrimaryKey: boolean;
  //
  fields: TableField[];
}

export interface TableField {
  // 数据库字段
  name: string;
  // 注释
  comment: string;
  // 类型
  type: string;
  // 属性名
  propertyName: string;
  // 属性类型
  propertyType: string;
  // 是否是主键
  keyFlag: boolean;
  // metaInfo
  metaInfo: MetaInfo;
}

export interface MetaInfo {
  // 默认值
  defaultValue: any;
  // jdbc类型
  jdbcType: string;
  // 字段类型
  typeName: string;
  // 字段长度
  length: number;
  // 是否可为空
  nullable: boolean;
  // 注释
  remarks: string;
  scale: number;
}

// 代码生成全局配置
export interface GeneratorConfig {
  // 表信息
  tableInfo: TableInfo;
  // 基础
  basicsConfig: BasicsConfigModel;
  // 查询条件
  queryConfig?: FieldConfig[];
  // 列表
  tableConfig?: TableCellConfig[];
  // 表单
  inputConfig?: FieldConfig[];
  // 导入
  importConfig?: ImportCellConfig[];
  // 导出
  exportConfig?: TableCellConfig[];
}

// 表格
export interface TableCellConfig extends TableField {
  // 是否启用
  isEnable: boolean;
  // 标题
  title: string;
  // 宽度
  width?: number;
  // 字典类型
  dictType?: string;
  // 格式化
  format?: string;
  // 过滤器
  filters?: string;
  // 排序
  sorter?: boolean;
  // 固定在左侧/右侧
  fixed?: string;
}

// 导入
export interface ImportCellConfig extends TableField {
  // 是否启用
  isEnable: boolean;
  // 标题
  title: string;
  // 是否必填
  required: boolean;
  // 字典类型
  dictType?: string;
  // 宽度
  width?: number;
}

// 查询条件&表单
export interface FieldConfig extends TableField {
  // 是否启用
  isEnable: boolean;
  // Label
  label: string;
  // 组件类型
  componentType?: string;
  // 字典类型
  dictType?: string;
  // 栅格
  col?: string;
  // 匹配方式
  matchingMode?: string;
  // 是否必填
  required?: boolean;
}

// 基础信息
export interface BasicsConfigModel {
  dataSource: string;
  table?: string;
  generatorTemplate: string;
  listGeneratorTemplate: string;
  formGeneratorTemplate: string;
  genMethod: string[];
  genFile: string[];
  backEndPath?: string;
  businessName?: string;
  author?: string;
  modelName?: string;
  menuName?: string;
  permissionCode?: string;
  packagePath?: string;
  controllerMapping?: string;
  frontEndPath?: string;
  viewPath?: string;
  apiPath?: string;
  overwrite: boolean;
  generatorVersion: GeneratorVersion;
}
