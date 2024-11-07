import type { RouteRecordStringComponent, UserInfo } from '@vben/types';

import type {
  LoginAccountParams,
  LoginQrCodeParams,
  LoginResult,
  LoginSmsParams,
} from '#/api/auth/model/auth-model.ts';

import { requestClient } from '#/api/request';

/**
 * 用户登录 - 用户名+密码
 *
 * @param loginParams login 参数
 * @return LoginResult
 */
export async function loginAccountApi(loginParams: LoginAccountParams) {
  return requestClient.post<LoginResult>('/login/account', loginParams);
}

/**
 * 用户登录 - 扫码
 *
 * @param loginParams login 参数
 * @return LoginResult
 */
export async function loginQrCodeApi(loginParams: LoginQrCodeParams) {
  return requestClient.post<LoginResult>('/login/qr/code', loginParams);
}

/**
 * 用户登录 - 手机号+短信验证码
 *
 * @param loginParams login 参数
 * @return LoginResult
 */
export async function loginSmsApi(loginParams: LoginSmsParams) {
  return requestClient.post<LoginResult>('/login/sms', loginParams);
}

/**
 * 获取当前登录用户
 *
 * @return SessionUser
 */
export async function getUserInfoApi() {
  return requestClient.get<UserInfo>('/auth/current/user');
}

/**
 * 获取当前登录用户路由
 *
 * @return RouteRecordStringComponent[]
 */
export async function getCurrentUserRouteApi() {
  return requestClient.get<RouteRecordStringComponent[]>(
    '/auth/current/user/route',
  );
}

/**
 * 退出
 */
export async function logoutApi() {
  return requestClient.post('/logout');
}
