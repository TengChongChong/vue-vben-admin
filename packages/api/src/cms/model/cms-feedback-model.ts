import type { BasicModel } from '#/api/base/model/base-model';

/**
 * CMS 用户反馈
 */
export interface CmsFeedback extends BasicModel {
  content: string;
  email?: string;
  nickname: string;
  phoneNumber?: string;
  siteId?: string;
}
