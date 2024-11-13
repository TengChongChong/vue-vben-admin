<script setup lang="ts">
import { Divider } from 'ant-design-vue';

defineProps<{
  text: string;
}>();
</script>

<template>
  <Divider orientation="left">{{ text }}</Divider>
</template>

<style scoped></style>
