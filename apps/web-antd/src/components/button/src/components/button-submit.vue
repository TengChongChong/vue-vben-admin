<script setup lang="ts">
import type { BaseButtonProps } from '../props';

import { LucideCheck } from '#/components/icons';
import { AccessControl } from '@vben/access';
import { cn } from '@vben/utils';
import { Button } from 'ant-design-vue';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<BaseButtonProps>(), {
  authType: 'code',
  text: '提交',
  type: 'primary',
  size: 'middle',
});

const emit = defineEmits(['click']);

function handleClick() {
  emit('click');
}
</script>

<template>
  <AccessControl :codes="props.authCodes" :type="props.authType">
    <Button
      v-bind="$attrs"
      :class="cn(props.class)"
      :size="props.size"
      :type="props.type"
      @click="handleClick"
    >
      <template #icon>
        <LucideCheck />
      </template>
      {{ props.text }}
    </Button>
  </AccessControl>
</template>

<style scoped></style>
