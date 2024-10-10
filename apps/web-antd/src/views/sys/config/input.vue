<script lang="ts" setup>
import type { SysConfig } from '#/api/sys/model/sysConfigModel';

import { ref } from 'vue';

import { useVbenModal, z } from '@vben/common-ui';

import { Space } from 'ant-design-vue';

import { useVbenForm } from '#/adapter';
import { getApi, saveApi } from '#/api/sys/sysConfig';
import { ButtonClose, ButtonSave } from '#/components/button';

const emit = defineEmits(['success']);

const saveBtnLoading = ref(false);

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
      itemProps: { validateTrigger: 'blur' },
    },
    {
      fieldName: 'type',
      label: '类型',
      component: 'DictRadio',
      componentProps: {
        dictType: 'dataType',
      },
      onChange: (value) => {
        setInputComponent(value);
      },
      rules: 'required',
      itemProps: { validateTrigger: 'blur' },
    },
    {
      fieldName: 'sysKey',
      label: 'Key',
      component: 'Input',
      rules: z
        .string()
        .min(1, { message: '请输入Key' })
        .max(32, { message: '最多输入32个字符' }),
      itemProps: {
        extra: 'Key不可重复',
      },
    },
    {
      fieldName: 'value',
      label: 'Value',
      component: 'Input',
      rules: z
        .string()
        .min(1, { message: '请输入Value' })
        .max(255, { message: '最多输入255个字符' }),
    },
    {
      fieldName: 'sys',
      label: '是否系统',
      rules: 'selectRequired',
      // auth: RoleEnum.SYS_ADMIN,
      component: 'DictRadio',
      componentProps: {
        dictType: 'whether',
      },
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
        .min(1, { message: '请输入备注' })
        .max(900, { message: '最多输入900个字符' })
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
    }
  }
}

async function handleSubmit(callback: (res: SysConfig) => any) {
  const data = await baseFormApi.getValues();
  try {
    saveBtnLoading.value = true;
    const res = await saveApi(data);
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

async function loadInfo(id: string) {
  try {
    modalApi.setLoading(true);
    const info = await getApi(id);
    setInputComponent(info.type);
    baseFormApi.setValues(info);
  } catch (error) {
    console.error('获取详情失败', error);
  } finally {
    modalApi.setLoading(false);
  }
}

async function handleAdd({ category, type, sys }) {
  baseFormApi.setValues({
    category,
    type: type || 'text',
    sys: sys || '0',
  });
  setInputComponent(type);
}

const [Modal, modalApi] = useVbenModal({
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      // 打开时根据id获取详情
      const { id, category, type, sys } =
        modalApi.getData<Record<string, any>>();
      if (id) {
        loadInfo(id);
      } else {
        handleAdd({ category, type, sys });
      }
    }
  },
});
</script>
<template>
  <Modal class="w-[600px]" title="系统参数">
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
