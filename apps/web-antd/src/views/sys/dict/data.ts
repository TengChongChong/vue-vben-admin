// 表格列数据
import type { VxeGridPropTypes } from '@vben/plugins/vxe-table';

import { renderDictTag } from '#/components/dict';

export const initColumns = (): VxeGridPropTypes.Columns[] => {
  return [
    { type: 'checkbox', width: 50, fixed: 'left' },
    { title: '序号', type: 'seq', width: 50, fixed: 'left' },
    {
      title: '字典编码',
      field: 'code',
      sorter: true,
      fixed: 'left',
      minWidth: 150,
    },
    {
      title: '字典名称',
      field: 'name',
      sorter: true,
      minWidth: 150,
    },
    {
      title: '排序值',
      field: 'orderNo',
      sorter: true,
      width: 80,
    },
    {
      title: '状态',
      field: 'status',
      sorter: true,
      width: 80,
      slots: {
        default: ({ row }) => {
          return renderDictTag('commonStatus', row.status);
        },
      },
    },
    {
      title: '编辑时间',
      field: 'editDate',
      sorter: true,
      width: 160,
      formatter: 'dateTime',
    },
    {
      title: '操作',
      field: 'action',
      width: 160,
      fixed: 'right',
      slots: { default: 'action' },
    },
  ];
};
