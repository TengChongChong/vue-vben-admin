<script lang="ts" setup>
import {
  AuthenticationLogin,
  type LoginAndRegisterParams,
} from '@vben/common-ui';

import { useAuthStore } from '#/store';

defineOptions({ name: 'Login' });

const authStore = useAuthStore();

/**
 * 用户登录 - 用户名+密码
 */
function handleLoginAccount(loginParams: LoginAndRegisterParams) {
  authStore.authLoginAccount({
    ...loginParams,
    rememberMe: false,
    captchaVerification: '',
  });
}
</script>

<template>
  <AuthenticationLogin
    :loading="authStore.loginLoading"
    password-placeholder="请输入密码"
    username-placeholder="请输入用户名"
    @submit="handleLoginAccount"
  />
</template>
