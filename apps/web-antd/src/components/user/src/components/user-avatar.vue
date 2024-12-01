<script setup lang="ts">
import { computed } from 'vue';

import { Avatar } from 'ant-design-vue';

interface Props {
  alt?: string;
  size?: number;
  src?: string;
}

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<Props>(), {
  size: 64,
  alt: null,
  src: null,
});

const text = computed(() => {
  return props.alt?.slice(-2);
});
</script>

<template>
  <Avatar v-if="props.src" :size="props.size" :src="props.src" />

  <Avatar v-else :size="props.size">
    {{ text }}
  </Avatar>
</template>

<style lang="scss" scoped>
.ant-avatar {
  background-color: hsl(var(--primary));
  border: 0;
}
</style>
