// 表格列数据
import type { VxeGridPropTypes } from '@vben/plugins/vxe-table';

export const initColumns = (): VxeGridPropTypes.Columns => {
  return [
    { type: 'checkbox', width: 50, fixed: 'left' },
    { title: '序号', type: 'seq', width: 50, fixed: 'left' },
    {
      title: '名称',
      field: 'name',
      sortable: true,
      fixed: 'left',
      minWidth: 200,
    },
    {
      title: '流程标识',
      field: 'key',
      sortable: true,
      minWidth: 200,
    },
    {
      title: '分类',
      field: 'categoryName',
      sortable: true,
      minWidth: 200,
    },
    {
      title: '状态',
      field: 'status',
      sortable: true,
      minWidth: 160,
    },
    {
      title: '编辑时间',
      field: 'lastUpdateTime',
      sortable: true,
      width: 160,
      formatter: 'dateTime',
    },
    {
      title: '操作',
      field: 'action',
      width: 280,
      fixed: 'right',
      slots: { default: 'action' },
    },
  ];
};
