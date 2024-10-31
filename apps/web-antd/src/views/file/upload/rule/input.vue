<script lang="ts" setup>
import type { FileUploadRuleVO } from '#/api/file/model/fileUploadRuleModel';

import { ref, unref } from 'vue';

import { useVbenDrawer, z } from '@vben/common-ui';

import {
  FormItemRest,
  Input,
  InputGroup,
  InputNumber,
  message,
  Space,
} from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { addApi, saveApi } from '#/api/file/fileUploadRule';
import { ButtonClose, ButtonSave } from '#/components/button';

const emit = defineEmits(['success']);

const saveBtnLoading = ref(false);

const lowerLimit = ref(0);
const upperLimit = ref(0);

const [BaseForm, baseFormApi] = useVbenForm({
  showDefaultActions: false,
  schema: [
    { fieldName: 'id', component: 'Input', formItemClass: 'hidden' },
    { fieldName: 'version', component: 'Input', formItemClass: 'hidden' },
    {
      fieldName: 'category',
      label: '分类',
      component: 'DictSelect',
      componentProps: {
        dictType: 'sysFileUploadRuleCategory',
      },
      rules: 'selectRequired',
    },
    {
      fieldName: 'name',
      label: '名称',
      component: 'Input',
      rules: z
        .string()
        .min(1, { message: '请输入名称' })
        .max(32, { message: '名称最多输入32个字符' }),
    },
    {
      fieldName: 'slug',
      label: '别名',
      component: 'Input',
      rules: z
        .string()
        .min(1, { message: '请输入别名' })
        .max(32, { message: '别名最多输入32个字符' }),
      description: '上传规则标识，不可重复',
    },
    {
      fieldName: 'directory',
      label: '存储目录',
      component: 'Input',
      rules: z
        .string()
        .min(1, { message: '请输入存储目录' })
        .max(64, { message: '存储目录最多输入64个字符' }),
      description: '文件存放路径，如：easy-doc、easy-images',
    },
    {
      fieldName: 'fileSizeLimit',
      label: '文件大小',
      component: 'InputNumber',
      slot: 'fileSizeLimit',
      description: '允许上传的文件大小，单位 KB',
      rules: z.number().refine(
        () => {
          return lowerLimit.value !== null && upperLimit.value !== null;
        },
        {
          message: '请输入允许上传的文件大小',
        },
      ),
    },
    {
      fieldName: 'suffix',
      label: '文件拓展名',
      component: 'Textarea',
      componentProps: {
        autoSize: {
          minRows: 2,
          maxRows: 7,
        },
      },
      rules: z
        .string()
        .min(1, { message: '请输入文件拓展名' })
        .max(255, { message: '文件拓展名最多输入255个字符' }),
      description: '允许上传的文件后缀，多个使用 , 隔开，例如：jpg,png,gif',
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

async function handleSubmit(callback: (res: FileUploadRuleVO) => any) {
  try {
    saveBtnLoading.value = true;
    const { valid } = await baseFormApi.validate();
    if (!valid) {
      return;
    }
    const values: FileUploadRuleVO = await baseFormApi.getValues();
    const res = await saveApi({
      ...values,
      lowerLimit: unref(lowerLimit),
      upperLimit: unref(upperLimit),
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
    drawerApi.close();
  });
}

async function handleSaveAndAdd() {
  await handleSubmit(() => {
    baseFormApi.resetForm();
    addApi().then((res) => {
      lowerLimit.value = res.lowerLimit;
      upperLimit.value = res.upperLimit;
      baseFormApi.setValues(res);
    });
  });
}

const [Drawer, drawerApi] = useVbenDrawer({
  onOpenChange: async (isOpen: boolean) => {
    if (isOpen) {
      // 打开时根据id获取详情
      const data = drawerApi.getData<Record<string, any>>();
      await baseFormApi.setValues({
        ...data,
      });
      lowerLimit.value = data.lowerLimit;
      upperLimit.value = data.upperLimit;
    }
  },
});
</script>
<template>
  <Drawer class="w-[600px]" title="文件上传策略">
    <BaseForm>
      <template #fileSizeLimit>
        <InputGroup compact>
          <FormItemRest>
            <InputNumber
              id="inputNumber"
              v-model:value="lowerLimit"
              :max="Math.max(upperLimit - 1, 1)"
              :min="1"
              style="width: 120px"
            />

            <Input
              disabled
              placeholder="~"
              style="width: 30px; pointer-events: none; background-color: #fff"
            />
            <InputNumber
              id="inputNumber"
              v-model:value="upperLimit"
              :max="1048576"
              :min="Math.max(lowerLimit + 1, 1)"
              style="width: 120px"
            />
          </FormItemRest>
        </InputGroup>
      </template>
    </BaseForm>

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
