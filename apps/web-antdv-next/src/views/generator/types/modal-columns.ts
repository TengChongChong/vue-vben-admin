export type FieldConfigColumnType =
  | 'col'
  | 'componentType'
  | 'dictType'
  | 'isEnable'
  | 'label'
  | 'matchingMode'
  | 'name'
  | 'required'
  | 'title'
  | 'width';

export interface FieldConfigColumn {
  dataIndex: FieldConfigColumnType;
  title: string;
  width: number;
}

export interface FieldConfigTableModalData {
  columns: FieldConfigColumn[];
  config: Record<string, unknown>[];
  dictTypeOptions?: import('#/api').SelectModel[];
  title: string;
}

export const QUERY_CONFIG_COLUMNS: FieldConfigColumn[] = [
  { title: '显示', dataIndex: 'isEnable', width: 80 },
  { title: '字段', dataIndex: 'name', width: 160 },
  { title: 'Label', dataIndex: 'label', width: 160 },
  { title: 'ComponentType', dataIndex: 'componentType', width: 200 },
  { title: '字典类型', dataIndex: 'dictType', width: 260 },
  { title: '栅格', dataIndex: 'col', width: 160 },
  { title: '匹配方式', dataIndex: 'matchingMode', width: 160 },
];

export const TABLE_CONFIG_COLUMNS: FieldConfigColumn[] = [
  { title: '显示', dataIndex: 'isEnable', width: 80 },
  { title: '字段', dataIndex: 'name', width: 160 },
  { title: '标题', dataIndex: 'title', width: 160 },
  { title: '字典类型', dataIndex: 'dictType', width: 320 },
  { title: '宽度', dataIndex: 'width', width: 120 },
];

export const INPUT_CONFIG_COLUMNS: FieldConfigColumn[] = [
  { title: '显示', dataIndex: 'isEnable', width: 80 },
  { title: '必填', dataIndex: 'required', width: 100 },
  { title: '字段', dataIndex: 'name', width: 160 },
  { title: 'Label', dataIndex: 'label', width: 160 },
  { title: 'ComponentType', dataIndex: 'componentType', width: 200 },
  { title: '字典类型', dataIndex: 'dictType', width: 260 },
  { title: '栅格', dataIndex: 'col', width: 160 },
];

export const IMPORT_CONFIG_COLUMNS: FieldConfigColumn[] = [
  { title: '导入', dataIndex: 'isEnable', width: 80 },
  { title: '必填', dataIndex: 'required', width: 100 },
  { title: '字段', dataIndex: 'name', width: 160 },
  { title: '标题', dataIndex: 'title', width: 160 },
  { title: '字典类型', dataIndex: 'dictType', width: 320 },
  { title: '宽度', dataIndex: 'width', width: 120 },
];

export const EXPORT_CONFIG_COLUMNS: FieldConfigColumn[] = [
  { title: '导出', dataIndex: 'isEnable', width: 80 },
  { title: '字段', dataIndex: 'name', width: 160 },
  { title: '标题', dataIndex: 'title', width: 160 },
  { title: '字典类型', dataIndex: 'dictType', width: 320 },
  { title: '宽度', dataIndex: 'width', width: 120 },
];
