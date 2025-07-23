<script lang="ts" setup>
import type { WorkflowCategoryVO } from '#/api/workflow/model/workflow-category-model';

import { ref } from 'vue';

import { useVbenModal, z } from '@vben/common-ui';

import { message, Space } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { addApi, saveApi } from '#/api/workflow/workflow-category';
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
      label: '分类名称',
      component: 'Input',
      rules: z
        .string()
        .min(1, { message: '请输入分类名称' })
        .max(32, { message: '分类名称最多输入32个字符' }),
    },
    {
      fieldName: 'code',
      label: '分类编码',
      component: 'Input',
      rules: z
        .string()
        .max(32, { message: '分类编码最多输入32个字符' })
        .optional(),
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
    {
      fieldName: 'orderNo',
      label: '排序值',
      component: 'InputNumber',
      componentProps: {
        min: 0,
      },
      rules: z
        .number()
        .min(0, { message: '排序值不能小于0' })
        .max(999, { message: '排序值不能大于999' })
        .optional(),
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'DictRadio',
      componentProps: {
        dictType: 'commonStatus',
      },
    },
  ],
});

async function handleSubmit(callback: (res: WorkflowCategoryVO) => any) {
  try {
    saveBtnLoading.value = true;
    const { valid } = await baseFormApi.validate();
    if (!valid) {
      return;
    }
    const values: WorkflowCategoryVO = await baseFormApi.getValues();
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

const [Modal, drawerApi] = useVbenModal({
  onOpenChange: async (isOpen: boolean) => {
    if (isOpen) {
      // 打开时根据id获取详情
      const data = drawerApi.getData<Record<string, any>>();
      await baseFormApi.resetForm();
      await baseFormApi.setValues(data);
    }
  },
});
</script>
<template>
  <Modal class="w-[600px]" title="流程分类">
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
  </Modal>
</template>
