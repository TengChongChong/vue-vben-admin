<script lang="ts" setup>
import type { SysUserVO } from '#/api';

import { computed } from 'vue';

import { VbenAvatar } from '@vben/common-ui';

import { Button, TypographyText } from 'ant-design-vue';

import { LucideUserRound } from '#/components/icons';

const props = withDefaults(
  defineProps<{
    allowChange?: boolean;
    columnCount?: number;
    selectedUser?: null | SysUserVO;
    siteCount?: number;
  }>(),
  {
    allowChange: true,
    columnCount: 0,
    selectedUser: null,
    siteCount: 0,
  },
);

const emit = defineEmits<{
  change: [];
  pick: [];
}>();

const hasUser = computed(() => Boolean(props.selectedUser?.id));

const userSubtitle = computed(() => {
  const user = props.selectedUser;
  if (!user) {
    return '';
  }
  const parts = [user.username];
  if (user.deptName) {
    parts.push(user.deptName);
  }
  return parts.join(' · ');
});

const statsText = computed(() => {
  if (!hasUser.value) {
    return '';
  }
  return `已授权 ${props.siteCount} 个站点 · ${props.columnCount} 个栏目`;
});
</script>

<template>
  <div
    v-if="!hasUser"
    class="card-box mb-4 flex items-center gap-4 rounded-lg border border-dashed p-5">
    <div
      class="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
      <LucideUserRound class="size-6" />
    </div>
    <div class="min-w-0 flex-1">
      <div class="text-base font-medium">选择要配置 CMS 权限的用户</div>
      <TypographyText class="mt-1 block" type="secondary">
        选定用户后，可批量勾选站点与栏目权限；站点与栏目均为显式授权，取消站点会自动清理该站点下的栏目授权。
      </TypographyText>
    </div>
    <Button type="primary" @click="emit('pick')">选择用户</Button>
  </div>

  <div v-else class="card-box mb-4 rounded-lg border p-4">
    <div class="flex items-center gap-4">
      <VbenAvatar
        :alt="selectedUser?.nickname"
        :size="48"
        :src="selectedUser?.avatarUrl"
        class="shrink-0" />
      <div class="min-w-0 flex-1">
        <div class="truncate text-base font-semibold">
          {{ selectedUser?.nickname || selectedUser?.username }}
        </div>
        <TypographyText class="mt-0.5 block truncate" type="secondary">
          {{ userSubtitle }}
        </TypographyText>
        <TypographyText v-if="statsText" class="mt-1 block text-xs" type="secondary">
          {{ statsText }}
        </TypographyText>
      </div>
      <Button v-if="allowChange" type="link" @click="emit('change')">
        更换用户
      </Button>
    </div>
  </div>
</template>
