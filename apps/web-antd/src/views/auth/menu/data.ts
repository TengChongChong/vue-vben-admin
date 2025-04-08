// 表格列数据
import type { VxeGridPropTypes } from '@vben/plugins/vxe-table';

import { h } from 'vue';

import { message, Switch } from 'ant-design-vue';

import { setStatusApi } from '#/api/auth/sys-menu';

// 表格列数据
export const initColumns = (): VxeGridPropTypes.Columns[] => {
  return [
    { type: 'checkbox', width: 50, fixed: 'left' },
    { title: '序号', type: 'seq', width: 100, fixed: 'left' },
    {
      title: '标题',
      field: 'title',
      fixed: 'left',
      align: 'left',
      headerAlign: 'center',
      minWidth: 240,
      treeNode: true,
      slots: { default: 'title' },
    },
    {
      title: '类型',
      field: 'type',
      width: 100,
      cellRender: {
        name: 'DictTag',
        props: { dictType: 'menuType' },
      },
    },
    {
      title: '路由地址',
      field: 'path',
      width: 200,
    },
    {
      title: '页面组件',
      field: 'component',
      width: 200,
    },
    {
      title: '权限标识',
      field: 'authCode',
      width: 200,
    },
    // {
    //   title: '缓存标签页',
    //   field: 'keepAlive',
    //   width: 100,
    //   cellRender: { name: 'DictTag', props: { dictType: 'whether' } },
    // },
    // {
    //   title: '固定在标签栏',
    //   field: 'affixTab',
    //   width: 120,
    //   cellRender: { name: 'DictTag', props: { dictType: 'whether' } },
    // },
    // {
    //   title: '隐藏菜单',
    //   field: 'hideInMenu',
    //   width: 100,
    //   cellRender: { name: 'DictTag', props: { dictType: 'whether' } },
    // },
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
      width: 250,
      fixed: 'right',
      slots: { default: 'action' },
    },
  ];
};
