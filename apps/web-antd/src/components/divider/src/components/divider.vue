<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
});
defineProps<{
  text?: string;
}>();
</script>

<template>
  <div class="divider">
    <hr />
    <div class="divider-title">
      <template v-if="text">{{ text }}</template>
      <template v-else>
        <slot></slot>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.divider {
  width: 100%;
  hr {
    width: 100%;
    margin-bottom: 1rem;
    border-style: dashed;
  }

  .divider-title {
    padding-left: 1rem;
    border-left: 4px solid hsl(var(--primary));
    font-size: 15px;
    line-height: 15px;
  }
}
</style>
