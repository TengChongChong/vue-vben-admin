import type { UploadFile } from 'ant-design-vue';

import type { FileInfo } from '#/api/file/model/file-info-model';

/**
 * 根据文件上传策略上传 Props
 */
export interface RuleUploadProps {
  // 文件上传策略key
  ruleKey: string;
  value: any;
  // 上传列表的内建样式，支持三种基本样式 text, picture 和 picture-card
  listType?: string;
  helpText?: string;
  showHelpText?: boolean;
  maxNumber?: number;
  multiple?: boolean;
  // 是否使用拖拽上传
  useDragger?: boolean;
}

/**
 * 用于 Ant Design of Vue 文件上传数据回显
 */
export interface UploadFileModel extends FileInfo, UploadFile {
  // 两个对象不一致的在下方声明，避免错误提示

  // 文件访问地址
  url: string;
  // 文件大小，单位字节
  size: number;
}
