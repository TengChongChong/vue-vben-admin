interface BaseDictProps {
  class?: any;
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
  // 当有多个字典时，字典与字典之间的分隔符
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
  value: Array<number> | Array<string> | number | string | undefined;
  // 设置 Select 的模式为多选或标签
  mode?: 'multiple' | 'tags' | undefined;
}

/**
 * 字典 Cascader (级联选择)
 */
export interface DictCascaderProps extends BaseDictProps {
  // value
  value: Array<number> | Array<string> | undefined;
}

/**
 * 字典 TreeSelect (树选择)
 */
export interface DictTreeSelectProps extends BaseDictProps {
  // value
  value: Array<string> | string | undefined;
  // 支持多选
  multiple?: boolean;
}
