export interface LoginParams {
  /**
   * 密码
   */
  password: string;
  /**
   * 用户名
   */
  username: string;
}

/**
 * 用户登录 - 用户名+密码参数
 */
export interface LoginAccountParams extends LoginParams {
  // 服务端二次验证验证码
  captchaVerification?: string;
  // 记住我
  rememberMe?: boolean;
}

/**
 * 用户登录 - 扫码参数
 */
export interface LoginQrCodeParams {
  // 设备Id
  deviceId: string;
}

/**
 * 用户登录 - 手机号+短信验证码参数
 */
export interface LoginSmsParams {
  // 服务端二次验证验证码
  captchaVerification?: string;
  // 手机号
  phoneNumber: string;
  // 短信验证码
  verificationCode: string;
}

/**
 * 登录响应信息
 */
export interface SessionTenantBrief {
  id: string;
  isDefault?: string;
  name: string;
  tenantCode: string;
}

/**
 * 登录响应信息
 */
export interface LoginResult {
  /**
   * accessToken
   */
  accessToken: string;

  /**
   * accessToken 有效期，单位：秒
   */
  accessTokenExpiresIn: number;

  /** 当前租户 ID */
  currentTenantId?: string;

  /** 默认租户 ID */
  defaultTenantId?: string;

  /** 是否启用多租户 */
  enableMultiTenant?: boolean;

  /**
   * refreshToken
   */
  refreshToken?: string;

  /**
   * refreshToken 有效期，单位：秒
   */
  refreshTokenExpiresIn?: number;

  /** 可切换租户列表 */
  tenantList?: SessionTenantBrief[];

  /** 是否允许切换租户 */
  tenantSwitchable?: boolean;
}
