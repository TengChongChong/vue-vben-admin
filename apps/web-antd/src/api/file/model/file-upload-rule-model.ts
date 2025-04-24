import type { BasicModel } from '#/api/base/model/base-model.ts';

/**
 * 文件上传规则
 */
export interface FileUploadRule extends BasicModel {
  // 名称
  name: string;
  // 别名
  ruleKey: string;
  // 分类
  category: string;
  // 文件夹/桶，存储模式不同分为：Local 模式下为文件夹名称 / OSS 模式下为Bucket名称；必须以小写字母或者数字开头和结尾，长度为3~63个字符
  bucket: string;
  // 文件最小长度，单位 kb
  lowerLimit: number;
  // 文件最大长度，单位 kb
  upperLimit: number;
  // 文件后缀
  suffix: string;
  // 启用图片自动压缩
  enableImageCompression: string;
  // 最大宽度
  maxWidth: number;
  // 最大高度
  maxHeight: number;
}

export interface FileUploadRuleVO extends FileUploadRule {
  // 文件后缀
  suffixArray: string[];
}

export interface FileStorage {
  platform: string;
  [key: string]: any;
}
