import type { BasicModel } from '#/api/base/model/base-model';

/**
 * CMS 页面
 */
export interface CmsPage extends BasicModel {
  content?: string;
  siteId?: string;
  slug: string;
  subtitle?: string;
  template: string;
  title: string;
}
