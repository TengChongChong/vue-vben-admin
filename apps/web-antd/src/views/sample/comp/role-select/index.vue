<script setup lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Card, Col, Descriptions, DescriptionsItem, Row } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { RoleSelect } from '#/components/role';

defineComponent({
  name: 'SampleCompRoleSelectIndex',
});

const roleId = ref<string>('1531819854540070914');
const roleIds = ref<string[]>(['3', '1531819854540070914']);

async function onSubmit(values: Record<string, any>) {
  console.log('form values:', values);
}

const [BaseForm, baseFormApi] = useVbenForm({
  handleSubmit: onSubmit,
  schema: [
    {
      fieldName: 'roleSelect',
      label: '选择角色',
      component: 'RoleSelect',
      componentProps: {
        placeholder: '请选择角色',
      },
    },
    {
      fieldName: 'roleSelectMultiple',
      label: '选择角色 - 多选',
      component: 'RoleSelect',
      componentProps: {
        mode: 'multiple',
        placeholder: '请选择角色',
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
            title="RoleSelect - 角色选择器"
          >
            <DescriptionsItem label="选择角色">
              <RoleSelect v-model:value="roleId" />
            </DescriptionsItem>
            <DescriptionsItem label="选择角色 - 多选">
              <RoleSelect v-model:value="roleIds" mode="multiple" />
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
