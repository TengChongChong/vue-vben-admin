<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { useUserStore } from '@vben/stores';

import { Card, message, Space } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { getUserInfoApi } from '#/api/auth/auth';
import { currentUserApi, saveUserInfoApi } from '#/api/auth/sys-user-personal';
import { ButtonSave } from '#/components/button';

const saveBtnLoading = ref(false);

const [BaseForm, baseFormApi] = useVbenForm({
  showDefaultActions: false,
  schema: [
    {
      component: 'Input',
      componentProps: { placeholder: '请输入用户名', disabled: true },
      fieldName: 'username',
      label: '用户名',
    },
    {
      component: 'Input',
      componentProps: { placeholder: '请输入昵称' },
      fieldName: 'nickname',
      label: '昵称',
      rules: 'required',
    },
    {
      component: 'Cropper',
      componentProps: { ruleKey: 'sys-user-avatar' },
      fieldName: 'avatar',
      label: '头像',
    },
    {
      component: 'DictRadio',
      componentProps: { dictType: 'sex' },
      fieldName: 'sex',
      label: '性别',
    },
    {
      component: 'DatePicker',
      fieldName: 'birthday',
      label: '生日',
    },
  ],
});

onMounted(() => {
  currentUserApi().then((data) => {
    const { username, nickname, sex, birthday, avatar } = data;
    baseFormApi.setValues({
      username,
      nickname,
      sex,
      birthday,
      avatar,
    });
  });
});

async function handleSubmit() {
  try {
    saveBtnLoading.value = true;
    const { valid } = await baseFormApi.validate();
    if (!valid) {
      return;
    }
    await saveUserInfoApi(await baseFormApi.getValues());
    const userStore = useUserStore();
    const userInfo = await getUserInfoApi();
    userStore.setUserInfo(userInfo);
    message.success('保存成功');
  } catch (error) {
    console.error('保存失败', error);
  } finally {
    saveBtnLoading.value = false;
  }
}
</script>

<template>
  <Card :bordered="false" title="我的资料">
    <div class="form-wrapper">
      <BaseForm />

      <div class="text-center">
        <Space>
          <ButtonSave :loading="saveBtnLoading" @click="handleSubmit" />
        </Space>
      </div>
    </div>
  </Card>
</template>

<style lang="scss" scoped>
.form-wrapper {
  max-width: 800px;
}
</style>
