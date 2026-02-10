<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { VbenButton, z } from '@vben/common-ui';
import { $t } from '@vben/locales';
import { HashingFactory } from '@vben/utils';

import {
  Input,
  InputGroup,
  message,
  Select,
  SelectOption,
} from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { resetPasswordApi, sendEmailApi, sendSmsApi } from '#/api';

defineOptions({
  name: 'ForgetPassword',
});

const loading = ref(false);

const bindAccountType = ref('email');

const [Form, formApi] = useVbenForm({
  commonConfig: {
    hideLabel: true,
    hideRequiredMark: true,
  },
  schema: [
    {
      component: 'Input',
      componentProps: {
        size: 'large',
        placeholder: '请输入用户名',
      },
      fieldName: 'username',
      label: '账号',
      rules: z
        .string()
        .min(1, { message: '请输入用户名' })
        .max(32, { message: '用户名最多输入32个字符' }),
    },
    {
      component: 'Input',
      componentProps: {
        size: 'large',
      },
      fieldName: 'bindAccount',
      label: $t('authentication.mobile'),
      rules: z.string().min(1, {
        message: `请输入接收验证码账号`,
      }),
    },
    {
      component: 'SmsVerificationCode',
      componentProps: {
        createText: (countdown: number) => {
          const text =
            countdown > 0
              ? $t('authentication.sendText', [countdown])
              : $t('authentication.sendCode');
          return text;
        },
        placeholder: $t('authentication.code'),
        beforeSendCode: async () => {
          const validateUsername = await formApi.form.validateField('username');
          if (!validateUsername.valid) {
            return false;
          }
          const validateBindAccount =
            await formApi.form.validateField('bindAccount');
          if (!validateBindAccount.valid) {
            return false;
          }
          const result =
            bindAccountType.value === 'email'
              ? /^([\w-])+@([\w-])+(.[\w-])+/.test(validateBindAccount.value)
              : /^1[3-9]\d{9}$/.test(validateBindAccount.value);
          if (!result) {
            message.error(
              `请输入正确的${bindAccountType.value === 'email' ? '邮箱' : '手机号'}`,
            );
          }
          return result;
        },
        handleSendCode: async (captchaVerification) => {
          const formData = formApi.getValues();
          const api =
            bindAccountType.value === 'email' ? sendEmailApi : sendSmsApi;
          await api(
            captchaVerification,
            formData.username,
            formData.bindAccount,
          ).then((res) => {
            if (bindAccountType.value === 'email') {
              message.success(`验证码已发送至：${formData.bindAccount}`);
            } else {
              message.success(
                `验证码已发送至：${formData.bindAccount}（此处仅模拟找回流程${res}）`,
              );
            }
          });
        },
      },
      fieldName: 'captcha',
      label: '验证码',
      rules: z.string().length(6, { message: '请输入6位验证码' }),
    },
    {
      fieldName: 'password',
      label: '密码',
      component: 'InputPassword',
      componentProps: {
        size: 'large',
        placeholder: '请输入密码',
        autocomplete: 'new-password',
      },
      rules: z
        .string()
        .min(1, { message: '请输入密码' })
        .max(32, { message: '密码最多输入32个字符' }),
    },
  ],
  showDefaultActions: false,
});

const router = useRouter();

async function handleReset() {
  const { valid } = await formApi.validate();
  const values = await formApi.getValues();
  if (valid) {
    try {
      loading.value = true;
      const { username, password, code } = values;
      await resetPasswordApi(
        username,
        code,
        HashingFactory.createMD5Hashing().hash(password.trim()),
      );
      message.success('重置成功');
      goToLogin();
    } catch (error) {
      console.error(error);
    } finally {
      loading.value = false;
    }
  }
}

function goToLogin() {
  router.push('/auth/login');
}
</script>

<template>
  <div>
    <div class="mb-7 sm:mx-auto sm:w-full sm:max-w-md">
      <h2
        class="mb-3 text-3xl font-bold leading-9 tracking-tight text-foreground lg:text-4xl"
      >
        找回密码
      </h2>

      <p class="lg:text-md text-sm text-muted-foreground">
        使用邮箱或手机号找回密码
      </p>
    </div>
    <Form>
      <template #bindAccount="slotProps">
        <InputGroup compact>
          <Select
            v-model:value="bindAccountType"
            size="large"
            style="width: 25%"
          >
            <SelectOption value="mobilePhone"> 手机号 </SelectOption>
            <SelectOption value="email">邮箱</SelectOption>
          </Select>
          <Input
            v-bind="slotProps"
            :placeholder="`${bindAccountType === 'email' ? '请输入邮箱' : '请输入手机号'}`"
            style="width: 75%"
          />
        </InputGroup>
      </template>
    </Form>

    <div>
      <VbenButton
        :loading="loading"
        aria-label="submit"
        class="mt-2 w-full"
        @click="handleReset"
      >
        重置
      </VbenButton>
      <VbenButton class="mt-4 w-full" variant="outline" @click="goToLogin()">
        {{ $t('common.back') }}
      </VbenButton>
    </div>
  </div>
</template>
