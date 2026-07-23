import type { VxeGridPropTypes } from '@vben/plugins/vxe-table';

function formatMaxUserCount(value?: number) {
  if (!value || value <= 0) {
    return '不限';
  }
  return String(value);
}

export const initColumns = (): VxeGridPropTypes.Columns => {
  return [
    { type: 'checkbox', width: 50, fixed: 'left' },
    { title: '序号', type: 'seq', width: 50, fixed: 'left' },
    {
      title: '套餐编码',
      field: 'code',
      sortable: true,
      fixed: 'left',
      minWidth: 140,
    },
    {
      title: '套餐名称',
      field: 'name',
      sortable: true,
      minWidth: 180,
    },
    {
      title: '默认用户数上限',
      field: 'maxUserCount',
      sortable: true,
      width: 140,
      formatter: ({ cellValue }) => formatMaxUserCount(cellValue),
    },
    {
      title: '关联租户数',
      field: 'tenantCount',
      sortable: true,
      width: 120,
    },
    {
      title: '状态',
      field: 'status',
      sortable: true,
      width: 100,
      cellRender: {
        name: 'CellDict',
        props: { dictType: 'commonStatus' },
      },
    },
    {
      title: '备注',
      field: 'remarks',
      sortable: true,
      minWidth: 200,
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
      width: 220,
      fixed: 'right',
      slots: { default: 'action' },
    },
  ];
};
