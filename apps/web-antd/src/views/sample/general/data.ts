// 表格列数据
import type { VxeGridPropTypes } from '@vben/plugins/vxe-table';

// 表格列数据
export const initColumns = (): VxeGridPropTypes.Columns => {
  return [
    { type: 'checkbox', width: 50, fixed: 'left' },
    { title: '序号', type: 'seq', width: 50, fixed: 'left' },
    {
      title: '姓名',
      field: 'name',
      sortable: true,
      width: 160,
    },
    {
      title: '性别',
      field: 'sex',
      sortable: true,
      width: 150,
      cellRender: {
        name: 'DictTag',
        props: { dictType: 'sex' },
      },
    },
    {
      title: '年龄',
      field: 'age',
      sortable: true,
      width: 160,
    },
    {
      title: '手机号码',
      field: 'phone',
      sortable: true,
      width: 160,
    },
    {
      title: '状态',
      field: 'status',
      sortable: true,
      width: 150,
      cellRender: {
        name: 'DictTag',
        props: { dictType: 'commonStatus' },
      },
    },
    {
      title: '排序值',
      field: 'orderNo',
      sortable: true,
      width: 160,
    },
    {
      title: '部门Id',
      field: 'deptId',
      sortable: true,
      width: 160,
    },
    {
      title: '编辑人',
      field: 'editUser',
      sortable: true,
      width: 160,
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
