import type { SysUser } from '#/api/auth/model/sysUserModel.ts';

/**
 * 在线用户
 */
export interface SysUserOnline extends SysUser {
  sessionId: string;
  host: string;
  systemHost: string;
  startTimestamp: Date;
  lastAccessTime: Date;
  timeout: number;
}
