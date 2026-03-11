<script setup lang="ts">
import { IconifyIcon } from '@vben/icons';

interface IconProps {
  icon: string;
}

const props = withDefaults(defineProps<IconProps>(), {});
</script>

<template>
  <IconifyIcon :icon="props.icon" />
</template>

<style scoped></style>
