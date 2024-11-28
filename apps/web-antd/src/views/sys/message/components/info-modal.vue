<script lang="ts" setup>
import type { SysMessage } from '#/api/sys/model/sys-message-model';

import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Divider, Space } from 'ant-design-vue';

import { ButtonClose } from '#/components/button';
import { UserAvatar } from '#/components/user';
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
    <div class="message-info">
      <div class="message-info-title">
        <h3>{{ messageInfo?.title }}</h3>
      </div>
      <div class="message-info-property">
        <UserAvatar
          :alt="messageInfo?.nickname"
          :size="40"
          :src="messageInfo?.avatar"
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
      <div class="message-info-content" v-html="messageInfo?.content"></div>
    </div>

    <template #footer>
      <Space>
        <ButtonClose @click="modalApi.close()" />
      </Space>
    </template>
  </Modal>
</template>
<style lang="scss" scoped>
.message-info {
  padding: 16px;

  .message-info-title {
    margin-bottom: 24px;
    font-size: 24px;
    font-weight: bold;
    text-align: center;
  }

  .message-info-property {
    text-align: center;
  }

  .message-info-content {
    padding: 0 16px;
    .editor-media {
      display: inline-block;
    }
  }
}
</style>
