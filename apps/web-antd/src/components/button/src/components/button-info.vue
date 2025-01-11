<script setup lang="ts">
import type { ButtonInfoProps } from '../props';

import { LucideSearch } from '#/components/icons';
import { AccessControl } from '@vben/access';
import { cn } from '@vben/utils';
import { Button } from 'ant-design-vue';
import { useRouter } from 'vue-router';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<ButtonInfoProps>(), {
  authType: 'code',
  text: '详情',
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
        <LucideSearch />
      </template>
      {{ props.text }}
    </Button>
  </AccessControl>
</template>

<style scoped></style>
