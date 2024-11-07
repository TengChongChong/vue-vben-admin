// 表格列数据
import type { VxeGridPropTypes } from '@vben/plugins/vxe-table';

export const initColumns = (): VxeGridPropTypes.Columns[] => {
  return [
    { title: '序号', type: 'seq', width: 50, fixed: 'left' },
    {
      title: 'Token',
      field: 'token',
      fixed: 'left',
      width: 320,
    },
    {
      title: '头像',
      field: 'avatar',
      width: 100,
      slots: { default: 'avatar' },
    },
    {
      title: '用户名',
      field: 'username',
      minWidth: 150,
    },
    {
      title: '昵称',
      field: 'nickname',
      minWidth: 150,
    },
    {
      title: '部门',
      field: 'deptName',
      minWidth: 150,
    },
    {
      title: '剩余有效时长',
      field: 'timeout',
      width: 150,
      formatter: 'dateDuration',
    },
    {
      title: '状态',
      field: 'sessionStatus',
      width: 100,
      cellRender: { name: 'DictTag', props: { dictType: 'sessionStatus' } },
    },
    {
      title: '登录时间',
      field: 'lastLoginDate',
      width: 160,
      formatter: 'dateTime',
    },
    {
      title: '操作',
      field: 'action',
      width: 200,
      fixed: 'right',
      slots: { default: 'action' },
    },
  ];
};
