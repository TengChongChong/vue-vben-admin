import type { SysRedisVO } from '#/api/sys/model/sysRedisModel';

import { requestClient } from '#/api/request';

// base url
const BASE_URL = '/auth/sys/redis';

/**
 * 根据前缀查询redis列表
 *
 * @param prefix 前缀
 */
export function selectByPrefixApi(prefix: string) {
  return requestClient.get<string[]>(`${BASE_URL}/prefix/${prefix}`);
}

/**
 * 详情
 *
 * @param key key
 */
export function getApi(key: string) {
  return requestClient.get<SysRedisVO>(`${BASE_URL}/key/${key}`);
}

/**
 * 删除
 *
 * @param key key
 */
export function removeApi(key: string) {
  return requestClient.delete<boolean>(`${BASE_URL}/${key}`);
}

/**
 * 保存
 *
 * @param params 表单数据
 */
export function saveApi(params: SysRedisVO) {
  return requestClient.post<boolean>(BASE_URL, params);
}
