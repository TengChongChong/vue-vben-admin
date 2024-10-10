// 表格列数据
import type { VxeGridPropTypes } from '@vben/plugins/vxe-table';

import { renderDictTag } from '#/components/dict';

export const columns: VxeGridPropTypes.Columns[] = [
  { type: 'checkbox', width: 50, fixed: 'left' },
  { title: '序号', type: 'seq', width: 50, fixed: 'left' },
  {
    title: 'Key',
    field: 'sysKey',
    sortable: true,
    fixed: 'left',
    width: 240,
  },
  {
    title: '所属分类',
    field: 'category',
    sortable: true,
    width: 120,
    slots: {
      default: ({ row }) => {
        return renderDictTag('configCategory', row.category);
      },
    },
  },
  {
    title: 'Value',
    field: 'value',
    sortable: true,
    width: 240,
  },
  {
    title: '类型',
    field: 'type',
    sortable: true,
    width: 80,
    slots: {
      default: ({ row }) => {
        return renderDictTag('dataType', row.type);
      },
    },
  },
  {
    title: '系统',
    field: 'sys',
    sortable: true,
    width: 100,
    // auth: RoleEnum.SYS_ADMIN,
    slots: {
      default: ({ row }) => {
        return renderDictTag('whether', row.sys);
      },
    },
  },
  {
    title: '备注',
    field: 'remarks',
    sortable: true,
    // width: 260,
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
