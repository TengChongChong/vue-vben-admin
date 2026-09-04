<script lang="ts" setup>
import type { CmsMenu } from '#/api';

import { ref } from 'vue';

import { useVbenDrawer, z } from '@vben/common-ui';

import { Space } from 'antdv-next';

import { useVbenForm } from '#/adapter/form';
import { addCmsMenuApi, saveCmsMenuApi } from '#/api';
import { ButtonClose, ButtonSave } from '#/components/button';

const emit = defineEmits(['success']);

const saveBtnLoading = ref(false);

const [BaseForm, baseFormApi] = useVbenForm({
  showDefaultActions: false,
  schema: [
    { fieldName: 'id', component: 'Input', formItemClass: 'hidden' },
    { fieldName: 'version', component: 'Input', formItemClass: 'hidden' },
    { fieldName: 'siteId', component: 'Input', formItemClass: 'hidden' },
    {
      fieldName: 'name',
      label: '名称',
      component: 'Input',
      rules: z
        .string()
        .min(1, { message: '请输入名称' })
        .max(32, { message: '名称不能超过32个字符' }),
    },
    {
      fieldName: 'slug',
      label: '标识',
      component: 'Input',
      rules: z
        .string()
        .min(1, { message: '请输入标识' })
        .max(32, { message: '标识不能超过32个字符' })
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
          message: '标识仅允许小写字母、数字与连字符',
        }),
      description: '站点内唯一，主题按此取值，如 header / sidebar / footer',
    },
    {
      fieldName: 'remarks',
      label: '备注',
      component: 'Textarea',
      componentProps: {
        autoSize: { minRows: 2, maxRows: 5 },
      },
      rules: z
        .string()
        .max(900, { message: '备注不能超过900个字符' })
        .optional(),
    },
    // {
    //   fieldName: 'orderNo',
    //   label: '排序值',
    //   component: 'InputNumber',
    //   rules: z
    //     .number()
    //     .min(0, { message: '排序值不能小于0' })
    //     .max(9999, { message: '排序值不能大于9999' })
    //     .optional(),
    // },
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

async function handleSubmit(callback: (res: CmsMenu) => any) {
  try {
    saveBtnLoading.value = true;
    const { valid } = await baseFormApi.validate();
    if (!valid) {
      return;
    }
    drawerApi.lock();
    const res = await saveCmsMenuApi(
      (await baseFormApi.getValues()) as CmsMenu,
    );
    emit('success');
    await callback(res);
    drawerApi.unlock();
  } catch (error) {
    drawerApi.unlock();
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
    baseFormApi.reset();
    addCmsMenuApi().then((data) => {
      baseFormApi.setValues(data);
    });
  });
}

const [Drawer, drawerApi] = useVbenDrawer({
  onOpenChange: async (isOpen: boolean) => {
    if (isOpen) {
      const data = drawerApi.getData() as Record<string, any>;
      await baseFormApi.reset();
      await baseFormApi.setValues(data);
    }
  },
});
</script>

<template>
  <Drawer class="w-[600px]" title="导航菜单">
    <BaseForm />
    <template #footer>
      <Space>
        <ButtonClose @click="drawerApi.close()" />
        <ButtonSave
          :auth-codes="['cms:menu:save']"
          :loading="saveBtnLoading"
          @click="handleSave" />
        <ButtonSave
          :auth-codes="['cms:menu:save']"
          :loading="saveBtnLoading"
          text="保存并新增"
          @click="handleSaveAndAdd" />
      </Space>
    </template>
  </Drawer>
</template>
