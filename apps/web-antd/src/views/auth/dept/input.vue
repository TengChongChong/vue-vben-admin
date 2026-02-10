<script lang="ts" setup>
import type { SysDept, TreeNode } from '#/api';

import { ref } from 'vue';

import { useVbenDrawer, z } from '@vben/common-ui';
import { listToTree } from '@vben/utils';

import { Space } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import {
  addSysDeptApi,
  saveSysDeptApi,
  selectAllDeptTypeApi,
  selectAllSysDeptApi,
} from '#/api';
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
      label: '上级部门',
      component: 'ApiTreeSelect',
      componentProps: {
        api: selectAllSysDeptApi,
        afterFetch: (res) => {
          const treeNodes: TreeNode[] = [] as TreeNode[];
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
      fieldName: 'typeCode',
      label: '部门类型',
      component: 'ApiTreeSelect',
      componentProps: {
        api: selectAllDeptTypeApi,
        afterFetch: (res) => {
          const treeNodes: TreeNode[] = [] as TreeNode[];
          res.forEach((item) => {
            const { id, key, parentId, title } = item;
            treeNodes.push({
              id,
              parentId,
              label: title,
              value: key,
              key,
            });
          });
          return listToTree(treeNodes);
        },
      },
      rules: 'selectRequired',
    },
    {
      fieldName: 'name',
      label: '部门名称',
      component: 'Input',
      rules: z
        .string()
        .min(1, { message: '请输入部门名称' })
        .max(32, { message: '部门名称不能超过32个字符' }),
    },
    {
      fieldName: 'simpleName',
      label: '部门简称',
      component: 'Input',
      rules: z
        .string()
        .max(32, { message: '部门简称不能超过32个字符' })
        .optional(),
    },
    {
      fieldName: 'code',
      label: '部门编码',
      component: 'Input',
      rules: z
        .string()
        .max(32, { message: '部门编码不能超过32个字符' })
        .optional(),
      description: '部门唯一标识',
    },
    {
      fieldName: 'orderNo',
      label: '排序值',
      component: 'InputNumber',
      rules: z
        .number()
        .min(0, { message: '排序值不能小于0' })
        .max(999, { message: '排序值不能大于999' }),
      description: '按升序排列，数字越小越靠前',
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

async function handleSubmit(callback: (res: SysDept) => any) {
  try {
    saveBtnLoading.value = true;
    const { valid } = await baseFormApi.validate();
    if (!valid) {
      return;
    }
    const res = await saveSysDeptApi(await baseFormApi.getValues());
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
  await handleSubmit((res) => {
    baseFormApi.resetForm();
    const { parentId, typeCode } = res;
    addSysDeptApi(parentId, typeCode).then((data) => {
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
  <Drawer class="w-[600px]" title="部门信息">
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
