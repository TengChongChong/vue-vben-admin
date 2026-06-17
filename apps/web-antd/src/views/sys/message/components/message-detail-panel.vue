<script lang="ts" setup>
import type { SysMessage } from '#/api';

import { computed } from 'vue';

import { VbenAvatar } from '@vben/common-ui';
import { preferences } from '@vben/preferences';
import { formatToDateTime } from '@vben/utils';

import { Divider, Empty, Spin } from 'ant-design-vue';

import { sanitizeMessageHtml } from '#/views/sys/message/util/message-helpers';

const props = withDefaults(
  defineProps<{
    loading?: boolean;
    message?: SysMessage;
  }>(),
  {
    loading: false,
    message: undefined,
  },
);

const sanitizedContent = computed(() =>
  sanitizeMessageHtml(props.message?.content),
);
</script>

<template>
  <div class="message-detail-panel">
    <Spin :spinning="loading">
      <template v-if="message">
        <div class="message-detail-panel__title">
          <h3>{{ message.title }}</h3>
        </div>
        <div class="message-detail-panel__property">
          <VbenAvatar
            :alt="message.nickname"
            :size="40"
            :src="message.avatar || preferences.app.defaultAvatar"
          />
          <span class="message-detail-panel__sender">{{
            message.nickname
          }}</span>
          <Divider type="vertical" />
          <span class="message-detail-panel__time">
            {{ message.sendDate ? formatToDateTime(message.sendDate) : '草稿' }}
          </span>
        </div>
        <Divider />
        <div
          class="message-detail-panel__content"
          v-html="sanitizedContent"
        ></div>
      </template>
      <Empty
        v-else
        class="message-detail-panel__empty"
        description="选择左侧消息查看详情"
      />
    </Spin>
  </div>
</template>

<style lang="scss" scoped>
@import '../style/message.scss';
</style>
