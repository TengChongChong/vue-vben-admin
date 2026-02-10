/**
 * 系统日志
 */
export interface SysLog {
  // 类
  clazz: string;
  id: string;
  // ip
  ip: string;
  // 方法
  method: string;
  // 方法
  methodName: string;
  // 模块
  modular: string;
  // 操作时间
  operationDate: Date;
  // 操作人
  operationUser: string;
  // 参数
  params: string;
  // 租户id
  tenantId: string;
  // 耗时
  timeConsuming: string;
  // 请求地址
  uri: string;
  // 请求地址
  url: string;
}
