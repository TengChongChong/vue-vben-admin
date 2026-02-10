<script setup lang="ts">
import type { FileInfo } from '#/api';

import { onMounted, ref } from 'vue';

import { JsonViewer, Page } from '@vben/common-ui';

import { Card, Col, Row } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { currentUserApi } from '#/api';
import { RuleUpload } from '#/components/upload';

const avatar = ref<FileInfo>();
const avatarCircledCustomSize = ref<FileInfo>();

const [BaseForm, baseFormApi] = useVbenForm({
  schema: [
    {
      component: 'RuleUpload',
      componentProps: {
        ruleKey: 'default-image',
      },
      fieldName: 'avatar',
      label: '头像',
    },
  ],
});

onMounted(() => {
  currentUserApi().then((data) => {
    avatarCircledCustomSize.value = data.avatar;
    baseFormApi.setValues({ avatar: data.avatar });
  });
});
</script>

<template>
  <Page
    description="基于Ant Design Vue 的 Upload 封装，rule 为后端配置的文件上传策略"
    title="Upload - 文件上传"
  >
    <Row :gutter="16">
      <Col :xl="24" :xxl="12">
        <Card
          :bordered="false"
          class="mb-4"
          title="根据文件上传策略上传文件 - Text"
        >
          <RuleUpload v-model:value="avatar" rule-key="default-image" />
          <div v-if="avatar" class="mb-2">
            <JsonViewer :value="avatar" copyable :sort="false" boxed />
          </div>
        </Card>

        <Card
          :bordered="false"
          class="mb-4"
          title="根据文件上传策略上传文件 - Picture"
        >
          <RuleUpload
            v-model:value="avatar"
            :show-help-text="true"
            list-type="picture"
            rule-key="default-image"
          />
          <div v-if="avatar" class="mb-2">
            <JsonViewer :value="avatar" copyable :sort="false" boxed />
          </div>
        </Card>

        <Card
          :bordered="false"
          class="mb-4"
          title="根据文件上传策略上传文件 - Picture Card"
        >
          <RuleUpload
            v-model:value="avatar"
            :show-help-text="true"
            list-type="picture-card"
            rule-key="default-image"
          />
          <div v-if="avatar" class="mb-2">
            <JsonViewer :value="avatar" copyable :sort="false" boxed />
          </div>
        </Card>
      </Col>
      <Col :xl="24" :xxl="12">
        <Card :bordered="false" class="mb-4" title="根据文件上传策略上传文件">
          <RuleUpload
            use-dragger
            v-model:value="avatar"
            :show-help-text="true"
            list-type="picture-card"
            rule-key="default-image"
          />
          <div v-if="avatar" class="mb-2">
            <JsonViewer :value="avatar" copyable :sort="false" boxed />
          </div>
        </Card>
        <Card :bordered="false" title="在表单中使用">
          <BaseForm />
        </Card>
      </Col>
    </Row>
  </Page>
</template>

<style scoped></style>
