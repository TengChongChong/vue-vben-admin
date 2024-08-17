<script setup lang="ts">
import type { HTMLAttributes } from 'vue';

import { cn } from '@vben-core/shared';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();
</script>

<template>
  <div
    :class="
      cn('bg-card text-card-foreground rounded-lg shadow-sm', props.class)
    "
  >
    <slot></slot>
  </div>
</template>
