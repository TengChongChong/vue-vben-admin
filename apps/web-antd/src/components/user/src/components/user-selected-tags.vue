<script setup lang="ts">
import type { SysUserVO } from '#/api';

import { Button, Tag } from 'ant-design-vue';

import { formatUserLabel } from '#/components/user/src/util/user-helpers';

const props = defineProps<{
  disabled?: boolean;
  users: SysUserVO[];
}>();

const emit = defineEmits<{
  clear: [];
  remove: [string];
}>();

function handleRemove(id: string) {
  if (props.disabled) {
    return;
  }
  emit('remove', id);
}

function handleClear() {
  if (props.disabled) {
    return;
  }
  emit('clear');
}
</script>

<template>
  <div class="user-selected-tags">
    <div v-if="users.length > 0" class="user-selected-tags__header">
      <span class="user-selected-tags__count">已选 {{ users.length }} 人</span>
      <Button
        :disabled="disabled"
        size="small"
        type="link"
        @click="handleClear"
      >
        清空
      </Button>
    </div>
    <div v-if="users.length > 0" class="user-selected-tags__list">
      <Tag
        v-for="user in users"
        :key="user.id"
        :closable="!disabled"
        class="user-selected-tags__tag"
        @close.prevent="handleRemove(user.id)"
      >
        {{ formatUserLabel(user) }}
      </Tag>
    </div>
    <span v-else class="user-selected-tags__empty">暂未选择用户</span>
  </div>
</template>

<style lang="scss" scoped>
.user-selected-tags {
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  &__count {
    font-size: 13px;
    color: hsl(var(--muted-foreground));
  }

  &__list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    max-height: 96px;
    overflow-y: auto;
  }

  &__tag {
    margin: 0;
  }

  &__empty {
    font-size: 13px;
    color: hsl(var(--muted-foreground));
  }
}
</style>
