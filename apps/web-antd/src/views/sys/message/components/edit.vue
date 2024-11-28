<script setup lang="ts">
import { onMounted, watch } from 'vue';

import { Card } from 'ant-design-vue';

import { useVbenForm, z } from '#/adapter/form';
import { addApi, getApi } from '#/api/sys/sys-message';

const props = defineProps<{ id?: string }>();

const [BaseForm, baseFormApi] = useVbenForm({
  handleSubmit: onSubmit,
  schema: [
    {
      component: 'UserSelect',
      componentProps: { placeholder: '请选择收信人', mode: 'multiple' },
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
      rules: z
        .string()
        .max(40_000, { message: '最多输入4000个字符' })
        .nullable()
        .optional(),
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

async function onSubmit(values: Record<string, any>) {}
</script>

<template>
  <Card :bordered="false" title="写消息">
    <div class="form-wrapper">
      <BaseForm />
    </div>
  </Card>
</template>

<style lang="scss" scoped>
.form-wrapper {
  //max-width: 800px;
}
</style>
