// 表格列数据
import type { VxeGridPropTypes } from '@vben/plugins/vxe-table';

export const initColumns = (): VxeGridPropTypes.Columns => {
  return [
    { type: 'checkbox', width: 50, fixed: 'left' },
    { title: '序号', type: 'seq', width: 50, fixed: 'left' },
    {
      title: '数据源名称',
      field: 'name',
      sorter: true,
      fixed: 'left',
      minWidth: 150,
    },
    {
      title: 'Url',
      field: 'url',
      sorter: true,
      minWidth: 520,
    },
    {
      title: '账号',
      field: 'username',
      sorter: true,
      minWidth: 160,
    },
    {
      title: '状态',
      field: 'status',
      sortable: true,
      width: 80,
      cellRender: { name: 'DictTag', props: { dictType: 'commonStatus' } },
    },
    {
      title: '编辑人',
      field: 'editUser',
      sortable: true,
      width: 120,
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
