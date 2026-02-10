import { getRequestClient } from '../request-context';

/**
 * 验证邮箱
 *
 * @param code 验证码
 */
export function verifiesEmailApi(code: string) {
  return getRequestClient().post<boolean>(`/mail/verification`, {
    code,
  });
}
