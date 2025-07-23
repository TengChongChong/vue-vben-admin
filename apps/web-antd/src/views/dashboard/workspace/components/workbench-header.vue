<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { VbenAvatar } from '@vben/common-ui';

import { selectUnreadCountApi } from '#/api/sys/sys-message';
import { router } from '#/router';

interface Props {
  avatar?: string;
  nickname?: string;
}

defineOptions({
  name: 'WorkbenchHeader',
});

withDefaults(defineProps<Props>(), {
  avatar: '',
  nickname: '',
});

const unreadCountCount = ref(0);

function loadUnreadCount() {
  selectUnreadCountApi().then((res) => {
    unreadCountCount.value = res;
  });
}

onMounted(() => {
  loadUnreadCount();
});

function handleToMessage() {
  router.push('/sys/message/receive');
}
</script>
<template>
  <div class="card-box p-4 py-6 lg:flex">
    <VbenAvatar :src="avatar" :alt="nickname" class="size-20" />
    <div
      v-if="$slots.title || $slots.description"
      class="flex flex-col justify-center md:ml-6 md:mt-0"
    >
      <h1 v-if="$slots.title" class="text-md font-semibold md:text-xl">
        <slot name="title"></slot>
      </h1>
      <span v-if="$slots.description" class="text-foreground/80 mt-1">
        <slot name="description"></slot>
      </span>
    </div>
    <div class="mt-4 flex flex-1 justify-end md:mt-0">
      <div class="flex cursor-pointer flex-col justify-center px-6 text-right">
        <span class="text-foreground/80"> 待办事项 </span>
        <span class="text-2xl">10</span>
      </div>

      <div
        class="flex cursor-pointer flex-col justify-center px-6 text-right"
        @click="handleToMessage"
      >
        <span class="text-foreground/80"> 未读消息 </span>
        <span class="text-2xl">{{ unreadCountCount }}</span>
      </div>
    </div>
  </div>
</template>
