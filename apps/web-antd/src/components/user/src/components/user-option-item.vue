<script setup lang="ts">
import type { SysUserVO } from '#/api';

import { VbenAvatar } from '@vben/common-ui';

import { HighlightText } from '#/components/highlight-text';
import { formatUserOptionText } from '#/components/user/src/util/user-helpers';

defineProps<{
  keyword?: string;
  showAvatar?: boolean;
  user: SysUserVO;
}>();
</script>

<template>
  <div class="user-option-item">
    <VbenAvatar
      v-if="showAvatar"
      :alt="user.nickname"
      :src="user.avatarUrl || ''"
      class="user-option-item__avatar"
    />
    <HighlightText
      :keyword="keyword"
      :text="formatUserOptionText(user)"
      class="user-option-item__text"
    />
  </div>
</template>

<style lang="scss" scoped>
.user-option-item {
  display: flex;
  gap: 8px;
  align-items: center;
  min-width: 0;

  &__avatar {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
  }

  &__text {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
