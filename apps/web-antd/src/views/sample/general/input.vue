<script lang="ts" setup>
import type { SampleGeneral } from '#/api/sample/model/sample-general-model';

import { ref } from 'vue';

import { useVbenDrawer, z } from '@vben/common-ui';

import { message, Space } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { addApi, saveApi } from '#/api/sample/sample-general';
import { ButtonClose, ButtonSave } from '#/components/button';

const emit = defineEmits(['success']);

const saveBtnLoading = ref(false);

const [BaseForm, baseFormApi] = useVbenForm({
  showDefaultActions: false,
  schema: [
    { fieldName: 'id', component: 'Input', formItemClass: 'hidden' },
    { fieldName: 'version', component: 'Input', formItemClass: 'hidden' },
    {
      fieldName: 'name',
      label: '姓名',
      component: 'Input',
      rules: z
        .string()
        .min(1, { message: '请输入姓名' })
        .max(32, { message: '姓名最多输入32个字符' }),
    },
    {
      fieldName: 'sex',
      label: '性别',
      component: 'DictRadio',
      componentProps: {
        dictType: 'sex',
      },
    },
    {
      fieldName: 'age',
      label: '年龄',
      component: 'InputNumber',
      rules: z
        .number()
        .min(0, { message: '年龄不能小于0' })
        .max(999, { message: '年龄不能大于999' }),
    },
    {
      fieldName: 'phone',
      label: '手机号码',
      component: 'Input',
      rules: z
        .string()
        .min(1, { message: '请输入手机号码' })
        .max(32, { message: '手机号码最多输入32个字符' }),
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'DictRadio',
      componentProps: {
        dictType: 'commonStatus',
      },
    },
    {
      fieldName: 'address',
      label: '地址',
      component: 'Input',
      rules: z
        .string()
        .min(1, { message: '请输入地址' })
        .max(255, { message: '地址最多输入255个字符' })
        .optional(),
    },
    {
      fieldName: 'orderNo',
      label: '排序值',
      component: 'InputNumber',
      rules: z
        .number()
        .min(0, { message: '排序值不能小于0' })
        .max(999, { message: '排序值不能大于999' })
        .optional(),
    },
  ],
});

async function handleSubmit(callback: (res: SampleGeneral) => any) {
  try {
    saveBtnLoading.value = true;
    const { valid } = await baseFormApi.validate();
    if (!valid) {
      return;
    }
    const values: SampleGeneral = await baseFormApi.getValues();
    const res = await saveApi(values);
    message.success('保存成功');
    emit('success');
    callback(res);
  } catch (error) {
    console.error('保存失败', error);
  } finally {
    saveBtnLoading.value = false;
  }
}

async function handleSave() {
  await handleSubmit(() => {
    drawerApi.close();
  });
}
async function handleSaveAndAdd() {
  await handleSubmit(() => {
    baseFormApi.resetForm();
    addApi().then((res) => {
      baseFormApi.setValues(res);
    });
  });
}

const [Drawer, drawerApi] = useVbenDrawer({
  onOpenChange: async (isOpen: boolean) => {
    if (isOpen) {
      // 打开时根据id获取详情
      const data = drawerApi.getData<Record<string, any>>();
      await baseFormApi.setValues(data);
    }
  },
});
</script>
<template>
  <Drawer class="w-[600px]" title="代码生成示例">
    <BaseForm />

    <template #footer>
      <Space>
        <ButtonClose @click="drawerApi.close()" />
        <ButtonSave :loading="saveBtnLoading" @click="handleSave" />
        <ButtonSave
          :loading="saveBtnLoading"
          text="保存并新增"
          @click="handleSaveAndAdd"
        />
      </Space>
    </template>
  </Drawer>
</template>
