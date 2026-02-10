<script setup lang="ts">
import { h } from 'vue';

import { z } from '@vben/common-ui';
import { HashingFactory } from '@vben/utils';

import { Card, Modal } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { changePasswordApi } from '#/api';
import { useAuthStore } from '#/store';

const onSubmit = async (values: Record<string, any>) => {
  await changePasswordApi(
    HashingFactory.createMD5Hashing().hash(values.currentPassword),
    HashingFactory.createMD5Hashing().hash(values.password),
  );
  Modal.success({
    title: '密码修改成功',
    content: h('div', {}, [h('p', '点击知道了重新登录')]),
    onOk() {
      const authStore = useAuthStore();
      // 重新登录
      authStore.logout();
    },
  });
};

const validatePassword = async (password: string) => {
  return /^(?![A-Za-z]+$)(?![\dA-Z]+$)(?![\WA-Z]+$)(?![\da-z]+$)(?![\Wa-z]+$)(?![\W\d]+$)\S{8,18}$/.test(
    password,
  );
};

const [BaseForm] = useVbenForm({
  handleSubmit: onSubmit,
  schema: [
    {
      component: 'VbenInputPassword',
      componentProps: { placeholder: '请输入当前密码' },
      fieldName: 'currentPassword',
      label: '当前密码',
      rules: 'required',
    },
    {
      component: 'VbenInputPassword',
      componentProps: {
        passwordStrength: true,
        placeholder: '请输入8~18位数字、大/小写字母、特殊符号任意三种组合',
      },
      fieldName: 'password',
      label: '新密码',
      rules: z
        .string()
        .min(1, {
          message: '请输入新密码',
        })
        .refine((value) => validatePassword(value), {
          message: '请输入8~18位数字、大/小写字母、特殊符号任意三种组合',
        }),
    },
    {
      component: 'VbenInputPassword',
      componentProps: {
        passwordStrength: true,
        placeholder: '请输入8~18位数字、大/小写字母、特殊符号任意三种组合',
      },
      dependencies: {
        rules(values) {
          const { password } = values;
          return z
            .string()
            .min(1, {
              message: '请输入确认密码',
            })
            .refine((value) => value === password, {
              message: '两次输入的密码不一致',
            });
        },
        triggerFields: ['password'],
      },
      fieldName: 'confirmPassword',
      label: '确认密码',
      rules: z.string().min(1, {
        message: '请输入确认密码',
      }),
    },
  ],
});
</script>

<template>
  <Card :bordered="false" title="修改密码">
    <div class="form-wrapper">
      <BaseForm />
    </div>
  </Card>
</template>

<style lang="scss" scoped>
.form-wrapper {
  max-width: 800px;
}
</style>
