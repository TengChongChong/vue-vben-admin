<script lang="ts" setup>
import { useVbenForm } from '#/adapter/form';
import { Page, z } from '@vben/common-ui';
import { Card } from 'ant-design-vue';

const validatePassword = async (password: string) => {
  return /^(?![A-Za-z]+$)(?![\dA-Z]+$)(?![\WA-Z]+$)(?![\da-z]+$)(?![\Wa-z]+$)(?![\W\d]+$)\S{8,18}$/.test(
    password,
  );
};

const [BaseForm] = useVbenForm({
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
  <Page>
    <Card :bordered="false" class="mb-4 w-[720px]" title="密码强度">
      <BaseForm />
    </Card>
  </Page>
</template>
