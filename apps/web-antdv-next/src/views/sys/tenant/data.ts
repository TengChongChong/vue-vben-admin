import type { VxeGridPropTypes } from '@vben/plugins/vxe-table';

// 表格列数据
import type { SysTenant } from '#/api';

import { h } from 'vue';

import { message, Switch } from 'antdv-next';

import { setSysTenantStatusApi } from '#/api';

export const initColumns = (
  onOpenMembers?: (row: SysTenant) => void,
): VxeGridPropTypes.Columns => {
  return [
    { type: 'checkbox', width: 50, fixed: 'left' },
    { title: '序号', type: 'seq', width: 50, fixed: 'left' },
    {
      title: '租户编码',
      field: 'tenantCode',
      sortable: true,
      fixed: 'left',
      minWidth: 140,
    },
    {
      title: '租户名称',
      field: 'name',
      sortable: true,
      minWidth: 180,
    },
    {
      title: '套餐',
      field: 'packageName',
      sortable: true,
      minWidth: 140,
      formatter: ({ cellValue }) => cellValue || '-',
    },
    {
      title: '用户数上限',
      field: 'maxUserCount',
      sortable: true,
      width: 120,
      formatter: ({ cellValue }) =>
        !cellValue || cellValue <= 0 ? '不限' : String(cellValue),
    },
    {
      title: '成员数',
      field: 'userCount',
      sortable: true,
      width: 100,
      slots: {
        default: ({ row }) => {
          const count = row.userCount ?? 0;
          if (onOpenMembers) {
            return h(
              'a',
              {
                class: 'text-primary cursor-pointer',
                onClick: () => onOpenMembers(row as SysTenant),
              },
              String(count),
            );
          }
          return count;
        },
      },
    },
    {
      title: '联系人',
      field: 'contacts',
      sortable: true,
      width: 120,
    },
    {
      title: '手机号',
      field: 'phoneNumber',
      sortable: true,
      width: 140,
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
            checkedChildren: '已启用',
            unCheckedChildren: '已禁用',
            loading: row.pendingStatus,
            onChange(checked: boolean) {
              row.pendingStatus = true;
              const newStatus = checked ? '1' : '2';
              setSysTenantStatusApi(row.id, newStatus)
                .then(() => {
                  row.status = newStatus;
                  message.success('操作成功');
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
      title: '到期时间',
      field: 'expireTime',
      sortable: true,
      width: 160,
      formatter: 'dateTime',
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
