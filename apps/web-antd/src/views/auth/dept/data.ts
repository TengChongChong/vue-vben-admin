// 表格列数据
import type { VxeGridPropTypes } from '@vben/plugins/vxe-table';

import { h } from 'vue';

import { message, Switch } from 'ant-design-vue';

import { setSysDeptStatusApi } from '#/api';

export const initColumns = (): VxeGridPropTypes.Columns => {
  return [
    { type: 'checkbox', width: 50, fixed: 'left' },
    { title: '序号', type: 'seq', width: 90, fixed: 'left' },
    {
      title: '部门名称',
      field: 'name',
      fixed: 'left',
      align: 'left',
      headerAlign: 'center',
      minWidth: 240,
      treeNode: true,
    },
    {
      title: '部门简称',
      field: 'simpleName',
      minWidth: 100,
    },
    {
      title: '部门编码',
      field: 'code',
      minWidth: 100,
    },
    {
      title: '部门类型',
      field: 'typeName',
      minWidth: 100,
    },
    {
      title: '排序值',
      field: 'orderNo',
      width: 80,
    },
    {
      title: '状态',
      field: 'status',
      minWidth: 100,
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
              setSysDeptStatusApi(row.id, newStatus, row.type)
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
      minWidth: 250,
      fixed: 'right',
      slots: { default: 'action' },
    },
  ];
};
