import { requestClient } from '#/api/request';

/**
 * 验证邮箱
 *
 * @param code 验证码
 */
export function verifiesEmailApi(code: string) {
  return requestClient.post<boolean>(`/mail/verification`, {
    code,
  });
}
