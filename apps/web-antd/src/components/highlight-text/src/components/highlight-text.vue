<script setup lang="ts">
defineProps<{
  // 高亮文字
  keyword: string;
  // 文字
  text: string;
}>();
</script>

<template>
  <template
    v-for="(fragment, i) in text
      .toString()
      .split(new RegExp(`(?<=${keyword})|(?=${keyword})`, 'i'))"
  >
    <span
      v-if="fragment.toLowerCase() === keyword.toLowerCase()"
      :key="i"
      class="highlight-text"
    >
      {{ fragment }}
    </span>
    <template v-else>{{ fragment }}</template>
  </template>
</template>

<style scoped>
.highlight-text {
  color: hsl(var(--primary));
}
</style>
