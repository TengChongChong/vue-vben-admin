// 表格列数据
import type { VxeGridPropTypes } from '@vben/plugins/vxe-table';

export const initColumns = (): VxeGridPropTypes.Columns => {
  return [
    { type: 'checkbox', width: 50, fixed: 'left' },
    { title: '序号', type: 'seq', width: 50, fixed: 'left' },
    {
      title: '字典编码',
      field: 'code',
      sortable: true,
      fixed: 'left',
      minWidth: 150,
    },
    {
      title: '字典名称',
      field: 'name',
      sortable: true,
      minWidth: 150,
    },
    {
      title: '排序值',
      field: 'orderNo',
      width: 80,
    },
    {
      title: '状态',
      field: 'status',
      sortable: true,
      width: 80,
      cellRender: { name: 'DictTag', props: { dictType: 'commonStatus' } },
    },
    {
      title: '编辑时间',
      field: 'editDate',
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
