import type { Page } from '#/api/base/model/page-model';
import type { SysMessage } from '#/api/sys/model/sys-message-model';

import { getRequestClient } from '../request-context';
// base url
const BASE_URL = '/auth/sys/message';

/**
 * 查询
 *
 * @param params 查询条件
 * @param page 分页
 */
export function selectSysMessageApi(
  params: SysMessage,
  page: Page<SysMessage>,
) {
  return getRequestClient().get<Page<SysMessage>>(BASE_URL, {
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
  return getRequestClient().get<Page<SysMessage>>(`${BASE_URL}/receive`, {
    params: Object.assign(params, page),
  });
}

/**
 * 详情
 *
 * @param id id
 */
export function getSysMessageApi(id: string) {
  return getRequestClient().get<SysMessage>(`${BASE_URL}/${id}`);
}

/**
 * 阅读消息
 *
 * @param id        消息 id
 * @param messageId 收信id
 */
export function infoApi(id: Nullable<string>, messageId: string) {
  return getRequestClient().get<SysMessage>(`${BASE_URL}/info`, {
    params: {
      id,
      messageId,
    },
  });
}

/**
 * 新增
 */
export function addSysMessageApi() {
  return getRequestClient().get<SysMessage>(`${BASE_URL}/add`);
}

/**
 * 删除
 *
 * @param ids ids
 */
export function removeSysMessageApi(ids: string) {
  return getRequestClient().delete<boolean>(`${BASE_URL}/${ids}`);
}

/**
 * 保存
 *
 * @param params 表单数据
 */
export function saveSysMessageApi(params: SysMessage) {
  return getRequestClient().post<SysMessage>(BASE_URL, params);
}

/**
 * 发送
 * @param ids ids
 */
export function sendApi(ids) {
  return getRequestClient().post<boolean>(`${BASE_URL}/send`, {
    ids,
  });
}

/**
 * 获取当前登录用户查询未读消息数量
 *
 * @return 未读消息数量
 */
export function selectUnreadCountApi() {
  return getRequestClient().get<number>(`${BASE_URL}/unread/count`);
}
