import type { Page } from '#/api/base/model/page-model';
import type {
  FileStorage,
  FileUploadRule,
} from '#/api/file/model/file-upload-rule-model';

import { getRequestClient } from '../request-context';

// base url
const BASE_URL = '/auth/file/upload/rule';
/**
 * 查询数据
 *
 * @param params 查询条件
 * @param page 分页
 */
export function selectFileUploadRuleApi(
  params: FileUploadRule,
  page: Page<FileUploadRule>,
) {
  return getRequestClient().get<Page<FileUploadRule>>(BASE_URL, {
    params: Object.assign(params, page),
  });
}

/**
 * 获取上传规则
 *
 * @param key 规则别名
 */
export function getFileUploadRuleByKeyApi(key: string) {
  return getRequestClient().get<FileUploadRule>(`${BASE_URL}/key/${key}`);
}

/**
 * 查询详情
 *
 * @param id id
 */
export function getFileUploadRuleApi(id: string) {
  return getRequestClient().get<FileUploadRule>(`${BASE_URL}/${id}`);
}

/**
 * 获取文件存储列表
 *
 * @return CopyOnWriteArrayList<FileStorage>
 */
export function getFileStorageListApi() {
  return getRequestClient().get<FileStorage>(`${BASE_URL}/file/storage`);
}

/**
 * 新增
 */
export function addFileUploadRuleApi() {
  return getRequestClient().get<FileUploadRule>(`${BASE_URL}/add`);
}

/**
 * 删除
 *
 * @param ids ids
 */
export function removeFileUploadRuleApi(ids: string) {
  return getRequestClient().delete<boolean>(`${BASE_URL}/${ids}`);
}

/**
 * 保存/修改
 *
 * @param params 表单数据
 */
export function saveFileUploadRuleApi(params: FileUploadRule) {
  return getRequestClient().post<FileUploadRule>(BASE_URL, params);
}

/**
 * 设置状态
 *
 * @param ids ids
 * @param status 状态
 */
export function setFileUploadRuleStatusApi(ids: string, status: string) {
  return getRequestClient().post<boolean>(
    `${BASE_URL}/${ids}/status/${status}`,
  );
}
