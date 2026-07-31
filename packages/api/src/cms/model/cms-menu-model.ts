import type { BasicModel } from '#/api/base/model/base-model';

export interface CmsMenu extends BasicModel {
  name: string;
  siteId?: string;
  slug: string;
}

export interface CmsMenuItem extends BasicModel {
  icon?: string;
  menuId: string;
  refId?: string;
  target?: string;
  title: string;
  /** index / search / column / page / article / url / folder */
  type: string;
  url?: string;
}
