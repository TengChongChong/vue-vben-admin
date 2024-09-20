<script setup lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import {
  Card,
  Col,
  Descriptions,
  DescriptionsItem,
  Row,
  Tag,
} from 'ant-design-vue';

import { useVbenForm } from '#/adapter';
import { DeptSelect, DeptTree } from '#/components/dept';

defineComponent({
  name: 'SampleCompDeptSelectIndex',
});

const deptId = ref<string>('1531875536031301633');
const deptIds = ref<string[]>(['1', '1531875430343229442']);
const deptTree = ref<string[]>(['1531875430343229442']);

async function onSubmit(values: Record<string, any>) {
  console.log('form values:', values);
}

const [BaseForm, baseFormApi] = useVbenForm({
  handleSubmit: onSubmit,
  schema: [
    {
      fieldName: 'deptSelect',
      label: '选择部门',
      component: 'DeptSelect',
      componentProps: {
        placeholder: '请选择部门',
      },
    },
    {
      fieldName: 'deptSelectMultiple',
      label: '选择部门 - 多选',
      component: 'DeptSelect',
      componentProps: {
        multiple: true,
        placeholder: '请选择部门',
      },
    },
  ],
});

onMounted(() => {
  baseFormApi.setValues({});
});
</script>

<template>
  <Page>
    <Row :gutter="16">
      <Col :lg="24" :xl="12">
        <Card :bordered="false" class="mb-4" title="基础示例">
          <Descriptions
            :column="1"
            :label-style="{ width: '150px' }"
            bordered
            class="mb-6"
            title="DeptSelect - 部门选择器"
          >
            <DescriptionsItem label="选择部门">
              <DeptSelect v-model:value="deptId" />
            </DescriptionsItem>
            <DescriptionsItem label="选择部门 - 多选">
              <DeptSelect v-model:value="deptIds" :multiple="true" />
            </DescriptionsItem>
          </Descriptions>
        </Card>

        <Card :bordered="false" title="DeptTree">
          <Tag :bordered="false" class="mb-2">SelectKey： {{ deptTree }}</Tag>

          <DeptTree v-model:value="deptTree" />
        </Card>
      </Col>
      <Col :xl="24" :xxl="12">
        <Card :bordered="false" class="mb-4" title="在表单中使用">
          <BaseForm />
        </Card>
      </Col>
    </Row>
  </Page>
</template>

<style scoped></style>
