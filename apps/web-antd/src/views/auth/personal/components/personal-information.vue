<script setup lang="ts">
import type { SysUser } from '#/api/auth/model/sysUserModel';

import { onMounted } from 'vue';

import { useUserStore } from '@vben/stores';

import { Card, message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter';
import { getUserInfoApi } from '#/api/auth/auth';
import { currentUserApi, saveUserInfoApi } from '#/api/auth/sysUserPersonal';
import { Cropper } from '#/components/cropper';

const [BaseForm, baseFormApi] = useVbenForm({
  handleSubmit: onSubmit,
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
      component: 'Input',
      fieldName: 'avatar',
      label: '头像',
    },
    {
      component: 'DictRadio',
      componentProps: { dictType: 'sex' },
      fieldName: 'sex',
      label: '性别',
    },
  ],
});

onMounted(() => {
  currentUserApi().then((data) => {
    const { username, nickname, sex, birthday, avatar } = data;
    baseFormApi.setValues({ username, nickname, sex, birthday, avatar });
  });
});

async function onSubmit(values: Record<string, any>) {
  await saveUserInfoApi(values as SysUser);
  message.success('保存成功');
  const userStore = useUserStore();
  const userInfo = await getUserInfoApi();
  userStore.setUserInfo(userInfo);
}
</script>

<template>
  <Card :bordered="false" title="我的资料">
    <div class="form-wrapper">
      <BaseForm>
        <template #avatar="slotProps">
          <Cropper v-bind="slotProps" alt="头像" />
        </template>
      </BaseForm>
    </div>
  </Card>
</template>

<style lang="scss" scoped>
.form-wrapper {
  max-width: 800px;
}
</style>
