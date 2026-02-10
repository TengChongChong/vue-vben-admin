<script lang="ts" setup>
import type { SysQuickNavigationVO } from '#/api';

import { ref } from 'vue';

import { useVbenModal, z } from '@vben/common-ui';

import { message, Space } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { addSysQuickNavigationApi, saveSysQuickNavigationApi } from '#/api';
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
      label: '名称',
      component: 'Input',
      rules: z
        .string()
        .min(1, { message: '请输入名称' })
        .max(32, { message: '名称最多输入32个字符' }),
    },
    {
      fieldName: 'url',
      label: '地址',
      component: 'Input',
      rules: z
        .string()
        .min(1, { message: '请输入地址' })
        .max(255, { message: '地址最多输入255个字符' }),
    },
    {
      fieldName: 'icon',
      label: '图标',
      component: 'IconPicker',
      rules: z.string().max(32, { message: '图标最多输入32个字符' }).optional(),
    },
    {
      fieldName: 'color',
      label: '颜色',
      component: 'DictSelect',
      componentProps: {
        dictType: 'tagColor',
      },
      rules: 'selectRequired',
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
        .max(999, { message: '排序值不能大于999' }),
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

async function handleSubmit(callback: (res: SysQuickNavigationVO) => any) {
  try {
    saveBtnLoading.value = true;
    const { valid } = await baseFormApi.validate();
    if (!valid) {
      return;
    }
    const values: SysQuickNavigationVO = await baseFormApi.getValues();
    const res = await saveSysQuickNavigationApi(values);
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
    addSysQuickNavigationApi().then((res) => {
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
  <Modal class="w-[600px]" title="快捷导航">
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
