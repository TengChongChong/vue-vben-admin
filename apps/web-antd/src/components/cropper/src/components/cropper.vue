<script setup lang="ts">
import type { CropperProps } from '#/components/cropper/src/props';

import { Avatar } from 'ant-design-vue';

const props = withDefaults(defineProps<CropperProps>(), {
  alt: '图片',
});
</script>

<template>
  <div class="cropper-wrapper">
    <template v-if="props.url">
      <Avatar :size="100" :src="props.url" />
    </template>
    <template v-else>
      <Avatar :size="100">{{ props.alt }}</Avatar>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.cropper-wrapper {
  cursor: pointer;
}
</style>
