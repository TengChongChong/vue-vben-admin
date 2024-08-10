import type { BasicUserInfo } from '@vben-core/typings';

import { acceptHMRUpdate, defineStore } from 'pinia';

interface UserState {
  /**
   * 用户信息
   */
  userInfo: BasicUserInfo | null;
  /**
   * 用户角色标识
   */
  roleCodeList: string[];
  /**
   * 用户权限标识
   */
  permissionCodeList: string[];
}

/**
 * @zh_CN 用户信息相关
 */
export const useUserStore = defineStore('core-user', {
  actions: {
    setUserInfo(userInfo: BasicUserInfo | null) {
      // 设置用户信息
      this.userInfo = userInfo;
      // 设置角色信息
      const roleCodeList = userInfo?.roleCodeList ?? [];
      const permissionCodeList = userInfo?.permissionCodeList ?? [];
      this.setRoleCodeList(roleCodeList);
      this.setPermissionCodeList(permissionCodeList);
    },
    setRoleCodeList(roles: string[]) {
      this.roleCodeList = roles;
    },
    setPermissionCodeList(roles: string[]) {
      this.permissionCodeList = roles;
    },
  },
  state: (): UserState => ({
    userInfo: null,
    roleCodeList: [],
    permissionCodeList: [],
  }),
});

// 解决热更新问题
const hot = import.meta.hot;
if (hot) {
  hot.accept(acceptHMRUpdate(useUserStore, hot));
}
