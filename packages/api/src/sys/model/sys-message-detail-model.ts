import type { BasicModel } from '#/api/base/model/base-model';

/**
 * 消息详情
 */
export interface SysMessageDetail extends BasicModel {
  // 消息id
  messageId: string;
  // 阅读时间
  readDate?: Date;
  // 接收人
  receiverUser: string;
  // 接收人所在部门
  receiverUserDeptName?: string;
  // 收藏
  star?: string;
}
