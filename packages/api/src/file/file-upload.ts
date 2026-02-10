import type { UploadFileParams } from '@vben/request';

import { getRequestClient } from '../request-context';

/**
 * 文件上传
 *
 * @param uploadRuleKey 文件上传策略
 * @param params 参数
 */
export function fileUpload(uploadRuleKey: string, params: UploadFileParams) {
  return getRequestClient().upload(
    `/auth/file/upload/${uploadRuleKey}`,
    params,
  );
}
