import { requestClient } from '#/api/request';

// base url
const BASE_URL = '/sys/user/retrieve/password';

/**
 * 发送重置密码邮件
 *
 * @param captchaVerification 验证码
 * @param username 账号
 * @param email 邮箱
 */
export function sendEmailApi(
  captchaVerification: string,
  username: string,
  email: string,
) {
  return requestClient.post<boolean>(`${BASE_URL}/email`, {
    captchaVerification,
    username,
    email,
  });
}

/**
 * 发送重置密码短信
 *
 * @param captchaVerification 验证码
 * @param username 账号
 * @param mobile 手机号码
 */
export function sendSmsApi(
  captchaVerification: string,
  username: string,
  mobile: string,
) {
  return requestClient.post<string>(`${BASE_URL}/sms`, {
    captchaVerification,
    username,
    mobile,
  });
}

/**
 * 验证账号与验证码是否匹配
 *
 * @param username 账号
 * @param code     验证码
 */
export function verifiesCodeApi(username: string, code: string) {
  return requestClient.get<boolean>(`${BASE_URL}/verifies/${username}/${code}`);
}

/**
 * 重设密码
 *
 * @param username 账号
 * @param code 验证码
 * @param password
 */
export function resetPasswordApi(
  username: string,
  code: string,
  password: string,
) {
  return requestClient.post<boolean>(
    `${BASE_URL}/reset/password/${username}/${code}`,
    {
      password,
    },
  );
}
