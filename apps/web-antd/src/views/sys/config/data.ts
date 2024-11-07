// 表格列数据
import type { VxeGridPropTypes } from '@vben/plugins/vxe-table';

import { useAccess } from '@vben/access';

import { RoleEnum } from '#/enums/roleEnum';

const { hasAccessByRoles } = useAccess();

export const initColumns = (): VxeGridPropTypes.Columns[] => {
  return [
    { type: 'checkbox', width: 50, fixed: 'left' },
    { title: '序号', type: 'seq', width: 50, fixed: 'left' },
    {
      title: 'Key',
      field: 'sysKey',
      sortable: true,
      fixed: 'left',
      minWidth: 240,
    },
    {
      title: '所属分类',
      field: 'category',
      sortable: true,
      width: 120,
      cellRender: { name: 'DictTag', props: { dictType: 'configCategory' } },
    },
    {
      title: 'Value',
      field: 'value',
      sortable: true,
      minWidth: 240,
    },
    {
      title: '类型',
      field: 'type',
      sortable: true,
      width: 80,
      cellRender: { name: 'DictTag', props: { dictType: 'dataType' } },
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
      title: '备注',
      field: 'remarks',
      sortable: true,
      minWidth: 260,
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
