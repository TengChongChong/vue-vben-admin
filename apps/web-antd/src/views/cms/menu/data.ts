export const MENU_ITEM_TYPE_OPTIONS = [
  { label: '首页', value: 'index' },
  { label: '搜索', value: 'search' },
  { label: '栏目', value: 'column' },
  { label: '页面', value: 'page' },
  { label: '文章', value: 'article' },
  { label: '自定义链接', value: 'url' },
  { label: '分组', value: 'folder' },
];

export const MENU_ITEM_TYPE_LABEL: Record<string, string> = {
  index: '首页',
  search: '搜索',
  column: '栏目',
  page: '页面',
  article: '文章',
  url: '自定义链接',
  folder: '分组',
};

export const BUILTIN_ADD_OPTIONS = [
  { type: 'index', title: '首页', description: '站点首页链接' },
  { type: 'search', title: '搜索', description: '站内搜索页' },
  { type: 'url', title: '自定义链接', description: '填写外链或任意地址' },
  { type: 'folder', title: '分组', description: '仅作分组，无跳转' },
] as const;
