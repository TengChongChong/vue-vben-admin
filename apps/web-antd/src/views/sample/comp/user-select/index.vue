<script setup lang="ts">
import { useVbenForm } from '#/adapter/form';
import { UserSelect } from '#/components/user';
import { Page } from '@vben/common-ui';
import { Card, Col, Descriptions, DescriptionsItem, Row } from 'ant-design-vue';
import { defineComponent, onMounted, ref } from 'vue';

defineComponent({
  name: 'SampleCompUserSelectIndex',
});

const userId = ref<string>();
const userIds = ref<string[]>();

async function onSubmit(values: Record<string, any>) {
  console.log('form values:', values);
}

const [BaseForm, baseFormApi] = useVbenForm({
  handleSubmit: onSubmit,
  schema: [
    {
      fieldName: 'userSelect',
      label: '选择用户',
      component: 'UserSelect',
      componentProps: {
        placeholder: '请选择用户',
      },
    },
    {
      fieldName: 'userSelectMultiple',
      label: '选择用户 - 多选',
      component: 'UserSelect',
      componentProps: {
        mode: 'multiple',
        placeholder: '请选择用户',
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
        <Card :bordered="false" title="基础示例">
          <Descriptions
            :column="1"
            :label-style="{ width: '150px' }"
            bordered
            class="mb-6"
            title="UserSelect - 用户选择器"
          >
            <DescriptionsItem label="选择用户">
              <UserSelect v-model:value="userId" />
            </DescriptionsItem>
            <DescriptionsItem label="选择用户 - 多选">
              <UserSelect v-model:value="userIds" mode="multiple" />
            </DescriptionsItem>
          </Descriptions>
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
