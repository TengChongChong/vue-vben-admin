// 表格列数据
import type { VxeGridPropTypes } from '@vben/plugins/vxe-table';

import { h } from 'vue';

import { useAccess } from '@vben/access';

import { message, Switch } from 'ant-design-vue';

import { setStatusApi } from '#/api/auth/sys-role';
import { renderDictTag } from '#/components/dict';
import { RoleEnum } from '#/enums/roleEnum';

const { hasAccessByRoles } = useAccess();

export const initColumns = (): VxeGridPropTypes.Columns[] => {
  return [
    { type: 'checkbox', width: 50, fixed: 'left' },
    { title: '序号', type: 'seq', width: 50, fixed: 'left' },
    {
      title: '名称',
      field: 'name',
      sortable: true,
      fixed: 'left',
      minWidth: 150,
    },
    {
      title: '标识',
      field: 'code',
      sortable: true,
      minWidth: 150,
    },
    {
      title: '数据权限',
      field: 'dataPermission',
      sortable: true,
      width: 140,
      slots: {
        default: ({ row }) => {
          return renderDictTag('dataPermission', row.dataPermission);
        },
      },
    },
    {
      title: '排序值',
      field: 'orderNo',
      width: 80,
    },
    {
      title: '系统',
      field: 'sys',
      sortable: true,
      width: 100,
      visible: hasAccessByRoles([RoleEnum.SYS_ADMIN]),
      slots: {
        default: ({ row }) => {
          return renderDictTag('whether', row.sys);
        },
      },
    },
    {
      title: '状态',
      field: 'status',
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
              setStatusApi(row.id, newStatus, row.type)
                .then(() => {
                  row.status = newStatus;
                  message.success(`操作成功`);
                  if (
                    row.type === 'menu' && // 同时更新子级数据
                    row.children
                  ) {
                    row.children.forEach((item) => {
                      item.status = newStatus;
                    });
                  }
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
