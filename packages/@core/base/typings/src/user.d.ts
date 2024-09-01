/**
 * 用户所属部门
 */
export interface SessionDept {
  // id
  id: string;
  // 父id
  parentId: string;
  // 全称
  name: string;
  // 简称
  simpleName: string;
  // 部门代码
  code: string;
  // 部门类型编码
  typeCode: string;
  // 状态
  status: string;
}

/**
 * 用户角色
 */
export interface SessionUserRole {
  // id
  id: string;
  // 角色名称
  name: string;
  // 角色标识
  code: string;
}

/**
 * 用户
 */
export interface SessionUser {
  // id
  id: string;
  // 岗位id
  postId?: string;
  // 部门id
  deptId: string;
  // 用户名
  username: string;
  // 昵称
  nickname: string;
  // 性别
  sex: string;
  // 邮箱
  email: string;
  // 邮箱是否验证
  mailIsVerifies: boolean;
  // 手机号码
  phoneNumber: string;
  // 登录后跳转地址
  homePath: string;
  // 生日
  birthday: Date;
  // 年龄
  age: number;
  // 来源
  source: string;
  // 状态
  status: string;
  // 最后登录时间
  lastLoginDate: Date;
  // 头像 url
  avatar: string;
  // 所属部门
  dept: SessionDept;
  // 角色集合
  roleList: SessionUserRole[];
  // 角色标识集合
  roleCodeList: string[];
  // 权限标识集合
  permissionCodeList: string[];
}
