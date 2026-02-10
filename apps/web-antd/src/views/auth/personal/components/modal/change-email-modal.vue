<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenModal, z } from '@vben/common-ui';

import { message, Space } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { applicationBindingEmailApi } from '#/api';
import { ButtonClose, ButtonSave } from '#/components/button';

const emit = defineEmits(['success']);

const saveBtnLoading = ref(false);

const [BaseForm, baseFormApi] = useVbenForm({
  showDefaultActions: false,
  schema: [
    {
      fieldName: 'email',
      label: '邮箱',
      component: 'Input',
      rules: z
        .string()
        .email({ message: '请输入正确的邮箱地址' })
        .min(1, { message: '请输入邮箱' })
        .max(32, { message: '邮箱最多输入32个字符' }),
    },
  ],
});

async function handleSubmit() {
  try {
    saveBtnLoading.value = true;
    const { valid } = await baseFormApi.validate();
    if (!valid) {
      return;
    }
    const { email } = await baseFormApi.getValues();
    await applicationBindingEmailApi(email);
    message.success('邮件发送成功，请前往邮箱激活邮箱');
    emit('success');
    modalApi.close();
  } catch (error) {
    console.error('保存失败', error);
  } finally {
    saveBtnLoading.value = false;
  }
}

const [Modal, modalApi] = useVbenModal({
  onOpenChange: async (isOpen: boolean) => {
    if (isOpen) {
      await baseFormApi.resetForm();
    }
  },
});
</script>
<template>
  <Modal class="w-[600px]" title="修改邮箱">
    <BaseForm />

    <template #footer>
      <Space>
        <ButtonClose @click="modalApi.close()" />
        <ButtonSave :loading="saveBtnLoading" @click="handleSubmit" />
      </Space>
    </template>
  </Modal>
</template>
