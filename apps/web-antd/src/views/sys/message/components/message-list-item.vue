<script lang="ts" setup>
import type { SysMessage } from '#/api';

import { computed } from 'vue';

import { VbenAvatar } from '@vben/common-ui';
import { preferences } from '@vben/preferences';
import { formatToDateTime } from '@vben/utils';

import { Badge, Checkbox } from 'ant-design-vue';

import { DictTag } from '#/components/dict';

const props = withDefaults(
  defineProps<{
    active?: boolean;
    checked?: boolean;
    message: SysMessage;
    showCheckbox?: boolean;
  }>(),
  {
    active: false,
    checked: false,
    showCheckbox: true,
  },
);

const emit = defineEmits<{
  check: [checked: boolean];
  click: [];
}>();

const isUnread = computed(
  () => props.message.readDate === null || props.message.readDate === undefined,
);
</script>

<template>
  <div
    :class="{
      'message-list-item--selected': active,
      'message-list-item--unread': isUnread,
    }"
    class="message-list-item"
    @click="emit('click')"
  >
    <div v-if="showCheckbox" class="message-list-item__checkbox" @click.stop>
      <Checkbox
        :checked="checked"
        @change="(e) => emit('check', e.target.checked)"
      />
    </div>

    <div class="message-list-item__avatar-wrap">
      <Badge :dot="isUnread">
        <VbenAvatar
          :alt="message.nickname"
          :size="36"
          :src="message.avatar || preferences.app.defaultAvatar"
        />
      </Badge>
    </div>

    <div class="message-list-item__main">
      <div class="message-list-item__title">{{ message.title }}</div>
      <div class="message-list-item__meta">
        <span class="message-list-item__sender">{{ message.nickname }}</span>
        <DictTag
          v-if="message.type"
          :code="message.type"
          dict-type="messageType"
        />
      </div>
    </div>

    <div class="message-list-item__aside">
      <span v-if="message.sendDate" class="message-list-item__time">
        {{ formatToDateTime(message.sendDate) }}
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '../style/message.scss';
</style>
