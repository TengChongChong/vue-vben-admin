/**
 * 用户所属部门
 */
export interface SessionDept {
  // 部门代码
  code: string;
  // id
  id: string;
  // 全称
  name: string;
  // 父id
  parentId: string;
  // 简称
  simpleName: string;
  // 状态
  status: string;
  // 部门类型编码
  typeCode: string;
}

/**
 * 用户角色
 */
export interface SessionUserRole {
  // 角色标识
  code: string;
  // id
  id: string;
  // 角色名称
  name: string;
}

/**
 * 用户
 */
export interface SessionUser {
  // 年龄
  age: number;
  // 头像 url
  avatar: string;
  // 生日
  birthday: Date;
  /** 当前租户 ID */
  currentTenantId?: string;
  /** 默认租户 ID */
  defaultTenantId?: string;
  // 所属部门
  dept: SessionDept;
  // 部门id
  deptId: string;
  // 邮箱
  email: string;
  /** 是否启用多租户（来自系统参数 enableMultiTenant） */
  enableMultiTenant?: boolean;
  // 登录后跳转地址
  homePath: string;
  // id
  id: string;
  // 最后登录时间
  lastLoginDate: Date;
  // 邮箱是否验证
  mailIsVerifies: boolean;
  // 昵称
  nickname: string;
  // 权限标识集合
  permissionCodeList: string[];
  // 手机号码
  phoneNumber: string;
  // 岗位id
  postId?: string;
  // 角色标识集合
  roleCodeList: string[];
  // 角色集合
  roleList: SessionUserRole[];
  // 性别
  sex: string;
  // 来源
  source: string;
  // 状态
  status: string;
  /** 可切换租户列表 */
  tenantList?: SessionTenant[];
  /** 是否允许切换租户 */
  tenantSwitchable?: boolean;
  // 用户名
  username: string;
}

/**
 * 会话中的租户信息
 */
export interface SessionTenant {
  id: string;
  isDefault?: string;
  name: string;
  tenantCode: string;
}
