import type { BasicModel } from '#/api/base/model/base-model';

/**
 * CMS 栏目
 */
export interface CmsColumn extends BasicModel {
  coverProportionHeight?: number;
  coverProportionWidth?: number;
  description?: string;
  isRelease?: string;
  name: string;
  siteId?: string;
  slug: string;
  type?: string;
}

export interface CmsColumnMember {
  createDate?: string;
  deptName?: string;
  nickname: string;
  userId: string;
  username: string;
}
