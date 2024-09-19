<script setup lang="ts">
import type { ButtonImportProps } from '../props';

import { useRouter } from 'vue-router';

import { AccessControl } from '@vben/access';
import { cn } from '@vben/utils';

import { UploadOutlined } from '@ant-design/icons-vue';
import { Button } from 'ant-design-vue';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<ButtonImportProps>(), {
  authType: 'code',
  text: '导入',
  loading: false,
  disabled: false,
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
        <UploadOutlined />
      </template>
      {{ props.text }}
    </Button>
  </AccessControl>
</template>

<style scoped></style>
