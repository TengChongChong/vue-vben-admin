<script lang="ts" setup>
import type { CmsSite, TreeNode } from '#/api';

import { ref } from 'vue';

import { useVbenDrawer, z } from '@vben/common-ui';
import { listToTree } from '@vben/utils';

import { Space } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { addCmsSiteApi, saveCmsSiteApi, selectAllCmsSiteApi } from '#/api';
import { ButtonClose, ButtonSave } from '#/components/button';

const emit = defineEmits(['success']);

const saveBtnLoading = ref(false);

const [BaseForm, baseFormApi] = useVbenForm({
  showDefaultActions: false,
  schema: [
    { fieldName: 'id', component: 'Input', formItemClass: 'hidden' },
    { fieldName: 'version', component: 'Input', formItemClass: 'hidden' },
    {
      fieldName: 'parentId',
      label: '上级站点',
      component: 'ApiTreeSelect',
      componentProps: {
        allowClear: true,
        api: selectAllCmsSiteApi,
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
      label: '站点名称',
      component: 'Input',
      rules: z
        .string()
        .min(1, { message: '请输入站点名称' })
        .max(64, { message: '站点名称不能超过64个字符' }),
    },
    {
      fieldName: 'domainName',
      label: '域名',
      component: 'Input',
      rules: z
        .string()
        .min(1, { message: '请输入域名' })
        .max(255, { message: '域名不能超过255个字符' }),
    },
    {
      fieldName: 'deploymentPath',
      label: '部署路径',
      component: 'Input',
      rules: z
        .string()
        .min(1, { message: '请输入部署路径' })
        .max(255, { message: '部署路径不能超过255个字符' }),
      description: '静态站点输出目录，必须位于服务端 cms.deployment-root 配置的根目录下',
    },
    {
      fieldName: 'theme',
      label: '主题',
      component: 'Input',
      rules: z
        .string()
        .regex(/^[a-zA-Z0-9][a-zA-Z0-9_-]*$/, {
          message: '主题目录名仅允许字母、数字、下划线与连字符',
        })
        .max(32, { message: '主题不能超过32个字符' })
        .optional(),
      description: '主题目录名，位于 beetl.theme-root 下',
    },
    {
      fieldName: 'keyword',
      label: '关键字',
      component: 'Input',
      rules: z
        .string()
        .max(900, { message: '关键字不能超过900个字符' })
        .optional(),
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

async function handleSubmit(callback: (res: CmsSite) => any) {
  try {
    saveBtnLoading.value = true;
    const { valid } = await baseFormApi.validate();
    if (!valid) {
      return;
    }
    drawerApi.lock();
    const res = await saveCmsSiteApi(
      (await baseFormApi.getValues()) as CmsSite,
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
    baseFormApi.resetForm();
    addCmsSiteApi(res.parentId).then((data) => {
      baseFormApi.setValues(data);
    });
  });
}

const [Drawer, drawerApi] = useVbenDrawer({
  onOpenChange: async (isOpen: boolean) => {
    if (isOpen) {
      const data = drawerApi.getData<Record<string, any>>();
      await baseFormApi.resetForm();
      await baseFormApi.setValues(data);
    }
  },
});
</script>

<template>
  <Drawer class="w-[600px]" title="站点信息">
    <BaseForm />
    <template #footer>
      <Space>
        <ButtonClose @click="drawerApi.close()" />
        <ButtonSave
          :auth-codes="['cms:site:save']"
          :loading="saveBtnLoading"
          @click="handleSave" />
        <ButtonSave
          :auth-codes="['cms:site:save']"
          :loading="saveBtnLoading"
          text="保存并新增"
          @click="handleSaveAndAdd" />
      </Space>
    </template>
  </Drawer>
</template>
