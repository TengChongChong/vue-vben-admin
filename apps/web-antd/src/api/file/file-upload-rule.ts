import type { Page } from '#/api/base/model/page-model';
import type { FileUploadRule } from '#/api/file/model/file-upload-rule-model';

import { requestClient } from '#/api/request';

// base url
const BASE_URL = '/auth/file/upload/rule';
/**
 * 查询数据
 *
 * @param params 查询条件
 * @param page 分页
 */
export function selectApi(params: FileUploadRule, page: Page<FileUploadRule>) {
  return requestClient.get<Page<FileUploadRule>>(BASE_URL, {
    params: Object.assign(params, page),
  });
}

/**
 * 获取上传规则
 *
 * @param key 规则别名
 */
export function getByKeyApi(key: string) {
  return requestClient.get<FileUploadRule>(`${BASE_URL}/key/${key}`);
}

/**
 * 查询详情
 *
 * @param id id
 */
export function getApi(id: string) {
  return requestClient.get<FileUploadRule>(`${BASE_URL}/${id}`);
}

/**
 * 新增
 */
export function addApi() {
  return requestClient.get<FileUploadRule>(`${BASE_URL}/add`);
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
 * 保存/修改
 *
 * @param params 表单数据
 */
export function saveApi(params: FileUploadRule) {
  return requestClient.post<FileUploadRule>(BASE_URL, params);
}

/**
 * 设置状态
 *
 * @param ids ids
 * @param status 状态
 */
export function setStatusApi(ids: string, status: string) {
  return requestClient.post<boolean>(`${BASE_URL}/${ids}/status/${status}`);
}
