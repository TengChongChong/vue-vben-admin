<script setup lang="ts">
import type { Rule } from 'ant-design-vue/es/form';

import type { SysUser } from '#/api/auth/model/sysUserModel';
import type { FileInfo } from '#/api/file/model/fileInfoModel';

import { onMounted, reactive, ref } from 'vue';

import { useUserStore } from '@vben/stores';

import { type FormInstance, message } from 'ant-design-vue';
import { Card, DatePicker, Form, FormItem, Input, Space } from 'ant-design-vue';
import dayjs, { Dayjs } from 'dayjs';

import { getUserInfoApi } from '#/api/auth/auth';
import { currentUser, saveUserInfo } from '#/api/auth/sysUserPersonal';
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
  avatar?: FileInfo;
}

const saveBtnLoading = ref(false);

const formRef = ref<FormInstance>();

const formState = reactive<FormState>({
  username: '',
  nickname: '',
  sex: '',
  birthday: undefined,
  avatar: undefined,
});

const rules: Record<string, Rule[]> = {
  nickname: [{ required: true }],
  sex: [{ required: true }],
};

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 14 },
};

onMounted(() => {
  currentUser().then((data) => {
    const { username, nickname, sex, birthday, avatar } = data;
    formState.username = username!;
    formState.nickname = nickname!;
    formState.sex = sex!;
    formState.birthday = birthday ? dayjs(birthday) : undefined;
    formState.avatar = avatar;
  });
});

const handleFinish = async (values: FormState) => {
  try {
    saveBtnLoading.value = true;
    await saveUserInfo(values as SysUser);
    message.success('保存成功');
    const userStore = useUserStore();
    const userInfo = await getUserInfoApi();
    userStore.setUserInfo(userInfo);
  } catch (error) {
    console.error(error);
  } finally {
    saveBtnLoading.value = false;
  }
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
          <Cropper v-model:value="formState.avatar!" alt="头像" />
        </FormItem>
        <FormItem has-feedback label="性别" name="sex">
          <DictRadio v-model:value="formState.sex" dict-type="sex" />
        </FormItem>
        <FormItem has-feedback label="生日" name="birthday">
          <DatePicker v-model:value="formState.birthday" />
        </FormItem>

        <FormItem :wrapper-col="{ span: 14, offset: 4 }">
          <Space>
            <ButtonSave :loading="saveBtnLoading" html-type="submit" />
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
