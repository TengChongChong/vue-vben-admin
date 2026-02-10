<script lang="ts" setup>
import type { SysConfig } from '#/api';

import { ref } from 'vue';

import { useAccess } from '@vben/access';
import { useVbenModal, z } from '@vben/common-ui';

import { message, Space } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { saveSysConfigApi } from '#/api';
import { ButtonClose, ButtonSave } from '#/components/button';
import { RoleEnum } from '#/enums/roleEnum';

const emit = defineEmits(['success']);

const saveBtnLoading = ref(false);

const { hasAccessByRoles } = useAccess();

const [BaseForm, baseFormApi] = useVbenForm({
  showDefaultActions: false,
  schema: [
    { fieldName: 'id', component: 'Input', formItemClass: 'hidden' },
    { fieldName: 'version', component: 'Input', formItemClass: 'hidden' },
    {
      fieldName: 'category',
      label: '所属分类',
      component: 'DictRadio',
      componentProps: {
        dictType: 'configCategory',
      },
      rules: 'required',
      description: '建议根据业务分类，方便管理',
    },
    {
      fieldName: 'type',
      label: '类型',
      component: 'DictRadio',
      componentProps: {
        dictType: 'dataType',
        onChange: (value) => {
          setInputComponent(value);
        },
      },
      rules: 'required',
    },
    {
      fieldName: 'sysKey',
      label: 'Key',
      component: 'Input',
      rules: z
        .string()
        .min(1, { message: '请输入Key' })
        .max(32, { message: 'Key最多输入32个字符' }),
      description: 'Key不可重复',
    },
    {
      fieldName: 'value',
      label: 'Value',
      component: 'Input',
      rules: z
        .string()
        .min(1, { message: '请输入Value' })
        .max(255, { message: 'Value最多输入255个字符' }),
    },
    {
      fieldName: 'sys',
      label: '是否系统',
      rules: 'selectRequired',
      component: 'DictRadio',
      componentProps: {
        dictType: 'whether',
      },
      formItemClass: hasAccessByRoles([RoleEnum.SYS_ADMIN]) ? '' : 'hidden',
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

/**
 * 根据类型切换 Value 组件
 * @param type
 */
function setInputComponent(type: string) {
  switch (type) {
    case 'boolean': {
      baseFormApi.updateSchema([
        {
          fieldName: 'value',
          component: 'DictRadio',
          componentProps: {
            dictType: 'boolean',
          },
          rules: 'selectRequired',
        },
      ]);
      break;
    }
    case 'number': {
      baseFormApi.updateSchema([
        {
          fieldName: 'value',
          component: 'InputNumber',
          rules: 'required',
        },
      ]);
      break;
    }
    case 'text': {
      baseFormApi.updateSchema([
        {
          fieldName: 'value',
          component: 'Input',
          rules: z
            .string()
            .min(1, { message: '请输入Value' })
            .max(255, { message: '最多输入255个字符' }),
        },
      ]);
    }
  }
}

async function handleSubmit(callback: (res: SysConfig) => any) {
  try {
    saveBtnLoading.value = true;
    const { valid } = await baseFormApi.validate();
    if (!valid) {
      return;
    }
    const res = await saveSysConfigApi(await baseFormApi.getValues());
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
      await baseFormApi.resetForm();
      await baseFormApi.setValues(data);
      setInputComponent(data.type);
    }
  },
});
</script>
<template>
  <Modal class="w-[600px]" title="系统参数信息">
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
