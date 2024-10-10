<script setup lang="ts">
import type { BaseButtonProps } from '../props';

import { AccessControl } from '@vben/access';
import { cn } from '@vben/utils';

import { SaveOutlined } from '@ant-design/icons-vue';
import { Button } from 'ant-design-vue';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<BaseButtonProps>(), {
  authType: 'code',
  text: '保存',
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
        <SaveOutlined />
      </template>
      {{ props.text }}
    </Button>
  </AccessControl>
</template>

<style scoped></style>
