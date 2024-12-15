import type { CaptchaVO } from '#/api/sys/model/sys-captcha-model';

import { requestClient } from '#/api/request';

/**
 * 绑定手机短信验证码
 *
 * @param phoneNumber 手机号
 */
export function sendBindingPhoneNumberSmsApi(phoneNumber: string) {
  // 注：此处仅为演示，实际场景勿返回验证码
  return requestClient.get<string>(
    '/auth/sys/sms/captcha/binding/phone/number',
    {
      params: { phoneNumber },
    },
  );
}

/**
 * 获取验证码信息
 */
export function getCaptchaApi() {
  return requestClient.get<CaptchaVO>('/sys/captcha');
}

/**
 * 检查是否验证通过
 *
 * @param captcha CaptchaVO
 */
export function checkCaptchaApi(captcha: CaptchaVO) {
  return requestClient.post<CaptchaVO>('/sys/captcha/check', captcha, {
    errorMessageMode: 'silent',
  });
}
