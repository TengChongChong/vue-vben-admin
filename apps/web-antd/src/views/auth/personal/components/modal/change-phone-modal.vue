<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenModal, z } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { message, Space } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { bindingPhoneNumberApi, sendBindingPhoneNumberSmsApi } from '#/api';
import { ButtonClose, ButtonSave } from '#/components/button';

const emit = defineEmits(['success']);

const saveBtnLoading = ref(false);

const [BaseForm, baseFormApi] = useVbenForm({
  showDefaultActions: false,
  schema: [
    {
      component: 'VbenInput',
      componentProps: {
        placeholder: '请输入手机号',
      },
      fieldName: 'phoneNumber',
      label: $t('authentication.mobile'),
      rules: z
        .string()
        .min(1, { message: $t('authentication.mobileTip') })
        .refine((v) => /^1[3-9]\d{9}$/.test(v), {
          message: $t('authentication.mobileErrortip'),
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
          const validateResult =
            await baseFormApi.form.validateField('phoneNumber');
          return validateResult.valid;
        },
        handleSendCode: async (captchaVerification) => {
          const result = await sendBindingPhoneNumberSmsApi(
            baseFormApi.getValues().phoneNumber,
            captchaVerification,
          );
          // 注：此处仅为演示，实际场景无此提示
          message.success(`发送成功（此处仅模拟修改流程）：${result}`);
        },
      },
      fieldName: 'captcha',
      label: '验证码',
      rules: z.string().length(6, { message: '请输入6位验证码' }),
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
    const { phoneNumber, captcha } = await baseFormApi.getValues();
    await bindingPhoneNumberApi(phoneNumber, captcha);
    message.success('绑定成功');
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
  <Modal class="w-[600px]" title="修改手机号">
    <div class="change-phone-modal">
      <BaseForm />
    </div>

    <template #footer>
      <Space>
        <ButtonClose @click="modalApi.close()" />
        <ButtonSave :loading="saveBtnLoading" @click="handleSubmit" />
      </Space>
    </template>
  </Modal>
</template>
<style lang="scss" scoped>
.change-phone-modal {
  :deep(.h-10) {
    height: 2rem;
  }
}
</style>
