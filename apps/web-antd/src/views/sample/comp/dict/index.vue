<script setup lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Card, Col, Descriptions, DescriptionsItem, Row } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import {
  DictCascader,
  DictCheckbox,
  DictRadio,
  DictSelect,
  DictTag,
  DictTreeSelect,
} from '#/components/dict';

defineComponent({
  name: 'SampleCompDictIndex',
});

const sexValue = ref<string>('1');
const userStatusValue = ref<string>('2');
const sexArrayValue = ref<string[]>(['1']);
const userStatusArrayValue = ref<string[]>(['1', '2']);
const cascaderValue = ref<string[]>(['1', '1-1', '1-1-1']);
const multipleCascaderValue = ref([['1', '1-1', '1-1-2'], ['2']]);

const treeSelectValue = ref<string>('1');
const multipleTreeSelectValue = ref<string[]>(['1-2', '1-3']);

async function onSubmit(values: Record<string, any>) {
  console.log('form values:', values);
}

const [BaseForm, baseFormApi] = useVbenForm({
  handleSubmit: onSubmit,
  schema: [
    {
      fieldName: 'sexRadio',
      label: '性别',
      component: 'DictRadio',
      componentProps: {
        dictType: 'sex',
      },
    },
    {
      fieldName: 'userStatusRadio',
      label: '用户状态',
      component: 'DictRadio',
      componentProps: {
        dictType: 'userStatus',
      },
    },
    {
      fieldName: 'sexCheckbox',
      label: '性别',
      component: 'DictCheckbox',
      componentProps: {
        dictType: 'sex',
      },
    },
    {
      fieldName: 'userStatusCheckbox',
      label: '用户状态',
      component: 'DictCheckbox',
      componentProps: {
        dictType: 'userStatus',
      },
    },
    {
      fieldName: 'sexSelect',
      label: '性别',
      component: 'DictSelect',
      componentProps: {
        dictType: 'sex',
        placeholder: '请选择性别',
      },
    },
    {
      fieldName: 'userStatusSelect',
      label: '用户状态',
      component: 'DictSelect',
      componentProps: {
        dictType: 'userStatus',
        placeholder: '请选择用户状态',
      },
    },
    {
      fieldName: 'levelSampleCascader',
      label: '级联选择',
      component: 'DictCascader',
      componentProps: {
        dictType: 'levelSample',
        placeholder: '请选择级联选择',
      },
    },
    {
      fieldName: 'treeSelect',
      label: '树选择',
      component: 'DictTreeSelect',
      componentProps: {
        dictType: 'levelSample',
        placeholder: '请选择级联选择',
      },
    },
  ],
});

onMounted(() => {
  baseFormApi.setValues({
    sexRadio: '1',
    userStatusRadio: '1',
    sexCheckbox: ['1', '2'],
    userStatusCheckbox: ['1', '2'],
    sexSelect: '1',
    userStatusSelect: '1',
    levelSampleCascader: '1',
    treeSelect: '1',
  });
});
</script>

<template>
  <Page description="字典数据来源于系统管理 > 字典管理功能" title="字典 - Dict">
    <Row :gutter="16">
      <Col :lg="24" :xl="12">
        <Card :bordered="false" title="基础示例">
          <Descriptions
            :column="1"
            :label-style="{ width: '150px' }"
            bordered
            class="mb-6"
            title="DictTag - 名称"
          >
            <DescriptionsItem label="性别">
              <DictTag :use-tag="false" code="1" dict-type="sex" />、
              <DictTag :use-tag="false" code="2" dict-type="sex" />
            </DescriptionsItem>
            <DescriptionsItem label="用户状态">
              <DictTag :use-tag="false" code="1" dict-type="userStatus" />、
              <DictTag :use-tag="false" code="2" dict-type="userStatus" />、
              <DictTag :use-tag="false" code="0" dict-type="userStatus" />
            </DescriptionsItem>
            <DescriptionsItem label="性别">
              <DictTag code="1" dict-type="sex" />
              <DictTag :code="2" dict-type="sex" />
            </DescriptionsItem>
            <DescriptionsItem label="用户状态">
              <DictTag code="1" dict-type="userStatus" />
              <DictTag code="2" dict-type="userStatus" />
              <DictTag code="0" dict-type="userStatus" />
            </DescriptionsItem>
          </Descriptions>
          <Descriptions
            :column="1"
            :label-style="{ width: '150px' }"
            bordered
            class="mb-6"
            title="DictRadio - 单选框"
          >
            <DescriptionsItem label="性别">
              <DictRadio v-model:value="sexValue" dict-type="sex" />
            </DescriptionsItem>
            <DescriptionsItem label="用户状态">
              <DictRadio
                v-model:value="userStatusValue"
                dict-type="userStatus"
              />
            </DescriptionsItem>
          </Descriptions>
          <Descriptions
            :column="1"
            :label-style="{ width: '150px' }"
            bordered
            class="mb-6"
            title="DictCheckbox - 多选框"
          >
            <DescriptionsItem label="性别">
              <DictCheckbox v-model:value="sexArrayValue" dict-type="sex" />
            </DescriptionsItem>
            <DescriptionsItem label="用户状态">
              <DictCheckbox
                v-model:value="userStatusArrayValue"
                dict-type="userStatus"
              />
            </DescriptionsItem>
          </Descriptions>
          <Descriptions
            :column="1"
            :label-style="{ width: '150px' }"
            bordered
            class="mb-6"
            title="DictSelect - 选择器"
          >
            <DescriptionsItem label="性别">
              <DictSelect v-model:value="sexValue" dict-type="sex" />
            </DescriptionsItem>
            <DescriptionsItem label="用户状态 - 多选">
              <DictSelect
                v-model:value="userStatusArrayValue"
                dict-type="userStatus"
                mode="multiple"
              />
            </DescriptionsItem>
          </Descriptions>
          <Descriptions
            :column="1"
            :label-style="{ width: '150px' }"
            bordered
            class="mb-6"
            title="DictCascader - 级联选择"
          >
            <DescriptionsItem label="级联选择">
              <DictCascader
                v-model:value="cascaderValue"
                dict-type="levelSample"
              />
            </DescriptionsItem>
            <DescriptionsItem label="级联选择 - 多选">
              <DictCascader
                v-model:value="multipleCascaderValue"
                dict-type="levelSample"
                multiple
              />
            </DescriptionsItem>
          </Descriptions>
          <Descriptions
            :column="1"
            :label-style="{ width: '150px' }"
            bordered
            class="mb-6"
            title="DictTreeSelect - 树选择"
          >
            <DescriptionsItem label="树选择">
              <DictTreeSelect
                v-model:value="treeSelectValue"
                dict-type="levelSample"
              />
            </DescriptionsItem>
            <DescriptionsItem label="树选择 - 多选">
              <DictTreeSelect
                v-model:value="multipleTreeSelectValue"
                dict-type="levelSample"
                multiple
              />
            </DescriptionsItem>
          </Descriptions>
        </Card>
      </Col>
      <Col :xl="24" :xxl="12">
        <Card :bordered="false" class="mb-4" title="在表单中使用">
          <BaseForm />
        </Card>
        <Card :bordered="false" class="mb-4" title="在表格中使用">
          todo: 待实现
        </Card>
      </Col>
    </Row>
  </Page>
</template>

<style scoped></style>
