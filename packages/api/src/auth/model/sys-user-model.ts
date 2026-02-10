import type { BasicModel } from '#/api/base/model/base-model';
import type { FileInfo } from '#/api/file/model/file-info-model';

/**
 * 用户
 */
export interface SysUser extends BasicModel {
  // 生日
  birthday?: Date;
  // 所属部门Id
  deptId: string;
  // 邮箱
  email?: string;
  // 登录后跳转地址
  homePath?: string;
  // 最后登录时间
  lastLoginDate?: Date;
  // 昵称
  nickname: string;
  // 密码
  password: string;
  // 手机号码
  phoneNumber?: string;
  // 岗位id
  postId?: string;
  // 性别
  sex?: string;
  // 来源
  source?: string;
  // 用户名
  username: string;
}

export interface SysUserVO extends SysUser {
  // 头像
  avatar?: FileInfo;
  // 头像
  avatarUrl?: string;
  // 所属部门名称
  deptName: string;
}
