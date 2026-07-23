import type { VxeGridPropTypes } from '@vben/plugins/vxe-table';

import { formatToDuration } from '@vben/utils';

/** 站点根节点（勾选 = 发布全部页面与栏目） */
export const SITE_ROOT_ID = '0';

/** 页面/栏目分组节点（勾选 = 发布该分组下全部资源） */
export const PAGE_FOLDER_ID = 'ignore_page_0';
export const COLUMN_FOLDER_ID = 'ignore_column_0';

/** 不参与逐条解析的虚拟节点 */
export const IGNORE_ASSET_IDS = new Set([
  COLUMN_FOLDER_ID,
  PAGE_FOLDER_ID,
  SITE_ROOT_ID,
]);

/** 允许勾选的分组节点（无 type 但可选择） */
export const SELECTABLE_FOLDER_IDS = new Set([
  COLUMN_FOLDER_ID,
  PAGE_FOLDER_ID,
  SITE_ROOT_ID,
]);

export const initColumns = (): VxeGridPropTypes.Columns => {
  return [
    { title: '序号', type: 'seq', width: 70, fixed: 'left' },
    {
      title: '状态',
      field: 'status',
      width: 110,
      cellRender: { name: 'DictTag', props: { dictType: 'cmsReleaseStatus' } },
    },
    {
      title: '进度',
      field: 'progress',
      minWidth: 280,
      slots: { default: 'progress' },
    },
    {
      title: '包含文章',
      field: 'releaseArticle',
      width: 100,
      cellRender: { name: 'DictTag', props: { dictType: 'whether' } },
    },
    {
      title: '发布人',
      field: 'createUser',
      width: 120,
    },
    {
      title: '发布时间',
      field: 'releaseDate',
      width: 160,
      formatter: 'dateTime',
    },
    {
      title: '结束时间',
      field: 'endDate',
      width: 160,
      formatter: 'dateTime',
    },
    {
      title: '发布总耗时',
      field: 'duration',
      width: 120,
      slots: {
        default: ({ row }) => {
          if (!row.releaseDate || !row.endDate) {
            return '';
          }
          const ms =
            new Date(row.endDate).getTime() -
            new Date(row.releaseDate).getTime();
          if (!Number.isFinite(ms) || ms < 0) {
            return '';
          }
          return formatToDuration(ms / 1000);
        },
      },
    },
    {
      title: '操作',
      field: 'action',
      width: 120,
      fixed: 'right',
      slots: { default: 'action' },
    },
  ];
};
