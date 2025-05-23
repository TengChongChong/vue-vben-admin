interface SmsVerificationCodeProps {
  class?: any;
  /**
   * 验证码长度
   */
  codeLength?: number;
  /**
   * 发送验证码按钮文本
   */
  createText?: (countdown: number) => string;
  /**
   * 是否禁用
   */
  disabled?: boolean;
  /**
   * 发送短信验证码前检查
   * @returns
   */
  beforeSendCode?: () => Promise<boolean>;
  /**
   * 自定义验证码发送逻辑
   * @returns
   */
  handleSendCode?: (captchaVerification: string) => Promise<void>;
  /**
   * 发送验证码按钮loading
   */
  loading?: boolean;
  /**
   * 最大重试时间
   */
  maxTime?: number;
}

export type { SmsVerificationCodeProps };
