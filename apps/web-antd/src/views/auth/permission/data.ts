// 表格列数据
import type { VxeGridPropTypes } from '@vben/plugins/vxe-table';

import { createVNode, h } from 'vue';

import { message, Switch } from 'ant-design-vue';

import { setStatusApi } from '#/api/auth/sys-permission';
import { Icon } from '#/components/icons';

export enum MenuTypeEnum {
  BUTTON = 'button',
  CATALOGUE = 'catalogue',
  MENU = 'menu',
}

export const initColumns = (): VxeGridPropTypes.Columns[] => {
  return [
    { type: 'checkbox', width: 50, fixed: 'left' },
    { title: '序号', type: 'seq', width: 90, fixed: 'left' },
    {
      title: '名称',
      field: 'title',
      fixed: 'left',
      align: 'left',
      headerAlign: 'center',
      minWidth: 240,
      treeNode: true,
    },
    {
      title: '图标',
      field: 'icon',
      width: 60,
      className: 'vxe-cell-icon-center',
      slots: {
        default: ({ row }) => {
          if (row.icon) {
            return createVNode(Icon, { icon: row.icon });
          }
          return '';
        },
      },
    },
    {
      title: '类型',
      field: 'type',
      width: 100,
      cellRender: { name: 'DictTag', props: { dictType: 'permissionType' } },
    },
    {
      title: '权限标识',
      field: 'code',
      minWidth: 240,
    },
    {
      title: 'Path',
      field: 'path',
      minWidth: 240,
    },
    {
      title: '排序值',
      field: 'orderNo',
      width: 80,
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
      title: '显示',
      field: 'showInMenu',
      width: 100,
      cellRender: { name: 'DictTag', props: { dictType: 'whether' } },
    },
    {
      title: '操作',
      field: 'action',
      width: 250,
      fixed: 'right',
      slots: { default: 'action' },
    },
  ];
};
