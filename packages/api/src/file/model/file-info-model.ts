import type { BasicModel } from '#/api/base/model/base-model';

/**
 * 文件
 */
export interface FileInfo extends BasicModel {
  // 附加属性
  attr: string;
  // 基础存储路径
  basePath?: string;
  // MIME类型
  contentType: string;
  // 删除时间
  deleteDate?: Date;
  // 文件扩展名
  ext: string;
  // 文件ACL
  fileAcl?: string;
  // 文件名称
  filename: string;
  // 哈希信息
  hashInfo: string;
  // 文件id
  id: string;
  // 文件元数据
  metadata: string;
  // 文件所属对象id
  objectId: string;
  // 文件所属对象类型，例如用户头像 user-avatar，评价图片 - comment-image
  objectType: string;
  // 原始文件名
  originalFilename: string;
  // 存储路径
  path: string;
  // 存储平台
  platform: string;
  // 文件大小，单位字节
  size: number;
  // 缩略图MIME类型
  thContentType?: string;
  // 缩略图文件ACL
  thFileAcl?: string;
  // 缩略图名称
  thFilename?: string;
  // 缩略图元数据
  thMetadata: string;
  // 缩略图大小，单位字节
  thSize?: number;
  // 缩略图访问路径
  thUrl?: string;
  // 缩略图用户元数据
  thUserMetadata: string;
  // 上传ID，仅在手动分片上传时使用
  uploadId?: string;
  // 上传状态，仅在手动分片上传时使用，1：初始化完成，2：上传完成
  uploadStatus?: number;
  // 文件访问地址
  url: string;
  // 文件用户元数据
  userMetadata: string;
}
