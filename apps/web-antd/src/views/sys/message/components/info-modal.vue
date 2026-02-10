<script lang="ts" setup>
import type { SysMessage } from '#/api';

import { ref } from 'vue';

import { useVbenModal, VbenAvatar } from '@vben/common-ui';
import { preferences } from '@vben/preferences';

import { Divider, Space } from 'ant-design-vue';

import { ButtonClose } from '#/components/button';
import { formatToDateTime } from '#/util/date';

const messageInfo = ref<SysMessage>();

const [Modal, modalApi] = useVbenModal({
  onOpenChange: async (isOpen: boolean) => {
    if (isOpen) {
      // 打开时根据id获取详情
      messageInfo.value = modalApi.getData<Record<string, any>>();
    }
  },
});
</script>
<template>
  <Modal class="w-[1080px]" title="消息详情">
    <div class="message">
      <div class="message__title">
        <h3>{{ messageInfo?.title }}</h3>
      </div>
      <div class="message__property">
        <VbenAvatar
          :alt="messageInfo?.nickname"
          :size="40"
          :src="messageInfo?.avatar || preferences.app.defaultAvatar"
        />
        {{ messageInfo?.nickname }}

        <Divider type="vertical" />
        {{
          messageInfo?.sendDate
            ? formatToDateTime(messageInfo?.sendDate)
            : '草稿'
        }}
      </div>
      <Divider />
      <div class="message__content" v-html="messageInfo?.content"></div>
    </div>

    <template #footer>
      <Space>
        <ButtonClose @click="modalApi.close()" />
      </Space>
    </template>
  </Modal>
</template>
<style lang="scss" scoped>
.message {
  padding: 16px;

  .message__title {
    margin-bottom: 24px;
    font-size: 24px;
    font-weight: bold;
    text-align: center;
  }

  .message__property {
    text-align: center;
  }

  :deep(.message__content) {
    padding: 0 16px;

    .editor-media {
      display: inline-block;
    }

    h1 {
      @apply text-4xl;
      @apply font-bold;

      margin: 22px 0;
    }

    h2 {
      @apply text-3xl;
      @apply font-bold;

      margin: 20px 0;
    }

    h3 {
      @apply text-2xl;
      @apply font-bold;

      margin: 18px 0;
    }

    h4 {
      @apply text-xl;
      @apply font-semibold;

      margin: 16px 0;
    }

    h5 {
      @apply text-lg;
      @apply font-semibold;

      margin: 14px 0;
    }

    h6 {
      @apply text-sm;
      @apply font-semibold;

      margin: 12px 0;
    }
  }
}
</style>
