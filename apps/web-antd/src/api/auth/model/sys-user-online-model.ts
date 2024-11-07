import type { SysUser } from '#/api/auth/model/sys-user-model.ts';

/**
 * 在线用户
 */
export interface SysUserOnline extends SysUser {
  /**
   * 会话id（token）
   */
  sessionId: string;
  /**
   * 用户主机地址
   */
  host: string;
  /**
   * 用户登录时系统IP
   */
  systemHost: string;
  /**
   * session最后访问时间
   */
  lastAccessTime: Date;
  /**
   * 超时时间
   */
  timeout: number;
  /**
   * 回话状态
   */
  sessionStatus: string;
  /**
   * 设备
   */
  device: string;
}
