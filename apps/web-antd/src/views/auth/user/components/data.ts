// 表格列数据
import type { VxeGridPropTypes } from '@vben/plugins/vxe-table';

import { h } from 'vue';

import { message, Switch } from 'ant-design-vue';

import { setSysUserStatusApi } from '#/api';

export const initColumns = (): VxeGridPropTypes.Columns => {
  return [
    { type: 'checkbox', width: 50, fixed: 'left' },
    { title: '序号', type: 'seq', width: 50, fixed: 'left' },
    {
      title: '用户名',
      field: 'username',
      sortable: true,
      fixed: 'left',
      minWidth: 140,
    },
    {
      title: '头像',
      field: 'avatar',
      width: 100,
      slots: { default: 'avatar' },
    },
    {
      title: '昵称',
      field: 'nickname',
      sortable: true,
      minWidth: 140,
    },
    {
      title: '手机号',
      field: 'phoneNumber',
      sortable: true,
      width: 140,
    },
    {
      title: '性别',
      field: 'sex',
      sortable: true,
      width: 80,
      cellRender: { name: 'DictTag', props: { dictType: 'sex' } },
    },
    {
      title: '状态',
      field: 'status',
      sortable: true,
      width: 100,
      slots: {
        default: ({ row }) => {
          if (!Reflect.has(row, 'pendingStatus')) {
            row.pendingStatus = false;
          }
          return h(Switch, {
            checked: row.status === '1',
            checkedChildren: '启用',
            unCheckedChildren: '禁用',
            loading: row.pendingStatus,
            onChange(checked: boolean) {
              row.pendingStatus = true;
              const newStatus = checked ? '1' : '2';
              setSysUserStatusApi(row.id, newStatus)
                .then(() => {
                  row.status = newStatus;
                  message.success(`操作成功`);
                })
                .finally(() => {
                  row.pendingStatus = false;
                });
            },
          });
        },
      },
    },
    {
      title: '最后登录',
      field: 'lastLoginDate',
      sortable: true,
      width: 160,
      formatter: 'dateTime',
    },
    {
      title: '操作',
      field: 'action',
      width: 260,
      fixed: 'right',
      slots: { default: 'action' },
    },
  ];
};
