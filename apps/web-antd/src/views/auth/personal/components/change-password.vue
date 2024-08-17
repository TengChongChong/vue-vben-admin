<script setup lang="ts">
import type { FormInstance } from 'ant-design-vue';
import type { Rule } from 'ant-design-vue/es/form';

import { reactive, ref } from 'vue';

import { Card, Form, FormItem, InputPassword, Space } from 'ant-design-vue';

import { ButtonReset, ButtonSave } from '#/components/button';

interface FormState {
  currentPassword: string;
  password: string;
  confirmPassword: string;
}

const formRef = ref<FormInstance>();

const formState = reactive<FormState>({
  currentPassword: '',
  password: '',
  confirmPassword: '',
});

const validatePassword = async (_rule: Rule, value: string) => {
  if (value === '') {
    throw '请输入新密码';
  } else {
    if (formState.password !== '') {
      if (
        !/^(?![A-Za-z]+$)(?![\dA-Z]+$)(?![\WA-Z]+$)(?![\da-z]+$)(?![\Wa-z]+$)(?![\W\d]+$)\S{8,18}$/.test(
          formState.password,
        )
      ) {
        throw '请输入8~18位数字、大/小写字母、特殊符号任意三种组合';
      }

      formRef.value.validateFields('confirmPassword');
    }
  }
};

const validateConfirmPassword = async (_rule: Rule, value: string) => {
  if (value === '') {
    throw '请输入确认密码';
  } else if (value === formState.password) {
  } else {
    throw '两次输入的密码不一致';
  }
};

const rules: Record<string, Rule[]> = {
  currentPassword: [{ required: true }],
  password: [
    { required: true, validator: validatePassword, trigger: 'change' },
  ],
  confirmPassword: [
    { required: true, validator: validateConfirmPassword, trigger: 'change' },
  ],
};

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 14 },
};

const handleFinish = (values: FormState) => {
  console.log(values, formState);
};

const resetForm = () => {
  formRef.value.resetFields();
};
</script>

<template>
  <Card :bordered="false" title="修改密码">
    <div class="form-wrapper">
      <Form
        ref="formRef"
        :model="formState"
        :rules="rules"
        v-bind="layout"
        @finish="handleFinish"
      >
        <FormItem has-feedback label="当前密码" name="currentPassword">
          <InputPassword
            v-model:value="formState.currentPassword"
            autocomplete="off"
          />
        </FormItem>
        <FormItem
          extra="请输入8~18位数字、大/小写字母、特殊符号任意三种组合"
          has-feedback
          label="新密码"
          name="password"
        >
          <InputPassword
            v-model:value="formState.password"
            autocomplete="off"
          />
        </FormItem>
        <FormItem has-feedback label="确认密码" name="confirmPassword">
          <InputPassword
            v-model:value="formState.confirmPassword"
            autocomplete="off"
          />
        </FormItem>
        <FormItem :wrapper-col="{ span: 14, offset: 4 }">
          <Space>
            <ButtonSave html-type="submit" />
            <ButtonReset @click="resetForm" />
          </Space>
        </FormItem>
      </Form>
    </div>
  </Card>
</template>

<style lang="scss" scoped>
.form-wrapper {
  max-width: 800px;
}
</style>
