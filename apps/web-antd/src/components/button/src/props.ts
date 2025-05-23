import type { ButtonType } from 'ant-design-vue/es/button';
import type { SizeType } from 'ant-design-vue/es/config-provider';

import { VxeGridApi } from '@vben/plugins/src/vxe-table/api';

export interface BaseButtonProps {
  class?: any;
  // 权限标识
  authCodes?: string[];
  // 通过什么方式来控制组件，如果是 role，则传入角色，如果是 code，则传入权限码
  authType?: 'code' | 'role';
  // 按钮文字
  text?: string;
  // 按钮图标
  icon?: string;
  // 设置按钮类型
  type?: ButtonType;
  // 设置按钮大小
  size?: SizeType;
}

export interface ButtonRemoveProps extends BaseButtonProps {
  // 删除的id
  ids?: string[];
  // grid 表格对象
  gridApi?: VxeGridApi;
  // 删除api
  api: (id: string) => Promise<boolean>;
}

export interface ButtonAddProps extends BaseButtonProps {
  // 点击新增时新建标签页
  path?: string;
}

export interface ButtonEditProps extends BaseButtonProps {
  // 点击编辑时新建标签页
  path?: string;
}

export interface ButtonInfoProps extends BaseButtonProps {
  // 点击查看时新建标签页
  path?: string;
}

export interface ButtonImportProps extends BaseButtonProps {
  // 导入标识
  importCode: string;
}
