<script lang="ts" setup>
import type { CmsPage } from '#/api';

import { ref } from 'vue';

import { useVbenDrawer, z } from '@vben/common-ui';

import { Space } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import {
  addCmsPageApi,
  saveCmsPageApi,
  selectCmsThemePageTemplateApi,
} from '#/api';
import { ButtonClose, ButtonSave } from '#/components/button';

const emit = defineEmits(['success']);

const saveBtnLoading = ref(false);

const formCommonConfig = {
  labelWidth: 90,
};

const [MainForm, mainFormApi] = useVbenForm({
  showDefaultActions: false,
  commonConfig: formCommonConfig,
  schema: [
    { fieldName: 'id', component: 'Input', formItemClass: 'hidden' },
    { fieldName: 'version', component: 'Input', formItemClass: 'hidden' },
    { fieldName: 'siteId', component: 'Input', formItemClass: 'hidden' },
    {
      fieldName: 'title',
      label: '标题',
      component: 'Input',
      rules: z
        .string()
        .min(1, { message: '请输入标题' })
        .max(128, { message: '标题不能超过128个字符' }),
    },
    {
      fieldName: 'subtitle',
      label: '副标题',
      component: 'Input',
      rules: z
        .string()
        .max(255, { message: '副标题不能超过255个字符' })
        .optional(),
    },
    {
      fieldName: 'content',
      label: '内容',
      component: 'Editor',
      formItemClass: 'col-span-full items-start',
    },
  ],
});

const [MetaForm, metaFormApi] = useVbenForm({
  showDefaultActions: false,
  commonConfig: formCommonConfig,
  schema: [
    {
      fieldName: 'slug',
      label: '别名',
      component: 'Input',
      rules: z
        .string()
        .min(1, { message: '请输入别名' })
        .max(64, { message: '别名不能超过64个字符' })
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
          message: '别名仅允许小写字母、数字与连字符',
        }),
      description: '站点内唯一，用于页面 URL',
    },
    {
      fieldName: 'template',
      label: '模板',
      component: 'ApiSelect',
      componentProps: {
        allowClear: false,
        api: selectCmsThemePageTemplateApi,
        afterFetch: (result) => result,
      },
      rules: z
        .string()
        .min(1, { message: '请选择模板' })
        .regex(/^[a-zA-Z0-9][a-zA-Z0-9._-]*\.html$/, {
          message: '模板须为合法的 html 文件名',
        }),
      description: '来自当前站点主题的页面模板',
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

async function handleSubmit(callback: (res: CmsPage) => any) {
  try {
    saveBtnLoading.value = true;
    const [mainResult, metaResult] = await Promise.all([
      mainFormApi.validate(),
      metaFormApi.validate(),
    ]);
    if (!mainResult.valid || !metaResult.valid) {
      return;
    }
    const [mainValues, metaValues] = await Promise.all([
      mainFormApi.getValues(),
      metaFormApi.getValues(),
    ]);
    drawerApi.lock();
    const res = await saveCmsPageApi({
      ...mainValues,
      ...metaValues,
    } as CmsPage);
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
    mainFormApi.resetForm();
    metaFormApi.resetForm();
    addCmsPageApi().then((data) => {
      mainFormApi.setValues(data);
      metaFormApi.setValues(data);
    });
  });
}

const [Drawer, drawerApi] = useVbenDrawer({
  onOpenChange: async (isOpen: boolean) => {
    if (isOpen) {
      const data = drawerApi.getData<Record<string, any>>();
      await Promise.all([mainFormApi.resetForm(), metaFormApi.resetForm()]);
      await Promise.all([
        mainFormApi.setValues(data),
        metaFormApi.setValues(data),
      ]);
    }
  },
});
</script>

<template>
  <Drawer class="w-[1440px]" title="页面信息">
    <div class="flex h-full min-h-0 gap-4">
      <div class="min-w-0 flex-1 overflow-y-auto pr-1">
        <MainForm />
      </div>
      <div class="border-border w-[340px] shrink-0 overflow-y-auto border-l pl-4">
        <MetaForm />
      </div>
    </div>
    <template #footer>
      <Space>
        <ButtonClose @click="drawerApi.close()" />
        <ButtonSave
          :auth-codes="['cms:page:save']"
          :loading="saveBtnLoading"
          @click="handleSave" />
        <ButtonSave
          :auth-codes="['cms:page:save']"
          :loading="saveBtnLoading"
          text="保存并新增"
          @click="handleSaveAndAdd" />
      </Space>
    </template>
  </Drawer>
</template>
