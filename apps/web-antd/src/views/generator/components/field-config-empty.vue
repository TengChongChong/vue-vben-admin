<script setup lang="ts">
import { Button, Empty } from 'ant-design-vue';

defineProps<{
  description?: string;
}>();

const emit = defineEmits<{
  openSettings: [];
}>();
</script>

<template>
  <Empty :description="description ?? '暂无启用的字段'" class="my-6">
    <Button type="primary" @click="emit('openSettings')"> 前往字段设置 </Button>
  </Empty>
</template>
