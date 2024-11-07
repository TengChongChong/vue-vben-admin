import type { BasicModel } from '#/api/base/model/base-model.ts';
import type { FileInfo } from '#/api/file/model/file-info-model.ts';

/**
 * 用户
 */
export interface SysUser extends BasicModel {
  // 用户名
  username: string;
  // 昵称
  nickname: string;
  // 密码
  password: string;
  // 性别
  sex?: string;
  // 邮箱
  email?: string;
  // 手机号码
  phoneNumber?: string;
  // 登录后跳转地址
  homePath?: string;
  // 生日
  birthday?: Date;
  // 来源
  source?: string;
  // 岗位id
  postId?: string;
  // 最后登录时间
  lastLoginDate?: Date;
  // 所属部门Id
  deptId: string;
}

export interface SysUserVO extends SysUser {
  // 所属部门名称
  deptName: string;
  // 头像
  avatar?: FileInfo;
  // 头像
  avatarUrl?: string;
}
