<script lang="ts" setup>
import type { SysDataSource } from '#/api/sys/model/sys-data-source-model';

import { ref } from 'vue';

import { useVbenModal, z } from '@vben/common-ui';

import { message, Space } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { addApi, saveApi } from '#/api/sys/sys-data-source';
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
      label: '数据源名称',
      component: 'Input',
      rules: z
        .string()
        .min(1, { message: '请输入数据源名称' })
        .max(64, { message: '数据源名称最多输入64个字符' }),
      description: '例如：easy-vben、slave_1、data_source_order',
    },
    {
      fieldName: 'url',
      label: 'Url',
      component: 'Textarea',
      componentProps: {
        autoSize: {
          minRows: 2,
          maxRows: 7,
        },
      },
      rules: z
        .string()
        .min(1, { message: '请输入Url' })
        .max(900, { message: 'Url最多输入900个字符' }),
      description:
        '数据库连接地址，一般由数据库名、Ip、端口、参数等组成，例如：jdbc:mariadb://localhost:3306/easy-vben',
    },
    {
      fieldName: 'username',
      label: '账号',
      component: 'Input',
      rules: z
        .string()
        .min(1, { message: '请输入账号' })
        .max(128, { message: '账号最多输入128个字符' }),
      description: '数据库账号',
    },
    {
      fieldName: 'password',
      label: '密码',
      component: 'InputPassword',
      componentProps: {
        autocomplete: 'new-password',
      },
      rules: z
        .string()
        .min(1, { message: '请输入密码' })
        .max(128, { message: '密码最多输入128个字符' }),
      description: '数据库密码',
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

async function handleSubmit(callback: (res: SysDataSource) => any) {
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
  await handleSubmit(() => {
    addApi().then((res) => {
      baseFormApi.resetForm();
      baseFormApi.setValues(res);
    });
  });
}

const [Modal, modalApi] = useVbenModal({
  onOpenChange: async (isOpen: boolean) => {
    if (isOpen) {
      // 打开时根据id获取详情
      const data = modalApi.getData<Record<string, any>>();
      await baseFormApi.setValues(data);
    }
  },
});
</script>
<template>
  <Modal class="w-[600px]" title="数据源信息">
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
