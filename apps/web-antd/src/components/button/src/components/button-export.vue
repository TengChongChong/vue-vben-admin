<script setup lang="ts">
import type { BaseButtonProps } from '../props';

import { AccessControl } from '@vben/access';
import { cn } from '@vben/utils';

import { DownloadOutlined } from '@ant-design/icons-vue';
import { Button } from 'ant-design-vue';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<BaseButtonProps>(), {
  authType: 'code',
  text: '导出',
  loading: false,
  disabled: false,
  size: 'middle',
});

const emit = defineEmits(['click']);

function handleClick() {
  emit('click');
}
</script>

<template>
  <AccessControl :codes="props.codes" :type="props.authType">
    <Button
      v-bind="$attrs"
      :class="cn(props.class)"
      :disabled="props.disabled"
      :size="props.size"
      :type="props.type"
      @click="handleClick"
    >
      <template #icon>
        <DownloadOutlined />
      </template>
      {{ props.text }}
    </Button>
  </AccessControl>
</template>

<style scoped></style>
