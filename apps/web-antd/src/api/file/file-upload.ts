import type { UploadFileParams } from '@vben/request';

import { requestClient } from '#/api/request';

/**
 * 文件上传
 *
 * @param uploadRuleKey 文件上传策略
 * @param params 参数
 */
export function fileUpload(uploadRuleKey: string, params: UploadFileParams) {
  return requestClient.upload(`/auth/file/upload/${uploadRuleKey}`, params);
}
