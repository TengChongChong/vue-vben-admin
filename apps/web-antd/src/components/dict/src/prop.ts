interface BaseDictProps {
  // 字典类别
  dictType: string;
}

/**
 * 字典 Tag
 */
export interface DictTagProps extends BaseDictProps {
  // 字典编码
  code: Array<number> | Array<string> | number | string;
  // 使用tag样式
  useTag?: boolean;
  // 当有多个字典时，字典与字典直接的分隔符
  separator?: string;
}

/**
 * 字典 Radio
 */
export interface DictRadioProps extends BaseDictProps {
  // value
  value: null | number | string;
}

/**
 * 字典 Checkbox
 */
export interface DictCheckboxProps extends BaseDictProps {
  // value
  value: Array<boolean> | Array<number> | Array<string>;
}

/**
 * 字典 Select
 */
export interface DictSelectProps extends BaseDictProps {
  // value
  value: Array<number> | Array<string> | number | string;
  // 设置 Select 的模式为多选或标签
  mode?: 'multiple' | 'tags' | undefined;
  // 配置是否可搜索
  showSearch?: boolean;
  // 搜索时过滤对应的 option 属性，不支持 children
  optionFilterProp?: string;
}

/**
 * 字典 Cascader (级联选择)
 */
export interface DictCascaderProps extends BaseDictProps {
  // value
  value: Array<number> | Array<string>;
}
