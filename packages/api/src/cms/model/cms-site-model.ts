import type { BasicModel } from '#/api/base/model/base-model';

/**
 * CMS 站点
 */
export interface CmsSite extends BasicModel {
  deploymentPath: string;
  description?: string;
  domainName: string;
  keyword?: string;
  name: string;
  theme?: string;
}

export interface CmsSiteMember {
  createDate?: string;
  deptName?: string;
  nickname: string;
  userId: string;
  username: string;
}
