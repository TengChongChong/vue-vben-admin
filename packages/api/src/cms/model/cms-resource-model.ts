/**
 * CMS 资源（file_detail）
 */
export interface CmsResource {
  contentType?: string;
  createDate?: Date;
  editDate?: Date;
  /** 查询：上传时间止 */
  endCreateDate?: string;
  ext?: string;
  filename?: string;
  id?: string;
  /** 查询：关键词 */
  keyword?: string;
  objectId?: string;
  objectType?: string;
  originalFilename?: string;
  size?: number;
  /** 查询：cover / content */
  source?: string;
  /** 查询：上传时间起 */
  startCreateDate?: string;
  thUrl?: string;
  /** 查询：image/video/audio/doc/attachment */
  type?: string;
  url?: string;
}
