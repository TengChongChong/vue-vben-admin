import type { CaptchaVO } from '#/api/sys/model/sys-captcha-model';

import { getRequestClient } from '../request-context';

/**
 * 绑定手机短信验证码
 *
 * @param phoneNumber 手机号
 * @param captchaVerification 验证码
 */
export function sendBindingPhoneNumberSmsApi(
  phoneNumber: string,
  captchaVerification: string,
) {
  // 注：此处仅为演示，实际场景勿返回验证码
  return getRequestClient().get<string>(
    '/auth/sys/sms/captcha/binding/phone/number',
    {
      params: { phoneNumber, captchaVerification },
    },
  );
}

/**
 * 获取验证码信息
 */
export function getCaptchaApi() {
  return getRequestClient().get<CaptchaVO>('/sys/captcha');
}

/**
 * 检查是否验证通过
 *
 * @param captcha CaptchaVO
 */
export function checkCaptchaApi(captcha: CaptchaVO) {
  return getRequestClient().post<CaptchaVO>('/sys/captcha/check', captcha, {
    errorMessageMode: 'silent',
  });
}
