import type { CaptchaVO } from '#/api/sys/model/sysCaptchaModel';

import { requestClient } from '#/api/request';

/**
 * 绑定手机短信验证码
 *
 * @param phone 手机号
 */
export function bindingPhoneCaptchaApi(phone: string) {
  // 注：此处仅为演示，实际场景勿返回验证码
  return requestClient.get<string>('/auth/sys/binding/phone/captcha', {
    params: { phone },
  });
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
