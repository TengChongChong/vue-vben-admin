<script setup lang="ts">
import type { ButtonAddProps } from '../props';

import { useRouter } from 'vue-router';

import { AccessControl } from '@vben/access';
import { cn } from '@vben/utils';

import { PlusOutlined } from '@ant-design/icons-vue';
import { Button } from 'ant-design-vue';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<ButtonAddProps>(), {
  authType: 'code',
  text: '新增',
  loading: false,
  disabled: false,
  type: 'primary',
  size: 'middle',
});

const emit = defineEmits(['click']);

const router = useRouter();

function handleClick() {
  emit('click');
  if (props.path) {
    router.push(props.path);
  }
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
        <PlusOutlined />
      </template>
      {{ props.text }}
    </Button>
  </AccessControl>
</template>

<style scoped></style>
