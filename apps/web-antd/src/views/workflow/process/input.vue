<script lang="ts" setup>
import type { TreeNode } from '#/api/base/model/tree-model';
import type { WorkflowProcess } from '#/api/workflow/model/workflow-process-model';

import { ref } from 'vue';

import { useVbenModal, z } from '@vben/common-ui';
import { listToTree } from '@vben/utils';

import { message, Space } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { selectAllApi } from '#/api/workflow/workflow-category';
import { convertToModelApi } from '#/api/workflow/workflow-process';
import { ButtonClose, ButtonSave } from '#/components/button';

const emit = defineEmits(['success']);

const saveBtnLoading = ref(false);

const [BaseForm, baseFormApi] = useVbenForm({
  showDefaultActions: false,
  schema: [
    { fieldName: 'id', component: 'Input', formItemClass: 'hidden' },
    {
      fieldName: 'processDefinitionId',
      component: 'Input',
      formItemClass: 'hidden',
    },
    { fieldName: 'version', component: 'Input', formItemClass: 'hidden' },
    {
      fieldName: 'category',
      label: '所属分类',
      component: 'ApiTreeSelect',
      componentProps: {
        api: selectAllApi,
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
      fieldName: 'name',
      label: '流程名称',
      component: 'Input',
      rules: z
        .string()
        .min(1, { message: '请输入流程名称' })
        .max(32, { message: '流程名称最多输入32个字符' }),
    },
    {
      fieldName: 'key',
      label: '流程标识',
      component: 'Input',
      rules: z
        .string()
        .min(1, { message: '请输入流程标识' })
        .max(32, { message: '流程标识最多输入32个字符' }),
      description: '流程标识不可重复',
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

async function handleSave() {
  try {
    saveBtnLoading.value = true;
    const { valid } = await baseFormApi.validate();
    if (!valid) {
      return;
    }
    const values: WorkflowProcess = await baseFormApi.getValues();
    await convertToModelApi(values);
    message.success('保存成功');
    await ModalApi.close();
    emit('success');
  } catch (error) {
    console.error('保存失败', error);
  } finally {
    saveBtnLoading.value = false;
  }
}

const [Modal, ModalApi] = useVbenModal({
  onOpenChange: async (isOpen: boolean) => {
    if (isOpen) {
      // 打开时根据id获取详情
      const data = ModalApi.getData<Record<string, any>>();
      await baseFormApi.resetForm();
      await baseFormApi.setValues(data);
    }
  },
});
</script>
<template>
  <Modal class="w-[600px]" title="新增流程模型">
    <BaseForm />

    <template #footer>
      <Space>
        <ButtonClose @click="ModalApi.close()" />
        <ButtonSave :loading="saveBtnLoading" @click="handleSave" />
      </Space>
    </template>
  </Modal>
</template>
