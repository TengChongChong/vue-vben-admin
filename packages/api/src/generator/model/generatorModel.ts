export interface MetaInfo {
  // 默认值
  defaultValue: any;
  // jdbc类型
  jdbcType: string;
  // 字段长度
  length: number;
  // 是否可为空
  nullable: boolean;
  // 注释
  remarks: string;
  scale: number;
  // 字段类型
  typeName: string;
}

export interface TableField {
  columnName: string;
  // 注释
  comment: string;
  // 是否是主键
  keyFlag: boolean;
  // metaInfo
  metaInfo: MetaInfo;
  // 数据库字段
  name: string;
  // 属性名
  propertyName: string;
  // 属性类型
  propertyType: string;
  // 类型
  type: string;
}

/**
 * 表信息
 */
export interface TableInfo {
  // 注释
  comment: string;
  // 实体类名称
  entityName: string;
  //
  fields: TableField[];
  // 是否有主键
  havePrimaryKey: boolean;
  // 表名
  name: string;
}

// 表格
export interface TableCellConfig extends TableField {
  // 字典类型
  dictType?: string;
  // 过滤器
  filters?: string;
  // 固定在左侧/右侧
  fixed?: string;
  // 格式化
  format?: string;
  // 是否启用
  isEnable: boolean;
  // 排序
  sorter?: boolean;
  // 标题
  title: string;
  // 宽度
  width?: number;
}

// 导入
export interface ImportCellConfig extends TableField {
  // 字典类型
  dictType?: string;
  // 是否启用
  isEnable: boolean;
  // 是否必填
  required: boolean;
  // 标题
  title: string;
  // 宽度
  width?: number;
}

// 查询条件&表单
export interface FieldConfig extends TableField {
  // 栅格
  col?: string;
  // 组件类型
  componentType?: string;
  // 字典类型
  dictType?: string;
  // 是否启用
  isEnable: boolean;
  // Label
  label: string;
  // 匹配方式
  matchingMode?: string;
  // 是否必填
  required?: boolean;
}

// 基础信息
export interface BasicsConfigModel {
  apiPath?: string;
  author?: string;
  backEndPath?: string;
  businessName?: string;
  controllerMapping?: string;
  dataSource: string;
  formGeneratorTemplate: string;
  frontEndPath?: string;
  generatorTemplate: string;
  genFile: string[];
  genMethod: string[];
  listGeneratorTemplate: string;
  menuName?: string;
  modelName?: string;
  overwrite: boolean;
  packagePath?: string;
  permissionCode?: string;
  table?: string;
  viewPath?: string;
}

export interface QueryDataTableParams {
  dataSource: string;
}

export interface GenerateDictEnumResponse {
  javaCode: string;
  javaFileName: string;
  jsCode: string;
  jsFileName: string;
}

// 代码生成全局配置
export interface GeneratorConfig {
  // 基础
  basicsConfig: BasicsConfigModel;
  // 导出
  exportConfig?: TableCellConfig[];
  // 导入
  importConfig?: ImportCellConfig[];
  // 表单
  inputConfig?: FieldConfig[];
  // 查询条件
  queryConfig?: FieldConfig[];
  // 列表
  tableConfig?: TableCellConfig[];
  // 表信息
  tableInfo: TableInfo;
}
