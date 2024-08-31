import type { FileInfo } from '#/api/file/model/fileInfoModel';

import Cropper from 'cropperjs';

export interface CropperProps {
  // 图片 url
  value?: FileInfo;
  // 图片宽度
  width?: number;
  // 比例
  aspectRatio?: number;
  // 是否圆形
  circled?: boolean;
  // 未上传图片时的提示信息
  alt?: string;
}

/**
 * 剪裁组件参数
 */
export interface CropperImageProps {
  // // src
  src: string;
  // 图片 alt 信息
  alt?: string;
  // 是否圆形
  circled?: boolean;
  // 实时预览
  realTimePreview?: boolean;
  // 剪裁区域高度
  height?: number;
  // Cropper 参数
  options?: Cropper.Options;
}

export interface CropperModalProps {
  // 图片 alt 信息
  alt: string;
  // 比例
  aspectRatio: number;
  // 是否圆形
  circled: boolean;
  // 文件上传策略
  uploadRuleSlug: string;
}
