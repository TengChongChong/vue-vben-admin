import type { VxeGridPropTypes } from '@vben/plugins/vxe-table';

export const initColumns = (): VxeGridPropTypes.Columns => {
  return [
    { type: 'checkbox', width: 50, fixed: 'left' },
    { title: '序号', type: 'seq', width: 70, fixed: 'left' },
    {
      title: '栏目名称',
      field: 'name',
      fixed: 'left',
      align: 'left',
      headerAlign: 'center',
      minWidth: 200,
      treeNode: true,
    },
    {
      title: '别名',
      field: 'slug',
      minWidth: 120,
    },
    {
      title: '可发布文章',
      field: 'isRelease',
      width: 110,
      cellRender: { name: 'DictTag', props: { dictType: 'whether' } },
    },
    {
      title: '状态',
      field: 'status',
      width: 100,
      cellRender: { name: 'DictTag', props: { dictType: 'commonStatus' } },
    },
    {
      title: '编辑人',
      field: 'editUser',
      width: 120,
    },
    {
      title: '编辑时间',
      field: 'editDate',
      width: 160,
      formatter: 'dateTime',
    },
    {
      title: '操作',
      field: 'action',
      minWidth: 280,
      fixed: 'right',
      slots: { default: 'action' },
    },
  ];
};
