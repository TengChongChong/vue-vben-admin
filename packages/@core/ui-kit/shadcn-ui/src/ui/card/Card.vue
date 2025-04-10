<script setup lang="ts">
import { cn } from '@vben-core/shared/utils';

const props = defineProps<{
  class?: any;
}>();
</script>

<template>
  <div :class="cn('bg-card text-card-foreground rounded-lg', props.class)">
    <slot></slot>
  </div>
</template>
