<script lang="ts" setup>
import type { LoginAccountParams } from '#/api/auth/model/auth-model';

import { computed } from 'vue';

import { useVbenModal, type VbenFormSchema } from '@vben/common-ui';
import { AuthenticationLogin, z } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { getByKeyApi } from '#/api/sys/sys-config';
import { SlideVerifyModal } from '#/components/verify';
import { useAuthStore } from '#/store';

defineOptions({ name: 'Login' });

// 是否开启登录验证码
let loginVerificationCode = true;
getByKeyApi('loginVerificationCode').then((res) => {
  if (res && res.value) {
    loginVerificationCode = res.value === 'true';
  }
});

const authStore = useAuthStore();

const formSchema = computed((): VbenFormSchema[] => {
  return [
    {
      component: 'VbenInput',
      componentProps: {
        placeholder: $t('authentication.usernameTip'),
      },
      fieldName: 'username',
      label: $t('authentication.username'),
      rules: z.string().min(1, { message: $t('authentication.usernameTip') }),
    },
    {
      component: 'VbenInputPassword',
      componentProps: {
        placeholder: $t('authentication.password'),
      },
      fieldName: 'password',
      label: $t('authentication.password'),
      rules: z.string().min(1, { message: $t('authentication.passwordTip') }),
    },
  ];
});

// 验证码
let captchaVerification: null | string = null;

let loginParams: LoginAccountParams = null;

function handleVerifySuccess(code: string) {
  captchaVerification = code;
  handleLoginAccount();
}

const [BaseSlideVerifyModal, baseModalApi] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: SlideVerifyModal,
});

function openVerifyModal() {
  baseModalApi.open();
}

/**
 * 点击登录按钮
 */
function handleLoginClick(params: LoginAccountParams) {
  // 存储登录参数
  loginParams = params;
  if (loginVerificationCode) {
    // 开启了登录验证码
    openVerifyModal();
  } else {
    handleLoginAccount();
  }
}

/**
 * 用户登录 - 用户名+密码
 */
function handleLoginAccount() {
  authStore.authLoginAccount({
    ...loginParams,
    rememberMe: false,
    captchaVerification,
  });
}
</script>

<template>
  <div class="login-wrapper">
    <AuthenticationLogin
      :form-schema="formSchema"
      :loading="authStore.loginLoading"
      @submit="handleLoginClick"
    />

    <BaseSlideVerifyModal @success="handleVerifySuccess" />
  </div>
</template>
