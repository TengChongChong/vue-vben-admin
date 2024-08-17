import type { Page } from '#/api/base/model/pageModel';
import type { SelectModel } from '#/api/base/model/selectModel';
import type { SysDict } from '#/api/sys/model/sysDictModel';

import { requestClient } from '#/api/request';

// base url
const BASE_URL = '/auth/sys/dict';

/**
 * 查询
 *
 * @param params 查询条件
 * @param page 分页
 */
export function select(params: SysDict, page: Page<SysDict>) {
  return requestClient.get<Page<SysDict>>(BASE_URL, {
    params: Object.assign(params, page),
  });
}

/**
 * 查询所有，请勿频繁调用，应缓存此数据
 */
export function selectAll() {
  return requestClient.get<SysDict[]>(`${BASE_URL}/all`);
}

/**
 * 根据字典类型获取字典
 *
 * @param dictType dictType
 */
export function selectByDictType(dictType: string) {
  return requestClient.get<SelectModel[]>(`${BASE_URL}/dict-type`, {
    params: { dictType },
  });
}

/**
 * 详情
 *
 * @param id id
 */
export function get(id: string) {
  return requestClient.get<SysDict>(`${BASE_URL}/${id}`);
}

/**
 * 新增
 *
 * @param id 父id
 * @param dictType 字典类型
 */
export function add(id: string | undefined, dictType: string | undefined) {
  return requestClient.get<SysDict>(`${BASE_URL}/add/${id || ''}`, {
    params: {
      dictType,
    },
  });
}

/**
 * 删除
 *
 * @param ids ids
 */
export function remove(ids: string) {
  return requestClient.delete<boolean>(`${BASE_URL}/${ids}`);
}

/**
 * 保存
 *
 * @param params 表单数据
 */
export function save(params: SysDict) {
  return requestClient.post<SysDict>(BASE_URL, params);
}

/**
 * 刷新缓存数据
 */
export function refresh() {
  return requestClient.post<boolean>(`${BASE_URL}/refresh`);
}

/**
 * 导出数据
 *
 * @param params 查询条件
 */
export function exportData(params: SysDict) {
  return requestClient.get<string>(`${BASE_URL}/export/data`, {
    params,
  });
}
