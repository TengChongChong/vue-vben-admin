// 表格列数据
import type { VxeGridPropTypes } from '@vben/plugins/vxe-table';

export const initColumns = (): VxeGridPropTypes.Columns => {
  return [
    { type: 'checkbox', width: 50, fixed: 'left' },
    { title: '序号', type: 'seq', width: 50, fixed: 'left' },

    {
      title: '模板名称',
      field: 'name',
      sortable: true,
      minWidth: 200,
    },
    {
      title: '表',
      field: 'importTable',
      sortable: true,
      minWidth: 200,
    },
    {
      title: '起始行',
      field: 'startRow',
      sortable: true,
      width: 100,
    },
    {
      title: '模板代码',
      field: 'importCode',
      sortable: true,
      minWidth: 200,
    },
    {
      title: '权限代码',
      field: 'permissionCode',
      sortable: true,
      minWidth: 200,
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
      width: 300,
      fixed: 'right',
      slots: { default: 'action' },
    },
  ];
};
