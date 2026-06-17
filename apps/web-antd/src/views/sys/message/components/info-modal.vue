<script lang="ts" setup>
import type { SysMessage } from '#/api';

import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Space } from 'ant-design-vue';

import { ButtonClose } from '#/components/button';

import MessageDetailPanel from './message-detail-panel.vue';

const messageInfo = ref<SysMessage>();

const [Modal, modalApi] = useVbenModal({
  onOpenChange: async (isOpen: boolean) => {
    if (isOpen) {
      messageInfo.value = modalApi.getData<Record<string, any>>();
    }
  },
});
</script>
<template>
  <Modal class="w-[1080px]" title="消息详情">
    <MessageDetailPanel :message="messageInfo" />

    <template #footer>
      <Space>
        <ButtonClose @click="modalApi.close()" />
      </Space>
    </template>
  </Modal>
</template>
