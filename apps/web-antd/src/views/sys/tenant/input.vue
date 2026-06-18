<script lang="ts" setup>
import type { SysTenant } from '#/api';

import { ref } from 'vue';

import { useVbenModal, z } from '@vben/common-ui';

import { message, Space } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { saveSysTenantApi } from '#/api';
import { ButtonClose, ButtonSave } from '#/components/button';

const emit = defineEmits(['success']);

const saveBtnLoading = ref(false);

const [BaseForm, baseFormApi] = useVbenForm({
  showDefaultActions: false,
  schema: [
    { fieldName: 'id', component: 'Input', formItemClass: 'hidden' },
    { fieldName: 'version', component: 'Input', formItemClass: 'hidden' },
    {
      fieldName: 'tenantCode',
      label: '租户编码',
      component: 'Input',
      rules: z
        .string()
        .min(2, { message: '租户编码至少2个字符' })
        .max(64, { message: '租户编码最多64个字符' })
        .regex(/^[a-z][a-z0-9_-]*$/, {
          message: '需以小写字母开头，仅含小写字母、数字、下划线或中划线',
        }),
      description: '创建后不建议修改，用于系统内部标识',
    },
    {
      fieldName: 'name',
      label: '租户名称',
      component: 'Input',
      rules: z
        .string()
        .min(1, { message: '请输入租户名称' })
        .max(128, { message: '租户名称最多128个字符' }),
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'DictRadio',
      componentProps: {
        dictType: 'commonStatus',
      },
      defaultValue: '1',
      rules: 'selectRequired',
    },
    {
      fieldName: 'contacts',
      label: '联系人',
      component: 'Input',
      rules: z.string().max(32, { message: '联系人最多32个字符' }).optional(),
    },
    {
      fieldName: 'phoneNumber',
      label: '手机号',
      component: 'Input',
      rules: z.string().max(32, { message: '手机号最多32个字符' }).optional(),
    },
    {
      fieldName: 'expireTime',
      label: '到期时间',
      component: 'DatePicker',
      componentProps: {
        showTime: true,
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        class: 'w-full',
      },
    },
    {
      fieldName: 'remarks',
      label: '备注',
      component: 'Textarea',
      componentProps: {
        autoSize: {
          minRows: 2,
          maxRows: 7,
        },
      },
      rules: z
        .string()
        .max(900, { message: '备注最多输入900个字符' })
        .optional(),
    },
  ],
});

async function handleSubmit(callback: (res: SysTenant) => any) {
  try {
    saveBtnLoading.value = true;
    const { valid } = await baseFormApi.validate();
    if (!valid) {
      return;
    }
    modalApi.lock();
    const res = await saveSysTenantApi(await baseFormApi.getValues());
    message.success('保存成功');
    emit('success');
    await callback(res);
    modalApi.unlock();
  } catch (error) {
    modalApi.unlock();
    console.error('保存失败', error);
  } finally {
    saveBtnLoading.value = false;
  }
}

async function handleSave() {
  await handleSubmit(() => {
    modalApi.close();
  });
}

async function handleSaveAndAdd() {
  await handleSubmit(() => {
    baseFormApi.resetForm();
    baseFormApi.setValues({ status: '1' });
  });
}

const [Modal, modalApi] = useVbenModal({
  onOpenChange: async (isOpen: boolean) => {
    if (isOpen) {
      const data = modalApi.getData<Record<string, any>>();
      await baseFormApi.resetForm();
      await baseFormApi.setValues({
        status: '1',
        ...data,
      });
      if (data.id) {
        baseFormApi.updateSchema([
          {
            fieldName: 'tenantCode',
            componentProps: { disabled: data.id === '1' },
          },
        ]);
      } else {
        baseFormApi.updateSchema([
          {
            fieldName: 'tenantCode',
            componentProps: { disabled: false },
          },
        ]);
      }
    }
  },
});
</script>
<template>
  <Modal class="w-[640px]" title="租户信息">
    <BaseForm />

    <template #footer>
      <Space>
        <ButtonClose @click="modalApi.close()" />
        <ButtonSave :loading="saveBtnLoading" @click="handleSave" />
        <ButtonSave
          :loading="saveBtnLoading"
          text="保存并新增"
          @click="handleSaveAndAdd" />
      </Space>
    </template>
  </Modal>
</template>
