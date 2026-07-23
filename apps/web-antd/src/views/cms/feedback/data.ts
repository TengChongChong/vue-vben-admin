import type { VxeGridPropTypes } from '@vben/plugins/vxe-table';

export const initColumns = (): VxeGridPropTypes.Columns => {
  return [
    { type: 'checkbox', width: 50, fixed: 'left' },
    { title: '序号', type: 'seq', width: 70, fixed: 'left' },
    {
      title: '昵称',
      field: 'nickname',
      fixed: 'left',
      align: 'left',
      headerAlign: 'center',
      minWidth: 120,
    },
    {
      title: '邮箱',
      field: 'email',
      minWidth: 160,
    },
    {
      title: '手机号',
      field: 'phoneNumber',
      width: 130,
    },
    {
      title: '内容',
      field: 'content',
      align: 'left',
      headerAlign: 'center',
      minWidth: 240,
      showOverflow: true,
    },
    {
      title: '状态',
      field: 'status',
      width: 100,
      cellRender: { name: 'DictTag', props: { dictType: 'commonStatus' } },
    },
    {
      title: '提交时间',
      field: 'createDate',
      width: 160,
      formatter: 'dateTime',
    },
    {
      title: '操作',
      field: 'action',
      minWidth: 160,
      fixed: 'right',
      slots: { default: 'action' },
    },
  ];
};
