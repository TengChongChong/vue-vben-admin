import type { BasicModel } from '#/api/base/model/base-model';
import type { FileInfo } from '#/api/file/model/file-info-model';

/**
 * CMS 资源
 */
export interface CmsMedia extends BasicModel {
  file?: FileInfo;
  name: string;
  siteId?: string;
  type: string;
}
