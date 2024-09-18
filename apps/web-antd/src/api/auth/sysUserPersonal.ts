import type { SysUser } from '#/api/auth/model/sysUserModel';

import { requestClient } from '#/api/request';

// base url
const BASE_URL = '/auth/sys/user/personal/center';

/**
 * 当前用户
 */
export function currentUserApi() {
  return requestClient.get<SysUser>(`${BASE_URL}/current/user`);
}

/**
 * 密码修改
 *
 * @param currentPassword 当前密码
 * @param newPassword 新密码
 */
export function changePasswordApi(
  currentPassword: string,
  newPassword: string,
) {
  return requestClient.post<boolean>(`${BASE_URL}/change/password`, {
    currentPassword,
    newPassword,
  });
}

/**
 * 保存用户头像
 *
 * @param path 头像路径
 */
export function saveUserAvatarApi(path: string) {
  return requestClient.post<string>(`${BASE_URL}/user/avatar`, {
    path,
  });
}

/**
 * 保存用户信息
 *
 * @param params 用户信息
 */
export function saveUserInfoApi(params: SysUser) {
  return requestClient.post<SysUser>(`${BASE_URL}/user/info`, params);
}

/**
 * 申请绑定密保邮箱
 *
 * @param email 邮箱
 */
export function applicationBindingEmailApi(email: string) {
  return requestClient.post<boolean>(`${BASE_URL}/email`, {
    email,
  });
}

/**
 * 绑定密保手机
 *
 * @param phone 手机号
 * @param captcha 验证码
 */
export function bindingPhoneApi(phone: string, captcha: string) {
  return requestClient.post<boolean>(`${BASE_URL}/phone`, {
    phone,
    captcha,
  });
}
