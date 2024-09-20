export interface BaseApiProps {
  class?: any;
  // api
  api: (id: string) => Promise<boolean>;
  // api 参数
  params?: Record<string, any>;
  // 回调，用于处理后端响应数据
  afterFetch?: (data: any) => any;
  // 响应数据中的数据的属性名
  resultField?: string;
  // 是否立即调用api获取数据
  immediate?: boolean;
}

export interface ApiSelectProps extends BaseApiProps {
  // 设置 Select 的模式为多选或标签
  mode?: 'multiple' | 'tags' | undefined;
  // value
  value: Array<string> | string | undefined;
  // 搜索时过滤对应的 option 属性，不支持 children
  optionFilterProp?: string;
}

export interface ApiTreeSelectProps extends BaseApiProps {
  // 支持多选（当设置 treeCheckable 时自动变为 true）
  multiple?: boolean;
  // value
  value: Array<string> | string | undefined;
  // 输入项过滤对应的 treeNode 属性
  treeNodeFilterProp?: string;
}

export interface ApiTreeProps extends BaseApiProps {
  // value
  value: Array<number> | Array<string> | undefined;
}

export interface OptionsItem {
  [name: string]: any;
  disabled?: boolean;
  label?: string;
  value?: string;
}
