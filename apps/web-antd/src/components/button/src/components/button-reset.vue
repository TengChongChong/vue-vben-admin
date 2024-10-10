<script setup lang="ts">
import type { BaseButtonProps } from '../props';

import { cn } from '@vben/utils';

import { RedoOutlined } from '@ant-design/icons-vue';
import { Button } from 'ant-design-vue';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<BaseButtonProps>(), {
  text: '重置',
  type: 'default',
  size: 'middle',
});

const emit = defineEmits(['click']);

function handleClick() {
  emit('click');
}
</script>

<template>
  <Button
    v-bind="$attrs"
    :class="cn(props.class)"
    :size="props.size"
    :type="props.type"
    @click="handleClick"
  >
    <template #icon>
      <RedoOutlined />
    </template>
    {{ props.text }}
  </Button>
</template>

<style scoped></style>
