<script setup lang="ts">
import type { SessionUser } from '@vben/types';
import type { FormInstance } from 'ant-design-vue';
import type { Rule } from 'ant-design-vue/es/form';

import { reactive, ref } from 'vue';

import { Card, DatePicker, Form, FormItem, Input, Space } from 'ant-design-vue';
import dayjs, { Dayjs } from 'dayjs';

import { ButtonReset, ButtonSave } from '#/components/button';
import { Cropper } from '#/components/cropper';
import { DictRadio } from '#/components/dict';

interface FormState {
  // 用户名
  username: string;
  // 昵称
  nickname: string;
  // 性别
  sex: string;
  // 生日
  birthday?: Dayjs;
  // 头像
  avatar?: string;
}

const props = defineProps<{ currentUser: SessionUser }>();

const formRef = ref<FormInstance>();

const formState = reactive<FormState>({
  username: props.currentUser.username,
  nickname: props.currentUser.nickname,
  sex: props.currentUser.sex,
  birthday: props.currentUser.birthday
    ? dayjs(props.currentUser.birthday)
    : undefined,
  avatar: props.currentUser.avatar,
});

const rules: Record<string, Rule[]> = {
  nickname: [{ required: true }],
  sex: [{ required: true }],
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
  <Card :bordered="false" title="用户信息">
    <div class="form-wrapper">
      <Form
        ref="formRef"
        :model="formState"
        :rules="rules"
        v-bind="layout"
        @finish="handleFinish"
      >
        <FormItem has-feedback label="用户名" name="username">
          <Input v-model:value="formState.username" disabled />
        </FormItem>
        <FormItem has-feedback label="昵称" name="nickname">
          <Input v-model:value="formState.nickname" />
        </FormItem>
        <FormItem has-feedback label="头像" name="avatar">
          <Cropper :url="formState.avatar!" alt="头像" />
        </FormItem>
        <FormItem has-feedback label="性别" name="sex">
          <DictRadio v-model:value="formState.sex" dict-type="sex" />
        </FormItem>
        <FormItem has-feedback label="生日" name="birthday">
          <DatePicker v-model:value="formState.birthday" />
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
