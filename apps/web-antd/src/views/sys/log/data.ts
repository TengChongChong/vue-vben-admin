// 表格列数据
import type { VxeGridPropTypes } from '@vben/plugins/vxe-table';

export const initColumns = (): VxeGridPropTypes.Columns[] => {
  return [
    { title: '序号', type: 'seq', width: 50, fixed: 'left' },
    {
      title: '模块',
      field: 'modular',
      sortable: true,
      fixed: 'left',
      width: 120,
    },
    {
      title: '方法',
      field: 'method',
      sortable: true,
      minWidth: 120,
    },
    {
      title: 'ip',
      field: 'ip',
      sortable: true,
      width: 120,
    },
    {
      title: 'Http Method',
      field: 'httpMethod',
      sortable: true,
      width: 160,
      cellRender: { name: 'DictTag', props: { dictType: 'httpMethod' } },
    },
    {
      title: 'Uri',
      field: 'uri',
      sortable: true,
      minWidth: 280,
    },
    {
      title: '操作人',
      field: 'operationUser',
      sortable: true,
      width: 120,
    },
    {
      title: '操作时间',
      field: 'operationDate',
      sortable: true,
      width: 160,
      formatter: 'dateTime',
    },
    {
      title: '操作',
      field: 'action',
      width: 120,
      fixed: 'right',
      slots: { default: 'action' },
    },
  ];
};
