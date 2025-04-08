<script setup lang="ts">
import type { FileInfo } from '#/api/file/model/file-info-model';

import { onMounted, ref } from 'vue';

import { JsonViewer, Page } from '@vben/common-ui';

import { Card, Col, Row } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { currentUserApi } from '#/api/auth/sys-user-personal';
import { Cropper } from '#/components/cropper';

const avatar = ref<FileInfo>();
const avatarCircled = ref<FileInfo>();
const avatarCircledCustomSize = ref<FileInfo>();

const [BaseForm, baseFormApi] = useVbenForm({
  schema: [
    {
      component: 'Cropper',
      componentProps: { alt: '头像' },
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
    description="基于Cropper封装，Value为后端响应的FileInfo实体"
    title="Cropper - 图片裁剪"
  >
    <Row :gutter="16">
      <Col :xl="24" :xxl="12">
        <Card :bordered="false" class="mb-4" title="头像剪裁 - 方形">
          <Cropper v-model:value="avatar" :circled="false" alt="头像" />
          <div v-if="avatar" class="mb-2">
            <JsonViewer :value="avatar" copyable :sort="false" boxed />
          </div>
        </Card>
        <Card :bordered="false" class="mb-4" title="头像剪裁 - 圆形">
          <Cropper v-model:value="avatarCircled" alt="头像" />
          <div v-if="avatarCircled" class="mb-2">
            <JsonViewer :value="avatarCircled" copyable :sort="false" boxed />
          </div>
        </Card>

        <Card :bordered="false" title="头像剪裁 - 自定义尺寸">
          <Cropper
            v-model:value="avatarCircledCustomSize"
            :width="160"
            alt="头像"
          />
          <div v-if="avatarCircledCustomSize" class="mb-2">
            <JsonViewer
              :value="avatarCircledCustomSize"
              copyable
              :sort="false"
              boxed
            />
          </div>
        </Card>
      </Col>

      <Col :xl="24" :xxl="12">
        <Card :bordered="false" title="在表单中使用">
          <BaseForm />
        </Card>
      </Col>
    </Row>
  </Page>
</template>

<style scoped></style>
