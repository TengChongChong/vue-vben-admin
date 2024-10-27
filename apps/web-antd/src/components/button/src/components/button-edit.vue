<script setup lang="ts">
import type { ButtonEditProps } from '../props';

import { useRouter } from 'vue-router';

import { AccessControl } from '@vben/access';
import { cn } from '@vben/utils';

import { Button } from 'ant-design-vue';

import { LucideSquarePen } from '#/components/icons';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<ButtonEditProps>(), {
  authType: 'code',
  text: '编辑',
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
  <AccessControl :codes="props.authCodes" :type="props.authType">
    <Button
      v-bind="$attrs"
      :class="cn(props.class)"
      :size="props.size"
      :type="props.type"
      @click.stop="handleClick"
    >
      <template #icon>
        <LucideSquarePen />
      </template>
      {{ props.text }}
    </Button>
  </AccessControl>
</template>

<style scoped></style>
