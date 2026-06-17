import type { VxeGridPropTypes } from '@vben/plugins/vxe-table';

export const pickerColumns: VxeGridPropTypes.Columns = [
  { type: 'checkbox', width: 50, fixed: 'left' },
  { title: '用户名', field: 'username', minWidth: 120 },
  { title: '昵称', field: 'nickname', minWidth: 120 },
  { title: '部门', field: 'deptName', minWidth: 140 },
  { title: '手机号', field: 'phoneNumber', width: 130 },
];
