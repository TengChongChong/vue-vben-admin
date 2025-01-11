<script lang="ts" setup>
import type { SysDict } from '#/api/sys/model/sys-dict-model';

import { ref } from 'vue';

import { useVbenModal, z } from '@vben/common-ui';

import { message, Space } from 'ant-design-vue';
import { isArray } from 'lodash-es';

import { useVbenForm } from '#/adapter/form';
import { addApi, saveApi } from '#/api/sys/sys-dict';
import { selectAllApi } from '#/api/sys/sys-dict-type';
import { ButtonClose, ButtonSave } from '#/components/button';

const emit = defineEmits(['success']);

const saveBtnLoading = ref(false);

/**
 * 更改字典类型
 *
 * @param dictType 字典类型
 * @param cleanParentCode 是否清空上级字典
 */
async function changeDictType(
  dictType: string,
  cleanParentCode: boolean = true,
) {
  // 更新上级字典
  baseFormApi.updateSchema([
    {
      fieldName: 'parentCode',
      componentProps: {
        dictType,
      },
    },
  ]);

  if (cleanParentCode) {
    // 清空值
    await baseFormApi.setFieldValue('parentCode', []);
  }
}

const [BaseForm, baseFormApi] = useVbenForm({
  showDefaultActions: false,
  schema: [
    { fieldName: 'id', component: 'Input', formItemClass: 'hidden' },
    { fieldName: 'version', component: 'Input', formItemClass: 'hidden' },
    {
      fieldName: 'dictType',
      label: '字典类型',
      component: 'ApiSelect',
      componentProps: {
        api: selectAllApi,
        onChange(value) {
          changeDictType(value);
        },
      },
      rules: 'required',
    },
    {
      fieldName: 'parentCode',
      label: '上级字典',
      component: 'DictCascader',
      componentProps: {
        dictType: '',
      },
    },
    {
      fieldName: 'code',
      label: '字典编码',
      component: 'Input',
      rules: z
        .string()
        .min(1, { message: '请输入字典编码' })
        .max(64, { message: '字典编码最多输入64个字符' }),
      description: '建议使用字母 / 数字，同一字典类型下字典编码不可重复',
    },
    {
      fieldName: 'name',
      label: '字典名称',
      component: 'Input',
      rules: z
        .string()
        .min(1, { message: '请输入字典名称' })
        .max(64, { message: '字典名称最多输入64个字符' }),
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
      fieldName: 'color',
      label: '标签色',
      component: 'DictSelect',
      componentProps: {
        dictType: 'tagColor',
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
        .max(900, { message: '备注最多输入900个字符' })
        .optional(),
    },
  ],
});

async function handleSubmit(callback: (res: SysDict) => any) {
  try {
    saveBtnLoading.value = true;
    const { valid } = await baseFormApi.validate();
    if (!valid) {
      return;
    }
    const values = await baseFormApi.getValues();
    const parentCode: string =
      values && isArray(values.parentCode) && values.parentCode?.length
        ? values.parentCode[values.parentCode.length - 1]
        : '';
    const res = await saveApi({
      ...values,
      parentCode,
    });
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
    addApi(res.parentId, res.dictType).then((res) => {
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
      if (data.dictType) {
        await changeDictType(data.dictType, false);
      }
    }
  },
});
</script>
<template>
  <Modal class="w-[600px]" title="字典信息">
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
