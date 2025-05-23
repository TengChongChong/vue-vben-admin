import type { BasicModel } from '#/api/base/model/base-model';

/**
 * 数据源
 */
export interface SysDataSource extends BasicModel {
  // 名称
  name: string;
  // 描述
  description: string;
  // 类型
  type: string;
  // url
  url: string;
  // 用户名
  username: string;
  // 密码
  password: string;
}
