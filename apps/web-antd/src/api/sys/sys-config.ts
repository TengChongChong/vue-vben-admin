import type { Page } from '#/api/base/model/page-model';
import type { SysConfig } from '#/api/sys/model/sys-config-model';

import { requestClient } from '#/api/request';
// base url
const BASE_URL = '/auth/sys/config';

/**
 * 查询
 *
 * @param params 查询条件
 * @param page 分页
 */
export function selectApi(params: SysConfig, page: Page<SysConfig>) {
  return requestClient.get<Page<SysConfig>>(BASE_URL, {
    params: Object.assign(params, page),
  });
}

/**
 * 详情
 *
 * @param id id
 */
export function getApi(id: string) {
  return requestClient.get<SysConfig>(`${BASE_URL}/${id}`);
}

/**
 * 根据key获取配置
 *
 * @param key key
 */
export function getByKeyApi(key: string) {
  return requestClient.get<SysConfig>(`/sys/config/key/${key}`);
}

/**
 * 删除
 *
 * @param ids ids
 */
export function removeApi(ids: string) {
  return requestClient.delete<boolean>(`${BASE_URL}/${ids}`);
}

/**
 * 保存
 *
 * @param params 表单数据
 */
export function saveApi(params: SysConfig) {
  return requestClient.post<SysConfig>(BASE_URL, params);
}

/**
 * 刷新缓存数据
 */
export function refreshApi() {
  return requestClient.post<boolean>(`${BASE_URL}/refresh`);
}
