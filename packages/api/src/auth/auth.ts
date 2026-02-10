import type { RouteRecordStringComponent, UserInfo } from '@vben/types';

import type {
  LoginAccountParams,
  LoginQrCodeParams,
  LoginResult,
  LoginSmsParams,
} from '#/api/auth/model/auth-model';
import type { SysQuickNavigationVO } from '#/api/sys/model/sys-quick-navigation-model';

import { getRequestClient } from '../request-context';

/**
 * 用户登录 - 用户名+密码
 *
 * @param loginParams login 参数
 * @return LoginResult
 */
export async function loginAccountApi(loginParams: LoginAccountParams) {
  return getRequestClient().post<LoginResult>('/login/account', loginParams);
}

/**
 * 用户登录 - 扫码
 *
 * @param loginParams login 参数
 * @return LoginResult
 */
export async function loginQrCodeApi(loginParams: LoginQrCodeParams) {
  return getRequestClient().post<LoginResult>('/login/qr/code', loginParams);
}

/**
 * 用户登录 - 手机号+短信验证码
 *
 * @param loginParams login 参数
 * @return LoginResult
 */
export async function loginSmsApi(loginParams: LoginSmsParams) {
  return getRequestClient().post<LoginResult>('/login/sms', loginParams);
}

/**
 * 获取当前登录用户（会话用户）
 *
 * @return SessionUser
 */
export function getCurrentUserApi() {
  return getRequestClient().get<UserInfo>('/auth/current/user');
}

/**
 * 获取当前登录用户路由
 *
 * @return RouteRecordStringComponent[]
 */
export async function getCurrentUserRouteApi() {
  return getRequestClient().get<RouteRecordStringComponent[]>(
    '/auth/current/user/route',
  );
}

/**
 * 获取当前登录用户快捷菜单
 *
 * @return SysQuickNavigationVO[]
 */
export async function getCurrentUserQuickNavigationApi() {
  return getRequestClient().get<SysQuickNavigationVO[]>(
    '/auth/current/user/quick/navigation',
  );
}

/**
 * 退出
 */
export async function logoutApi() {
  return getRequestClient().post('/logout');
}
