<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';

import { Card, message, Space } from 'ant-design-vue';

import { useVbenForm, z } from '#/adapter/form';
import { addApi, getApi, saveApi } from '#/api/sys/sys-message';
import { ButtonSave } from '#/components/button';

const props = defineProps<{ id?: string }>();

const saveBtnLoading = ref(false);

const [BaseForm, baseFormApi] = useVbenForm({
  showDefaultActions: false,
  schema: [
    { fieldName: 'id', component: 'Input', formItemClass: 'hidden' },
    { fieldName: 'version', component: 'Input', formItemClass: 'hidden' },
    {
      component: 'UserSelect',
      componentProps: {
        placeholder: '输入用户名、昵称或部门名称搜索',
        mode: 'multiple',
      },
      fieldName: 'receivers',
      label: '收信人',
      rules: 'selectRequired',
    },
    {
      component: 'Input',
      componentProps: { placeholder: '请输入标题' },
      fieldName: 'title',
      label: '标题',
      rules: z
        .string()
        .min(1, { message: '请输入标题' })
        .max(255, { message: '最多输入255个字符' }),
    },
    {
      component: 'DictRadio',
      componentProps: { dictType: 'messageType' },
      fieldName: 'type',
      label: '类型',
      rules: 'selectRequired',
    },
    {
      component: 'DictRadio',
      componentProps: { dictType: 'whether' },
      fieldName: 'important',
      label: '重要',
      rules: 'selectRequired',
    },
    {
      component: 'Editor',
      fieldName: 'content',
      label: '内容',
    },
  ],
});

onMounted(() => {
  initPage();
});

watch(
  () => props.id,
  () => {
    initPage();
  },
);

/**
 * 初始化数据
 */
async function initPage() {
  const data = await (props.id ? getApi(props.id) : addApi());
  baseFormApi.setValues({ ...data });
}

async function handleSubmit() {
  try {
    saveBtnLoading.value = true;
    const { valid } = await baseFormApi.validate();
    if (!valid) {
      return;
    }
    await saveApi(await baseFormApi.getValues());
    message.success('保存成功');
  } catch (error) {
    console.error('保存失败', error);
  } finally {
    saveBtnLoading.value = false;
  }
}
</script>

<template>
  <Card :bordered="false" title="写消息">
    <div class="form-wrapper">
      <BaseForm />

      <div class="text-center">
        <Space>
          <ButtonSave :loading="saveBtnLoading" @click="handleSubmit" />
        </Space>
      </div>
    </div>
  </Card>
</template>

<style lang="scss" scoped>
.form-wrapper {
  //max-width: 800px;
}
</style>
