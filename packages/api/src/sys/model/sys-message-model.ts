import type { BasicModel } from '#/api/base/model/base-model';

/**
 * 消息
 */
export interface SysMessage extends BasicModel {
  // 发送人头像
  avatar?: string;
  // 内容
  content?: string;
  // 收信状态
  detailsStatus?: string;
  // 图标(保留字段)
  icon?: string;
  // 重要
  important?: string;
  // 收信->id
  messageId?: string;
  // 发送人昵称
  nickname?: string;
  // 收信->阅读时间
  readDate?: Date;
  // 收信人
  receivers?: string[];
  // 发送时间
  sendDate?: Date;
  // 收藏
  star?: string;
  // 副标题(保留字段)
  subtitle?: string;
  // 标题
  title?: string;
  // 类型
  type?: string;
}
