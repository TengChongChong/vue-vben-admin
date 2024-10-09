<script setup lang="ts">
import { Icon } from '@vben/icons';

interface IconProps {
  icon: string;
}

const props = withDefaults(defineProps<IconProps>(), {});
</script>

<template>
  <Icon :icon="props.icon" />
</template>

<style scoped></style>
