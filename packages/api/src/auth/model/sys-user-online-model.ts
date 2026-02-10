import type { SysUser } from '#/api/auth/model/sys-user-model';

/**
 * 在线用户
 */
export interface SysUserOnline extends SysUser {
  /**
   * 设备
   */
  device: string;
  /**
   * 用户主机地址
   */
  host: string;
  /**
   * session最后访问时间
   */
  lastAccessTime: Date;
  /**
   * 会话id（token）
   */
  sessionId: string;
  /**
   * 回话状态
   */
  sessionStatus: string;
  /**
   * 用户登录时系统IP
   */
  systemHost: string;
  /**
   * 超时时间
   */
  timeout: number;
}
