<script setup lang="ts">
import type { ButtonProps } from '#/components/button/src/prop';

import { AccessControl } from '@vben/access';

import { SaveOutlined } from '@ant-design/icons-vue';
import { Button } from 'ant-design-vue';

defineOptions({
  name: 'ButtonSave',
});

const props = withDefaults(defineProps<ButtonProps>(), {
  authType: 'code',
  text: '保存',
  loading: false,
  disabled: false,
  danger: false,
  type: 'primary',
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
      :disabled="props.disabled"
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
