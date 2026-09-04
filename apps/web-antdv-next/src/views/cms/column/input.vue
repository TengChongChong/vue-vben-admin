<script lang="ts" setup>
import type { CmsColumn, TreeNode } from '#/api';

import { ref } from 'vue';

import { useVbenDrawer, z } from '@vben/common-ui';
import { listToTree } from '@vben/utils';

import { Space } from 'antdv-next';

import { useVbenForm } from '#/adapter/form';
import {
  addCmsColumnApi,
  saveCmsColumnApi,
  selectAllCmsColumnApi,
} from '#/api';
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
      fieldName: 'parentId',
      label: '上级栏目',
      component: 'ApiTreeSelect',
      componentProps: {
        allowClear: true,
        api: selectAllCmsColumnApi,
        afterFetch: (res) => {
          const treeNodes: TreeNode[] = [];
          res.forEach((item) => {
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
    },
    {
      fieldName: 'name',
      label: '栏目名称',
      component: 'Input',
      rules: z
        .string()
        .min(1, { message: '请输入栏目名称' })
        .max(32, { message: '栏目名称不能超过32个字符' }),
    },
    {
      fieldName: 'slug',
      label: '别名',
      component: 'Input',
      rules: z
        .string()
        .min(1, { message: '请输入别名' })
        .max(32, { message: '别名不能超过32个字符' })
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
          message: '别名仅允许小写字母、数字与连字符',
        }),
      description: '站点内唯一，用于 URL / 模板',
    },
    {
      fieldName: 'isRelease',
      label: '可发布文章',
      component: 'DictRadio',
      componentProps: {
        dictType: 'whether',
      },
      rules: 'selectRequired',
    },
    {
      fieldName: 'description',
      label: '描述',
      component: 'Textarea',
      componentProps: {
        autoSize: { minRows: 2, maxRows: 5 },
      },
      rules: z
        .string()
        .max(900, { message: '描述不能超过900个字符' })
        .optional(),
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
    {
      fieldName: 'orderNo',
      label: '排序值',
      component: 'InputNumber',
      rules: z
        .number()
        .min(0, { message: '排序值不能小于0' })
        .max(9999, { message: '排序值不能大于9999' })
        .optional(),
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

async function handleSubmit(callback: (res: CmsColumn) => any) {
  try {
    saveBtnLoading.value = true;
    const { valid } = await baseFormApi.validate();
    if (!valid) {
      return;
    }
    drawerApi.lock();
    const res = await saveCmsColumnApi(
      (await baseFormApi.getValues()) as CmsColumn,
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
  await handleSubmit((res) => {
    baseFormApi.reset();
    addCmsColumnApi(res.parentId).then((data) => {
      baseFormApi.setValues(data);
    });
  });
}

const [Drawer, drawerApi] = useVbenDrawer({
  onOpenChange: async (isOpen: boolean) => {
    if (isOpen) {
      const data = drawerApi.getData<Record<string, any>>();
      await baseFormApi.reset();
      await baseFormApi.setValues(data);
    }
  },
});
</script>

<template>
  <Drawer class="w-[600px]" title="栏目信息">
    <BaseForm />
    <template #footer>
      <Space>
        <ButtonClose @click="drawerApi.close()" />
        <ButtonSave
          :auth-codes="['cms:column:save']"
          :loading="saveBtnLoading"
          @click="handleSave" />
        <ButtonSave
          :auth-codes="['cms:column:save']"
          :loading="saveBtnLoading"
          text="保存并新增"
          @click="handleSaveAndAdd" />
      </Space>
    </template>
  </Drawer>
</template>
