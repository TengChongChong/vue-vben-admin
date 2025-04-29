import type { BasicUserInfo } from '@vben-core/typings';

import { acceptHMRUpdate, defineStore } from 'pinia';

interface AccessState {
  /**
   * 用户权限标识
   */
  permissionCodeList: string[];
  /**
   * 用户角色标识
   */
  roleCodeList: string[];
  /**
   * 用户信息
   */
  userInfo: BasicUserInfo | null;
}

/**
 * @zh_CN 用户信息相关
 */
export const useUserStore = defineStore('core-user', {
  actions: {
    setPermissionCodeList(roles: string[]) {
      this.permissionCodeList = roles;
    },
    setRoleCodeList(roles: string[]) {
      this.roleCodeList = roles;
    },
    setUserInfo(userInfo: BasicUserInfo | null) {
      // 设置用户信息
      this.userInfo = userInfo;
      // 设置角色信息
      const roleCodeList = userInfo?.roleCodeList ?? [];
      const permissionCodeList = userInfo?.permissionCodeList ?? [];
      this.setRoleCodeList(roleCodeList);
      this.setPermissionCodeList(permissionCodeList);
    },
  },
  state: (): AccessState => ({
    permissionCodeList: [],
    roleCodeList: [],
    userInfo: null,
  }),
});
// 解决热更新问题
const hot = import.meta.hot;
if (hot) {
  hot.accept(acceptHMRUpdate(useUserStore, hot));
}
