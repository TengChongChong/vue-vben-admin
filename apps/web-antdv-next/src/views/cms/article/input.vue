<script lang="ts" setup>
import type { CmsArticle, TreeNode, TreeNodeModel } from '#/api';

import { ref } from 'vue';

import { useVbenDrawer, z } from '@vben/common-ui';
import { listToTree } from '@vben/utils';

import { message, Space } from 'antdv-next';

import { useVbenForm } from '#/adapter/form';
import {
  addCmsArticleApi,
  saveCmsArticleApi,
  selectAllCmsColumnApi,
} from '#/api';
import { ButtonClose, ButtonSave } from '#/components/button';

const emit = defineEmits(['success']);

const saveBtnLoading = ref(false);

const formCommonConfig = {
  labelWidth: 90,
};

function parseTags(tags?: string): string[] {
  if (!tags) {
    return [];
  }
  return tags
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function stringifyTags(tags?: string[]): string {
  if (!tags?.length) {
    return '';
  }
  return tags.map((item) => item.trim()).filter(Boolean).join(',');
}

function toFormValues(data: Record<string, any>) {
  return {
    ...data,
    tags: parseTags(
      typeof data.tags === 'string' ? data.tags : stringifyTags(data.tags),
    ),
  };
}

const [MainForm, mainFormApi] = useVbenForm({
  showDefaultActions: false,
  commonConfig: formCommonConfig,
  schema: [
    { fieldName: 'id', component: 'Input', formItemClass: 'hidden' },
    { fieldName: 'version', component: 'Input', formItemClass: 'hidden' },
    { fieldName: 'siteId', component: 'Input', formItemClass: 'hidden' },
    { fieldName: 'status', component: 'Input', formItemClass: 'hidden' },
    {
      fieldName: 'title',
      label: '标题',
      component: 'Input',
      rules: z
        .string()
        .min(1, { message: '请输入标题' })
        .max(255, { message: '标题不能超过255个字符' }),
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
      fieldName: 'excerpt',
      label: '摘要',
      component: 'Textarea',
      componentProps: {
        autoSize: { minRows: 2, maxRows: 4 },
      },
      rules: z
        .string()
        .max(500, { message: '摘要不能超过500个字符' })
        .optional(),
    },
    {
      fieldName: 'content',
      label: '正文',
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
      fieldName: 'columnId',
      label: '栏目',
      component: 'ApiTreeSelect',
      componentProps: {
        allowClear: false,
        api: selectAllCmsColumnApi,
        afterFetch: (res: TreeNodeModel[]) => {
          const treeNodes: TreeNode[] = [];
          res.forEach((item: TreeNodeModel) => {
            const { id, parentId, title } = item;
            treeNodes.push({
              id,
              parentId,
              label: title,
              value: id,
              key: id,
            });
          });
          return listToTree(treeNodes);
        },
      },
      rules: 'selectRequired',
    },
    {
      fieldName: 'cover',
      label: '封面',
      component: 'Cropper',
      componentProps: {
        alt: '封面',
        aspectRatio: 16 / 9,
        circled: false,
        ruleKey: 'cms-media-image',
        width: 200,
      },
    },
    {
      fieldName: 'author',
      label: '作者',
      component: 'Input',
      rules: z.string().max(64, { message: '作者不能超过64个字符' }).optional(),
    },
    {
      fieldName: 'source',
      label: '来源',
      component: 'Input',
      rules: z
        .string()
        .max(128, { message: '来源不能超过128个字符' })
        .optional(),
    },
    {
      fieldName: 'tags',
      label: '标签',
      component: 'Select',
      componentProps: {
        mode: 'tags',
        tokenSeparators: [','],
        placeholder: '输入后回车添加标签',
        class: 'w-full',
      },
      rules: z.array(z.string()).optional(),
    },
    {
      fieldName: 'keyword',
      label: '关键字',
      component: 'Input',
      rules: z
        .string()
        .max(255, { message: '关键字不能超过255个字符' })
        .optional(),
    },
    {
      fieldName: 'description',
      label: 'SEO描述',
      component: 'Textarea',
      componentProps: {
        autoSize: { minRows: 2, maxRows: 4 },
      },
      rules: z
        .string()
        .max(500, { message: 'SEO描述不能超过500个字符' })
        .optional(),
    },
    {
      fieldName: 'offlineDate',
      label: '下线时间',
      component: 'DatePicker',
      componentProps: {
        showTime: true,
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
    },
  ],
});

async function handleSubmit(callback: (res: CmsArticle) => any) {
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
    const tags = stringifyTags(metaValues.tags as string[] | undefined);
    if (tags.length > 255) {
      message.warning('标签不能超过255个字符');
      return;
    }
    drawerApi.lock();
    const res = await saveCmsArticleApi({
      ...mainValues,
      ...metaValues,
      tags,
    } as CmsArticle);
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
    addCmsArticleApi().then((data) => {
      const formValues = toFormValues(data);
      mainFormApi.setValues(formValues);
      metaFormApi.setValues(formValues);
    });
  });
}

const [Drawer, drawerApi] = useVbenDrawer({
  onOpenChange: async (isOpen: boolean) => {
    if (isOpen) {
      const data = drawerApi.getData<Record<string, any>>();
      const formValues = toFormValues(data);
      await Promise.all([mainFormApi.resetForm(), metaFormApi.resetForm()]);
      await Promise.all([
        mainFormApi.setValues(formValues),
        metaFormApi.setValues(formValues),
      ]);
    }
  },
});
</script>

<template>
  <Drawer class="w-[1440px]" title="文章信息">
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
          :auth-codes="['cms:article:save']"
          :loading="saveBtnLoading"
          @click="handleSave" />
        <ButtonSave
          :auth-codes="['cms:article:save']"
          :loading="saveBtnLoading"
          text="保存并新增"
          @click="handleSaveAndAdd" />
      </Space>
    </template>
  </Drawer>
</template>
