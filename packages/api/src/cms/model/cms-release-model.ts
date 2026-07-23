import type { BasicModel } from '#/api/base/model/base-model';

/**
 * CMS 发布任务
 */
export interface CmsRelease extends BasicModel {
  columnIds?: string;
  done?: number;
  endDate?: string;
  /** 查询：发布时间止 */
  endReleaseDate?: Date;
  fail?: number;
  pageIds?: string;
  receipt?: string;
  releaseArticle?: string;
  releaseDate?: Date;
  siteId?: string;
  /** 查询：发布时间起 */
  startReleaseDate?: Date;
  total?: number;
}

/**
 * CMS 发布进度
 */
export interface CmsReleaseProgress {
  done: number;
  end: boolean;
  fail: number;
  timeStamp?: number;
}

/**
 * CMS 发布队列
 */
export interface CmsReleaseQueue {
  dataId?: string;
  duration?: number;
  id: string;
  parentId: string;
  receipt?: string;
  siteId?: string;
  status: string;
  title: string;
  type: string;
  weight?: number;
}
