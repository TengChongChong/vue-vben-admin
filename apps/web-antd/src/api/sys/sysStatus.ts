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
} from '#/api/sys/model/sysStatusModel';

import { requestClient } from '#/api/request';
// base url
const BASE_URL = '/auth/sys/status';

/**
 * Java Virtual Machine Specification信息
 *
 * @return JvmSpecInfo
 */
export function getJvmSpecInfoApi() {
  return requestClient.get<JvmSpecInfo>({
    url: `${BASE_URL}/jvm/spec/info`,
  });
}

/**
 * Java Virtual Machine Implementation信息
 *
 * @return JvmInfo
 */
export function getJvmInfoApi() {
  return requestClient.get<JvmInfo>({
    url: `${BASE_URL}/jvm/info`,
  });
}

/**
 * Java Specification信息
 *
 * @return JavaSpecInfo
 */
export function getJavaSpecInfoApi() {
  return requestClient.get<JavaSpecInfo>({
    url: `${BASE_URL}/java/spec/info`,
  });
}

/**
 * Java Implementation信息
 *
 * @return JavaInfo
 */
export function getJavaInfoApi() {
  return requestClient.get<JavaInfo>({
    url: `${BASE_URL}/java/info`,
  });
}

/**
 * Java运行时信息
 *
 * @return JavaRuntimeInfo
 */
export function getJavaRuntimeInfoApi() {
  return requestClient.get<JavaRuntimeInfo>({
    url: `${BASE_URL}/java/runtime/info`,
  });
}

/**
 * 系统信息
 *
 * @return OsInfo
 */
export function getOsInfoApi() {
  return requestClient.get<OsInfo>({
    url: `${BASE_URL}/os/info`,
  });
}

/**
 * 用户信息
 *
 * @return UserInfo
 */
export function getUserInfoApi() {
  return requestClient.get<UserInfo>({
    url: `${BASE_URL}/user/info`,
  });
}

/**
 * 当前主机网络地址信息
 *
 * @return HostInfo
 */
export function getHostInfoApi() {
  return requestClient.get<HostInfo>({
    url: `${BASE_URL}/host/info`,
  });
}

/**
 * 运行时信息，包括内存总大小、已用大小、可用大小等
 *
 * @return RuntimeInfo
 */
export function getRuntimeInfoApi() {
  return requestClient.get<RuntimeInfo>({
    url: `${BASE_URL}/runtime/info`,
  });
}
