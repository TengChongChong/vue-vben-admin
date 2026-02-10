import type {
  HostInfo,
  JavaInfo,
  JavaRuntimeInfo,
  JavaSpecInfo,
  JvmInfo,
  JvmSpecInfo,
  OsInfo,
  RuntimeInfo,
  UserInfo,
} from '#/api/sys/model/sys-status-model';

import { getRequestClient } from '../request-context';
// base url
const BASE_URL = '/auth/sys/status';

/**
 * Java Virtual Machine Specification信息
 *
 * @return JvmSpecInfo
 */
export function getJvmSpecInfoApi() {
  return getRequestClient().get<JvmSpecInfo>(`${BASE_URL}/jvm/spec/info`);
}

/**
 * Java Virtual Machine Implementation信息
 *
 * @return JvmInfo
 */
export function getJvmInfoApi() {
  return getRequestClient().get<JvmInfo>(`${BASE_URL}/jvm/info`);
}

/**
 * Java Specification信息
 *
 * @return JavaSpecInfo
 */
export function getJavaSpecInfoApi() {
  return getRequestClient().get<JavaSpecInfo>(`${BASE_URL}/java/spec/info`);
}

/**
 * Java Implementation信息
 *
 * @return JavaInfo
 */
export function getJavaInfoApi() {
  return getRequestClient().get<JavaInfo>(`${BASE_URL}/java/info`);
}

/**
 * Java运行时信息
 *
 * @return JavaRuntimeInfo
 */
export function getJavaRuntimeInfoApi() {
  return getRequestClient().get<JavaRuntimeInfo>(
    `${BASE_URL}/java/runtime/info`,
  );
}

/**
 * 系统信息
 *
 * @return OsInfo
 */
export function getOsInfoApi() {
  return getRequestClient().get<OsInfo>(`${BASE_URL}/os/info`);
}

/**
 * 用户信息（系统状态接口）
 *
 * @return UserInfo
 */
export function getSysStatusUserInfoApi() {
  return getRequestClient().get<UserInfo>(`${BASE_URL}/user/info`);
}

/**
 * 当前主机网络地址信息
 *
 * @return HostInfo
 */
export function getHostInfoApi() {
  return getRequestClient().get<HostInfo>(`${BASE_URL}/host/info`);
}

/**
 * 运行时信息，包括内存总大小、已用大小、可用大小等
 *
 * @return RuntimeInfo
 */
export function getRuntimeInfoApi() {
  return getRequestClient().get<RuntimeInfo>(`${BASE_URL}/runtime/info`);
}
