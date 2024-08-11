import type { UserInfo } from '@vben/types';

import type { LoginAccountParams } from '#/api/auth/model/authModel';

import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { DEFAULT_HOME_PATH, LOGIN_PATH } from '@vben/constants';
import { resetAllStores, useAccessStore, useUserStore } from '@vben/stores';
import { HashingFactory } from '@vben/utils';

import { notification } from 'ant-design-vue';
import { defineStore } from 'pinia';

import { getUserInfoApi, loginAccountApi, logoutApi } from '#/api/auth/auth';
import { $t } from '#/locales';

export const useAuthStore = defineStore('auth', () => {
  const accessStore = useAccessStore();
  const userStore = useUserStore();
  const router = useRouter();

  const loginLoading = ref(false);

  /**
   * 用户登录 - 用户名+密码参数
   *
   * @param params 登录表单数据
   * @param onSuccess 登录成功回调
   */
  async function loginAccount(
    params: LoginAccountParams,
    onSuccess?: () => Promise<void> | void,
  ) {
    // 异步处理用户登录操作并获取 accessToken
    let userInfo: null | UserInfo = null;
    try {
      loginLoading.value = true;
      params.password = HashingFactory.createMD5Hashing().hash(params.password);
      const accessToken = await loginAccountApi(params);
      userInfo = await afterAuth(accessToken, onSuccess);
    } finally {
      loginLoading.value = false;
    }

    return {
      userInfo,
    };
  }

  /**
   * 认证通过后的逻辑
   *
   * @param accessToken token
   * @param onSuccess 回调
   */
  async function afterAuth(
    accessToken: string,
    onSuccess?: () => Promise<void> | void,
  ) {
    let userInfo: null | UserInfo = null;
    // 如果成功获取到 accessToken
    if (accessToken) {
      // 将 accessToken 存储到 accessStore 中
      accessStore.setAccessToken(accessToken);
      // accessStore.setRefreshToken(refreshToken);

      // 获取用户信息并存储到 accessStore 中
      userInfo = await fetchUserInfo();

      userStore.setUserInfo(userInfo);

      if (accessStore.loginExpired) {
        accessStore.setLoginExpired(false);
      } else {
        // 登录回调
        onSuccess
          ? await onSuccess?.()
          : await router.push(userInfo.homePath || DEFAULT_HOME_PATH);
      }

      // 显示欢迎信息
      if (userInfo?.nickname) {
        notification.success({
          description: `${$t('authentication.loginSuccessDesc')}:${userInfo?.nickname}`,
          duration: 3,
          message: $t('authentication.loginSuccess'),
        });
      }
    }
    return userInfo;
  }

  /**
   * 退出
   */
  async function logout() {
    // 用户退出
    await logoutApi();

    resetAllStores();
    accessStore.setLoginExpired(false);

    // 回登陆页带上当前路由地址
    await router.replace({
      path: LOGIN_PATH,
      query: {
        redirect: encodeURIComponent(router.currentRoute.value.fullPath),
      },
    });
  }

  /**
   * 获取当前登录用户信息
   */
  async function fetchUserInfo() {
    const userInfo: UserInfo = await getUserInfoApi();
    userStore.setUserInfo(userInfo);
    return userInfo;
  }

  function $reset() {
    loginLoading.value = false;
  }

  return {
    $reset,
    loginAccount,
    loginLoading,
    fetchUserInfo,
    logout,
  };
});
