// 表格列数据
import type { VxeGridPropTypes } from '@vben/plugins/vxe-table';

export const initColumns = (): VxeGridPropTypes.Columns[] => {
  return [
    { type: 'checkbox', width: 50, fixed: 'left' },
    { title: '序号', type: 'seq', width: 50, fixed: 'left' },
    {
      title: 'Http Status',
      field: 'code',
      sortable: true,
      fixed: 'left',
      width: 120,
    },
    {
      title: '异常类型',
      field: 'type',
      sortable: true,
      fixed: 'left',
      width: 360,
    },
    {
      title: '错误信息',
      field: 'message',
      sortable: true,
      width: 520,
    },
    {
      title: 'Url',
      field: 'url',
      sortable: true,
      width: 320,
    },
    {
      title: '触发用户',
      field: 'nickname',
      sortable: true,
      width: 120,
    },
    {
      title: '触发时间',
      field: 'triggerTime',
      sortable: true,
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
