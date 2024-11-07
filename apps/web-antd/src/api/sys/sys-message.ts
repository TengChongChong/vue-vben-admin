import type { SysMessage } from '#/api/sys/model/sys-message-model';

import { requestClient } from '#/api/request';
// base url
const BASE_URL = '/auth/sys/message';

/**
 * 查询
 *
 * @param params 查询条件
 * @param page 分页
 */
export function selectApi(params: SysMessage, page: Page<SysMessage>) {
  return requestClient.get<Page<SysMessage>>(BASE_URL, {
    params: Object.assign(params, page),
  });
}

/**
 * 收信列表
 *
 * @param params 查询条件
 * @param page 分页
 */
export function selectReceiveApi(params: SysMessage, page: Page<SysMessage>) {
  return requestClient.get<Page<SysMessage>>(`${BASE_URL}/receive`, {
    params: Object.assign(params, page),
  });
}

/**
 * 详情
 *
 * @param id id
 */
export function getApi(id: string) {
  return requestClient.get<SysMessage>(`${BASE_URL}/${id}`);
}

/**
 * 阅读消息
 *
 * @param id        消息 id
 * @param messageId 收信id
 */
export function infoApi(id: Nullable<string>, messageId: string) {
  return requestClient.get<SysMessage>(`${BASE_URL}/info`, {
    params: {
      id,
      messageId,
    },
  });
}

/**
 * 新增
 */
export function addApi() {
  return requestClient.get<SysMessage>(`${BASE_URL}/add`);
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
export function saveApi(params: SysMessage) {
  return requestClient.post<SysMessage>(BASE_URL, params);
}

/**
 * 发送
 * @param ids ids
 */
export function sendApi(ids) {
  return requestClient.post<boolean>(`${BASE_URL}/send`, {
    ids,
  });
}

/**
 * 获取当前登录用户查询未读消息数量
 *
 * @return 未读消息数量
 */
export function selectUnreadCountApi() {
  return requestClient.get<number>(`${BASE_URL}/unread/count`);
}
