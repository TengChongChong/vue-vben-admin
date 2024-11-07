// 表格列数据
import type { VxeGridPropTypes } from '@vben/plugins/vxe-table';

import { h } from 'vue';

import { useAccess } from '@vben/access';

import { message, Switch } from 'ant-design-vue';

import { pauseApi, startApi } from '#/api/scheduler/scheduler-job';
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
      title: '代码',
      field: 'code',
      sortable: true,
      minWidth: 150,
    },
    {
      title: 'Cron',
      field: 'cron',
      sortable: true,
      width: 150,
    },
    {
      title: '类（Bean）',
      field: 'bean',
      sortable: true,
      minWidth: 150,
    },
    {
      title: '方法',
      field: 'method',
      sortable: true,
      minWidth: 150,
    },
    {
      title: '系统',
      field: 'sys',
      sortable: true,
      width: 100,
      visible: hasAccessByRoles([RoleEnum.SYS_ADMIN]),
      cellRender: { name: 'DictTag', props: { dictType: 'whether' } },
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
            onChange: async (checked: boolean) => {
              row.pendingStatus = true;
              await (checked ? startApi(row.id) : pauseApi(row.id));

              const newStatus = checked ? '1' : '2';
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
              row.pendingStatus = false;
            },
          });
        },
      },
    },
    {
      title: '上次执行时间',
      field: 'lastRunDate',
      sortable: true,
      width: 160,
      formatter: 'dateTime',
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
