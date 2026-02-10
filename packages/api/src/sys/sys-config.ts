import type { Page } from '#/api/base/model/page-model';
import type { SysConfig } from '#/api/sys/model/sys-config-model';

import { getRequestClient } from '../request-context';
// base url
const BASE_URL = '/auth/sys/config';

/**
 * 查询
 *
 * @param params 查询条件
 * @param page 分页
 */
export function selectSysConfigApi(params: SysConfig, page: Page<SysConfig>) {
  return getRequestClient().get<Page<SysConfig>>(BASE_URL, {
    params: Object.assign(params, page),
  });
}

/**
 * 详情
 *
 * @param id id
 */
export function getSysConfigApi(id: string) {
  return getRequestClient().get<SysConfig>(`${BASE_URL}/${id}`);
}

/**
 * 根据key获取配置
 *
 * @param key key
 */
export function getSysConfigByKeyApi(key: string) {
  return getRequestClient().get<SysConfig>(`/sys/config/key/${key}`);
}

/**
 * 删除
 *
 * @param ids ids
 */
export function removeSysConfigApi(ids: string) {
  return getRequestClient().delete<boolean>(`${BASE_URL}/${ids}`);
}

/**
 * 保存
 *
 * @param params 表单数据
 */
export function saveSysConfigApi(params: SysConfig) {
  return getRequestClient().post<SysConfig>(BASE_URL, params);
}

/**
 * 刷新缓存数据
 */
export function refreshSysConfigCacheApi() {
  return getRequestClient().post<boolean>(`${BASE_URL}/refresh`);
}
