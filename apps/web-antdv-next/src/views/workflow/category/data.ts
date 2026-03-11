// 表格列数据
import type { VxeGridPropTypes } from '@vben/plugins/vxe-table';

// 表格列数据
export const initColumns = (): VxeGridPropTypes.Columns => {
  return [
    { type: 'checkbox', width: 50, fixed: 'left' },
    { title: '序号', type: 'seq', width: 50, fixed: 'left' },
    {
      title: '分类名称',
      field: 'name',
      fixed: 'left',
      align: 'left',
      headerAlign: 'center',
      treeNode: true,
      minWidth: 160,
    },
    {
      title: '分类编码',
      field: 'code',
      minWidth: 160,
    },
    {
      title: '排序值',
      field: 'orderNo',
      minWidth: 160,
    },
    {
      title: '状态',
      field: 'status',
      minWidth: 150,
      cellRender: {
        name: 'DictTag',
        props: { dictType: 'commonStatus' },
      },
    },
    {
      title: '更新人',
      field: 'editUser',
      minWidth: 160,
    },
    {
      title: '更新时间',
      field: 'editDate',
      minWidth: 160,
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
