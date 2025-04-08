<script setup lang="ts">
import type { ButtonImportProps } from '../props';

import { useRouter } from 'vue-router';

import { AccessControl } from '@vben/access';
import { cn } from '@vben/utils';

import { Button } from 'ant-design-vue';

import { LucideHardDriveUpload } from '#/components/icons';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<ButtonImportProps>(), {
  authType: 'code',
  text: '导入',
  type: 'primary',
  size: 'middle',
});

const emit = defineEmits(['click']);

const router = useRouter();

function handleClick() {
  emit('click');
  router.push(`/sys/import/excel/data/view/${props.importCode}`);
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
        <LucideHardDriveUpload />
      </template>
      {{ props.text }}
    </Button>
  </AccessControl>
</template>

<style scoped></style>
