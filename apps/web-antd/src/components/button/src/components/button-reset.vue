<script setup lang="ts">
import type { ButtonProps } from '#/components/button/src/prop';

import { RedoOutlined } from '@ant-design/icons-vue';
import { Button } from 'ant-design-vue';

defineOptions({
  name: 'ButtonSave',
});

const props = withDefaults(defineProps<ButtonProps>(), {
  text: '重置',
  loading: false,
  disabled: false,
  danger: false,
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
    :disabled="props.disabled"
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
