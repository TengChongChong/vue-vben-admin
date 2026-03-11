// 表格列数据
import type { VxeGridPropTypes } from '@vben/plugins/vxe-table';

// 表格列数据
export const initColumns = (): VxeGridPropTypes.Columns => {
  return [
    { type: 'checkbox', width: 50, fixed: 'left' },
    { title: '序号', type: 'seq', width: 50, fixed: 'left' },
    {
      title: '流程ID',
      field: 'processDefinitionId',
      minWidth: 400,
    },
    {
      title: '名称',
      field: 'name',
      minWidth: 180,
    },
    // {
    //   title: '标识',
    //   field: 'key',
    //   minWidth: 180,
    // },
    {
      title: '版本号',
      field: 'version',
      width: 100,
    },
    {
      title: '部署时间',
      field: 'deployTime',
      formatter: 'dateTime',
      width: 200,
    },
    {
      title: '状态',
      field: 'suspensionState',
      width: 100,
      cellRender: {
        name: 'DictTag',
        props: { dictType: 'suspensionState' },
      },
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
