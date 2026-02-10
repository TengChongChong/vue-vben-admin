/**
 * 系统参数
 */
export interface SysException {
  // 错误代码
  code: string;
  id: string;
  // 错误信息
  message: string;
  // 用户昵称
  nickname: string;
  // 错误堆栈
  trace: string;
  // 触发时间
  triggerTime: Date;
  // 异常类型
  type: string;
  // 请求地址
  url: string;
  // 触发用户
  userId: string;
}
