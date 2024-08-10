import type { LoginAndRegisterParams } from '@vben/common-ui';

/**
 * 用户登录 - 用户名+密码参数
 */
export interface LoginAccountParams extends LoginAndRegisterParams {
  // 记住我
  rememberMe?: boolean;
  // 服务端二次验证验证码
  captchaVerification?: string;
}

/**
 * 用户登录 - 扫码参数
 */
export interface LoginQrCodeParams {
  // 设备Id
  deviceId: string;
}

/**
 * 用户登录 - 手机号+短信验证码参数
 */
export interface LoginSmsParams {
  // 手机号
  phoneNumber: string;
  // 短信验证码
  verificationCode: string;
  // 服务端二次验证验证码
  captchaVerification?: string;
}
