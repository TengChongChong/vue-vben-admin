import type { Page } from '#/api/base/model/page-model';
import type { SysMessageDetail } from '#/api/sys/model/sys-message-detail-model';

import { requestClient } from '#/api/request';
// base url
const BASE_URL = '/auth/sys/message/detail';

/**
 * 查看消息读取情况
 *
 * @param params 查询条件
 * @param page 分页
 * @return List<SysMessageDetail>
 */
export function selectMessageReceiverUserDetailApi(
  params: SysMessageDetail,
  page: Page<SysMessageDetail>,
) {
  return requestClient.get<SysMessageDetail>(
    `${BASE_URL}/message/receiver/user/detail`,
    {
      params: Object.assign(params, page),
    },
  );
}

/**
 * 设置消息标星/取消标星
 *
 * @param id   接受消息id
 * @param type 是否标星
 */
export function setStarApi(id: string, type: boolean) {
  return requestClient.post<boolean>(`${BASE_URL}/star/${id}/${type}`);
}

/**
 * 根据接收消息id删除
 *
 * @param ids 消息ids
 */
export function removeByIdsApi(ids: string) {
  return requestClient.delete<boolean>(`${BASE_URL}/${ids}`);
}

/**
 * 设置消息已读
 *
 * @param ids 消息ids
 */
export function setReadApi(ids?: string) {
  return requestClient.post<boolean>(`${BASE_URL}/read/${ids || ''}`);
}
