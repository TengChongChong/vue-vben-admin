<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';

import { Cascader } from 'ant-design-vue';

import { AREA } from '../data';

defineOptions({
  inheritAttrs: false,
});

const props = defineProps<{
  value: string[] | undefined;
}>();

const emit = defineEmits(['change', 'update:value']);

const currentValue = ref();

watch(
  () => props.value,
  () => {
    currentValue.value = props.value;
  },
);

onMounted(() => {
  currentValue.value = props.value;
});

function handleChange(value) {
  currentValue.value = value;
  emit('change', value);
  emit('update:value', value);
}
</script>

<template>
  <Cascader
    v-bind="$attrs"
    allow-clear
    v-model:value="currentValue"
    :options="AREA"
    @change="handleChange"
    style="width: 100%"
  />
</template>

<style scoped></style>
