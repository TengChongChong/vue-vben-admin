<script lang="ts" setup>
import type { FileUploadRuleVO } from '#/api/file/model/file-upload-rule-model';

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
import {
  addApi,
  getFileStorageListApi,
  saveApi,
} from '#/api/file/file-upload-rule';
import { ButtonClose, ButtonSave } from '#/components/button';

const emit = defineEmits(['success']);

const saveBtnLoading = ref(false);

const lowerLimit = ref(0);
const upperLimit = ref(0);

const maxWidth = ref(1000);
const maxHeight = ref(1000);

const [BaseForm, baseFormApi] = useVbenForm({
  showDefaultActions: false,
  schema: [
    { fieldName: 'id', component: 'Input', formItemClass: 'hidden' },
    { fieldName: 'version', component: 'Input', formItemClass: 'hidden' },
    {
      fieldName: 'category',
      label: '策略分类',
      component: 'DictSelect',
      componentProps: {
        dictType: 'sysFileUploadRuleCategory',
      },
      rules: 'selectRequired',
      description: '建议按业务类型对规则进行分类，以便统一管理与维护',
    },
    {
      fieldName: 'name',
      label: '策略名称',
      component: 'Input',
      rules: z
        .string()
        .min(1, { message: '请输入名称' })
        .max(32, { message: '名称最多输入32个字符' }),
    },
    {
      fieldName: 'ruleKey',
      label: '策略Key',
      component: 'Input',
      rules: z
        .string()
        .min(1, { message: '请输入Key' })
        .max(32, { message: 'Key最多输入32个字符' }),
      description:
        '上传规则标识用于前端调用规则，需保持唯一性（不可重复），例如：user-avatar',
    },
    {
      fieldName: 'platform',
      label: '存储平台',
      component: 'ApiSelect',
      componentProps: {
        api: getFileStorageListApi,
        afterFetch: (data) => {
          return data.map((item) => {
            return {
              label: item.platform,
              value: item.platform,
            };
          });
        },
      },
      rules: 'selectRequired',
      description:
        '存储平台的相关配置需在SpringBoot配置文件中dromara.x-file-storage进行设置',
    },
    {
      fieldName: 'accessControl',
      label: '访问控制',
      component: 'DictRadio',
      componentProps: {
        dictType: 'accessControl',
      },
      rules: 'selectRequired',
      description:
        '使用对象存储时，访问控制需与桶设置一致，文件会继承桶的访问控制规则',
    },
    {
      fieldName: 'directory',
      label: '存储目录',
      component: 'Input',
      rules: z
        .string()
        .min(1, { message: '请输入存储目录' })
        .max(64, { message: '存储目录最多输入64个字符' }),
      description:
        '文件的存放目录通常与 Key 保持一致，比如当存储目录为 “user-avatar” 时，文件会存放于名为 “user-avatar” 的目录下',
    },
    {
      fieldName: 'fileSizeLimit',
      label: '文件大小',
      component: 'InputNumber',
      slot: 'fileSizeLimit',
      description:
        '请依据实际业务场景，合理设置允许上传的文件大小上限，单位为 KB',
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
      description:
        '允许上传的文件后缀名（不区分大小写），多个后缀间以英文逗号 “,” 分隔，如：jpg,png,gif',
    },
    {
      fieldName: 'enableImageCompression',
      label: '图片自动压缩',
      component: 'DictRadio',
      componentProps: {
        dictType: 'commonStatus',
      },
      dependencies: {
        show(values) {
          return containImage(values.suffix);
        },
        triggerFields: ['suffix'],
      },
    },
    {
      fieldName: 'maxSize',
      label: '最大尺寸',
      component: 'InputNumber',
      slot: 'maxSize',
      description: '超出最大尺寸将自动压缩',
      dependencies: {
        show(values) {
          return values.enableImageCompression === '1';
        },
        triggerFields: ['enableImageCompression'],
      },
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
      maxWidth: unref(maxWidth),
      maxHeight: unref(maxHeight),
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
      // lowerLimit.value = res.lowerLimit;
      // upperLimit.value = res.upperLimit;
      // maxWidth.value = res.maxWidth;
      // maxHeight.value = res.maxHeight;
      baseFormApi.setValues(res);
    });
  });
}

const [Drawer, drawerApi] = useVbenDrawer({
  onOpenChange: async (isOpen: boolean) => {
    if (isOpen) {
      // 打开时根据id获取详情
      const data = drawerApi.getData<Record<string, any>>();
      await baseFormApi.resetForm();
      await baseFormApi.setValues({
        ...data,
      });
      lowerLimit.value = data.lowerLimit;
      upperLimit.value = data.upperLimit;
      maxWidth.value = data.maxWidth;
      maxHeight.value = data.maxHeight;
    }
  },
});

function containImage(suffix: string) {
  const suffixArray = suffix.split(',');
  return suffixArray.includes('jpg') || suffixArray.includes('jpeg');
}
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

      <template #maxSize>
        <InputGroup compact>
          <FormItemRest>
            <InputNumber
              v-model:value="maxWidth"
              :min="1"
              style="width: 120px"
            />

            <Input
              disabled
              placeholder=":"
              style="width: 30px; pointer-events: none; background-color: #fff"
            />
            <InputNumber
              v-model:value="maxHeight"
              :min="1"
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
