// 表格列数据
import type { VxeGridPropTypes } from '@vben/plugins/vxe-table';

export const initColumns = (): VxeGridPropTypes.Columns => {
  return [
    { type: 'radio', title: '#', width: 50, fixed: 'left' },
    {
      title: '类型',
      field: 'type',
      sortable: true,
    },
    {
      title: '名称',
      field: 'name',
      sortable: true,
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
