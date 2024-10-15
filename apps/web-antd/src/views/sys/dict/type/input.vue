<script lang="ts" setup>
import type { SysDictType } from '#/api/sys/model/sysDictTypeModel';

import { ref } from 'vue';

import { useAccess } from '@vben/access';
import { useVbenModal, z } from '@vben/common-ui';

import { message, Space } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { saveApi } from '#/api/sys/sysDictType';
import { ButtonClose, ButtonSave } from '#/components/button';
import { RoleEnum } from '#/enums/roleEnum';

const emit = defineEmits(['success']);

const { hasAccessByRoles } = useAccess();

const saveBtnLoading = ref(false);

const [BaseForm, baseFormApi] = useVbenForm({
  showDefaultActions: false,
  schema: [
    { fieldName: 'id', component: 'Input', formItemClass: 'hidden' },
    { fieldName: 'version', component: 'Input', formItemClass: 'hidden' },
    {
      fieldName: 'type',
      label: '类型',
      component: 'Input',
      required: true,
      rules: z
        .string()
        .min(1, { message: '请输入类型' })
        .max(32, { message: '类型最多输入32个字符' }),
    },
    {
      fieldName: 'name',
      label: '名称',
      component: 'Input',
      required: true,
      rules: z
        .string()
        .min(1, { message: '请输入名称' })
        .max(32, { message: '名称最多输入32个字符' }),
    },
    {
      fieldName: 'sys',
      label: '是否系统',
      component: 'DictRadio',
      componentProps: {
        dictType: 'whether',
      },
      ifShow: () => {
        return hasAccessByRoles([RoleEnum.SYS_ADMIN]);
      },
      rules: 'selectRequired',
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

async function handleSubmit(callback: (res: SysDictType) => any) {
  try {
    saveBtnLoading.value = true;
    const { valid } = await baseFormApi.validate();
    if (!valid) {
      return;
    }
    const res = await saveApi(await baseFormApi.getValues());
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
    modalApi.close();
  });
}

async function handleSaveAndAdd() {
  await handleSubmit((res) => {
    baseFormApi.resetForm();
    const { category, type, sys } = res;
    baseFormApi.setValues({ category, type, sys });
  });
}

const [Modal, modalApi] = useVbenModal({
  onOpenChange: async (isOpen: boolean) => {
    if (isOpen) {
      // 打开时根据id获取详情
      const data = modalApi.getData<Record<string, any>>();
      await baseFormApi.setValues(data);
      if (data.dictType) {
        await changeDictType(data.dictType);
      }
    }
  },
});
</script>
<template>
  <Modal class="w-[600px]" title="字典类型信息">
    <BaseForm />

    <template #footer>
      <Space>
        <ButtonClose @click="modalApi.close()" />
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
