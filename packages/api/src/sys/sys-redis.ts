import type { SysRedisVO } from '#/api/sys/model/sys-redis-model';

import { getRequestClient } from '../request-context';

// base url
const BASE_URL = '/auth/sys/redis';

/**
 * 根据前缀查询redis列表
 *
 * @param prefix 前缀
 */
export function selectByPrefixApi(prefix: string) {
  return getRequestClient().get<string[]>(`${BASE_URL}/prefix/${prefix}`);
}

/**
 * 详情
 *
 * @param key key
 */
export function getSysRedisApi(key: string) {
  return getRequestClient().get<SysRedisVO>(`${BASE_URL}/key/${key}`);
}

/**
 * 删除
 *
 * @param key key
 */
export function removeSysRedisApi(key: string) {
  return getRequestClient().delete<boolean>(`${BASE_URL}/${key}`);
}

/**
 * 保存
 *
 * @param params 表单数据
 */
export function saveSysRedisApi(params: SysRedisVO) {
  return getRequestClient().post<boolean>(BASE_URL, params);
}
