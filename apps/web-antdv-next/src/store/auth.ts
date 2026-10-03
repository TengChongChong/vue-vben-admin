import type { UserInfo } from '@vben/types';

import type { LoginAccountParams, LoginSmsParams } from '#/api';

import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { LOGIN_PATH } from '@vben/constants';
import { preferences } from '@vben/preferences';
import {
  resetAllStores,
  useAccessStore,
  useTabbarStore,
  useTenantStore,
  useUserStore,
} from '@vben/stores';
import { HashingFactory } from '@vben/utils';

import { notification } from 'antdv-next';
import { defineStore } from 'pinia';

import {
  getCurrentUserApi,
  loginAccountApi,
  loginSmsApi,
  logoutApi,
  switchTenantApi,
} from '#/api';
import { $t } from '#/locales';
import { refreshAccessAfterTenantSwitch } from '#/router/access';
import { useCmsSiteStore } from '#/store/cms-site';

export const useAuthStore = defineStore('auth', () => {
  const accessStore = useAccessStore();
  const userStore = useUserStore();
  const tenantStore = useTenantStore();
  const cmsSiteStore = useCmsSiteStore();
  const router = useRouter();

  const loginLoading = ref(false);
  const tenantSwitchLoading = ref(false);

  /**
   * 异步处理登录操作
   * Asynchronously handle the login process
   *
   * @param params 登录表单数据
   * @param onSuccess onSuccess
   */
  async function authLoginAccount(
    params: LoginAccountParams,
    onSuccess?: () => Promise<void> | void,
  ) {
    // 异步处理用户登录操作并获取 accessToken
    let userInfo: null | UserInfo = null;
    try {
      loginLoading.value = true;
      params.password = HashingFactory.createMD5Hashing().hash(params.password);
      const loginResult = await loginAccountApi(params);
      // 如果成功获取到 accessToken
      if (loginResult.accessToken) {
        accessStore.setAccessToken(loginResult.accessToken);
        tenantStore.applyLoginResult(loginResult);

        // 获取用户信息并存储到 accessStore 中
        userInfo = await fetchUserInfo();

        userStore.setUserInfo(userInfo);

        if (accessStore.loginExpired) {
          accessStore.setLoginExpired(false);
        } else {
          onSuccess
            ? await onSuccess?.()
            : await router.push(
                userInfo.homePath || preferences.app.defaultHomePath,
              );
        }

        if (userInfo?.nickname) {
          notification.success({
            description: `${$t('authentication.loginSuccessDesc')}:${userInfo?.nickname}`,
            duration: 3,
            message: $t('authentication.loginSuccess'),
          });
        }
      }
    } finally {
      loginLoading.value = false;
    }

    return {
      userInfo,
    };
  }

  async function authLoginSms(
    params: LoginSmsParams,
    onSuccess?: () => Promise<void> | void,
  ) {
    let userInfo: null | UserInfo = null;
    try {
      loginLoading.value = true;
      const loginResult = await loginSmsApi(params);
      if (loginResult.accessToken) {
        accessStore.setAccessToken(loginResult.accessToken);
        tenantStore.applyLoginResult(loginResult);
        userInfo = await fetchUserInfo();
        userStore.setUserInfo(userInfo);

        if (accessStore.loginExpired) {
          accessStore.setLoginExpired(false);
        } else {
          onSuccess
            ? await onSuccess?.()
            : await router.push(
                userInfo.homePath || preferences.app.defaultHomePath,
              );
        }

        if (userInfo?.nickname) {
          notification.success({
            description: `${$t('authentication.loginSuccessDesc')}:${userInfo?.nickname}`,
            duration: 3,
            message: $t('authentication.loginSuccess'),
          });
        }
      }
    } finally {
      loginLoading.value = false;
    }
    return {
      userInfo,
    };
  }

  async function logout(redirect: boolean = true) {
    try {
      await logoutApi();
    } catch {
      // 不做任何处理
    }
    resetAllStores();
    accessStore.setLoginExpired(false);

    // 已经在登录页时不能再带 redirect：此时 currentRoute.fullPath 就是登录页本身，
    // 再编码一层会得到「登录页?redirect=编码后的登录页」，下一次又在这个基础上再包一层，
    // 反复登出会让 URL 逐跳变长，且没有上限。
    // On the login page the current route is the login page itself, so carrying it as
    // `redirect` would nest one more encoded layer on every repeat.
    const currentRoute = router.currentRoute.value;
    const alreadyOnLogin = currentRoute.path === LOGIN_PATH;

    // 回登录页带上当前路由地址
    await router.replace({
      path: LOGIN_PATH,
      query:
        redirect && !alreadyOnLogin
          ? { redirect: encodeURIComponent(currentRoute.fullPath) }
          : {},
    });
  }

  async function fetchUserInfo() {
    const userInfo = await getCurrentUserApi();
    userStore.setUserInfo(userInfo);
    tenantStore.applySessionUser(userInfo);
    return userInfo;
  }

  /**
   * 切换租户：更新会话 → 刷新权限菜单 → 关闭标签页 → 回到首页
   */
  async function switchTenant(tenantId: string) {
    if (!tenantId || tenantId === tenantStore.currentTenantId) {
      return;
    }

    const tabbarStore = useTabbarStore();
    try {
      tenantSwitchLoading.value = true;
      const loginResult = await switchTenantApi(tenantId);

      if (loginResult.accessToken) {
        accessStore.setAccessToken(loginResult.accessToken);
      }
      tenantStore.applyLoginResult(loginResult);

      const userInfo = await fetchUserInfo();
      await refreshAccessAfterTenantSwitch(router);
      await tabbarStore.closeAllTabs(router);

      // 租户切换后重置 CMS 站点上下文，避免沿用旧站点
      cmsSiteStore.reset();
      void cmsSiteStore.refresh();

      await router.replace(
        userInfo.homePath || preferences.app.defaultHomePath,
      );

      const tenantName =
        tenantStore.tenantList.find((item) => item.id === tenantId)?.name ??
        tenantId;
      notification.success({
        message: '租户切换成功',
        description: tenantName,
        duration: 2,
      });
    } finally {
      tenantSwitchLoading.value = false;
    }
  }

  function $reset() {
    loginLoading.value = false;
    tenantSwitchLoading.value = false;
  }

  return {
    $reset,
    authLoginAccount,
    authLoginSms,
    fetchUserInfo,
    loginLoading,
    logout,
    switchTenant,
    tenantSwitchLoading,
  };
});
