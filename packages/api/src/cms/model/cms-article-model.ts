import type { BasicModel } from '#/api/base/model/base-model';
import type { FileInfo } from '#/api/file/model/file-info-model';

/**
 * CMS 文章
 */
export interface CmsArticle extends BasicModel {
  author?: string;
  columnId: string;
  columnName?: string;
  columnSlug?: string;
  content?: string;
  /** 封面 */
  cover?: FileInfo;
  coverUrl?: string;
  description?: string;
  /** 查询：下线时间止 */
  endOfflineDate?: Date;
  /** 查询：发布时间止 */
  endReleaseDate?: Date;
  excerpt?: string;
  /** 是否查询正文（前台列表用） */
  includeContent?: boolean;
  keyword?: string;
  offlineDate?: Date;
  releaseDate?: Date;
  releaseType?: string;
  siteId?: string;
  source?: string;
  /** 查询：下线时间起 */
  startOfflineDate?: Date;
  /** 查询：发布时间起 */
  startReleaseDate?: Date;
  subtitle?: string;
  tags?: string;
  title: string;
  titleColor?: string;
  titleFontFamily?: string;
  titleFontSize?: number;
  titleFontWeight?: string;
  type?: string;
  url?: string;
  viewCount?: number;
}
