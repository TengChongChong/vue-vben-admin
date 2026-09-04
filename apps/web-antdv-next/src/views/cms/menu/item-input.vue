<script lang="ts" setup>
import type { CmsMenuItem } from '#/api';

import { computed, ref } from 'vue';

import { useVbenDrawer, z } from '@vben/common-ui';

import { message, Space } from 'antdv-next';

import { useVbenForm } from '#/adapter/form';
import { saveCmsMenuItemApi } from '#/api';
import { ButtonClose, ButtonSave } from '#/components/button';

import { MENU_ITEM_TYPE_LABEL } from './data';

const emit = defineEmits(['success']);

const saveBtnLoading = ref(false);
const currentType = ref('url');
const drawerTitle = computed(() => {
  const typeLabel = MENU_ITEM_TYPE_LABEL[currentType.value] || '菜单项';
  return currentType.value ? `菜单项 - ${typeLabel}` : '菜单项';
});

const [BaseForm, baseFormApi] = useVbenForm({
  showDefaultActions: false,
  schema: [
    { fieldName: 'id', component: 'Input', formItemClass: 'hidden' },
    { fieldName: 'version', component: 'Input', formItemClass: 'hidden' },
    { fieldName: 'menuId', component: 'Input', formItemClass: 'hidden' },
    { fieldName: 'parentId', component: 'Input', formItemClass: 'hidden' },
    { fieldName: 'type', component: 'Input', formItemClass: 'hidden' },
    { fieldName: 'refId', component: 'Input', formItemClass: 'hidden' },
    {
      fieldName: 'typeLabel',
      label: '类型',
      component: 'Input',
      componentProps: { disabled: true },
    },
    {
      fieldName: 'title',
      label: '标题',
      component: 'Input',
      rules: z
        .string()
        .min(1, { message: '请输入标题' })
        .max(64, { message: '标题不能超过64个字符' }),
    },
    {
      fieldName: 'url',
      label: '自定义链接',
      component: 'Input',
      dependencies: {
        show: (values) => values.type === 'url',
        triggerFields: ['type'],
      },
      rules: z
        .string()
        .max(512, { message: '链接不能超过512个字符' })
        .optional(),
    },
    {
      fieldName: 'target',
      label: '打开方式',
      component: 'Select',
      componentProps: {
        options: [
          { label: '当前窗口', value: '_self' },
          { label: '新窗口', value: '_blank' },
        ],
      },
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'DictRadio',
      componentProps: {
        dictType: 'commonStatus',
      },
      rules: 'selectRequired',
    },
  ],
});

async function handleSave() {
  try {
    saveBtnLoading.value = true;
    const { valid } = await baseFormApi.validate();
    if (!valid) {
      return;
    }
    const values = await baseFormApi.getValues();
    if (values.type === 'url' && !values.url) {
      message.warning('请填写自定义链接');
      return;
    }
    drawerApi.lock();
    const { typeLabel: _, ...payload } = values as CmsMenuItem & {
      typeLabel?: string;
    };
    await saveCmsMenuItemApi(payload as CmsMenuItem);
    emit('success');
    drawerApi.close();
    drawerApi.unlock();
  } catch (error) {
    drawerApi.unlock();
    console.error('保存失败', error);
  } finally {
    saveBtnLoading.value = false;
  }
}

const [Drawer, drawerApi] = useVbenDrawer({
  onOpenChange: async (isOpen: boolean) => {
    if (isOpen) {
      const data = (drawerApi.getData() as Record<string, any>) || {};
      currentType.value = data.type || 'url';
      await baseFormApi.reset();
      await baseFormApi.setValues({
        ...data,
        typeLabel: MENU_ITEM_TYPE_LABEL[data.type] || data.type || '',
        target: data.target || '_self',
      });
    }
  },
});
</script>

<template>
  <Drawer class="w-[520px]" :title="drawerTitle">
    <BaseForm />
    <template #footer>
      <Space>
        <ButtonClose @click="drawerApi.close()" />
        <ButtonSave
          :auth-codes="['cms:menu:save']"
          :loading="saveBtnLoading"
          @click="handleSave" />
      </Space>
    </template>
  </Drawer>
</template>
