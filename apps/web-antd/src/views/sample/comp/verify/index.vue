<script setup lang="ts">
import { ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';

import { Alert, Button, Card, Tag } from 'ant-design-vue';

import { SlideVerifyModal } from '#/components/verify';

const captchaVerification = ref<string>();

function handleVerifySuccess(code) {
  captchaVerification.value = code;
}

const [BaseModal, baseModalApi] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: SlideVerifyModal,
});

function openVerifyModal() {
  baseModalApi.open();
}
</script>

<template>
  <Page>
    <Card :bordered="false" title="滑块验证码">
      <Button @click="openVerifyModal">点击完成验证</Button>

      <br />
      <br />

      <template v-if="captchaVerification">
        <Alert
          class="mb-2"
          message="请将下方验证码传到后端进行二次验证"
          show-icon
        />
        <Tag :bordered="false">{{ captchaVerification }}</Tag>
      </template>
    </Card>

    <BaseModal @success="handleVerifySuccess" />
  </Page>
</template>

<style scoped></style>
