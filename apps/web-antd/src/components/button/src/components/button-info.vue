<script setup lang="ts">
import type { ButtonInfoProps } from '../props';

import { useRouter } from 'vue-router';

import { AccessControl } from '@vben/access';
import { cn } from '@vben/utils';

import { SearchOutlined } from '@ant-design/icons-vue';
import { Button } from 'ant-design-vue';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<ButtonInfoProps>(), {
  authType: 'code',
  text: '详情',
  loading: false,
  disabled: false,
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
        <SearchOutlined />
      </template>
      {{ props.text }}
    </Button>
  </AccessControl>
</template>

<style scoped></style>
