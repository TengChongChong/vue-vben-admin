<script lang="ts" setup>
import type { DictRadioProps } from '#/components/dict/src/prop';

import { computed, onMounted, ref, unref, watch } from 'vue';

import { Segmented } from 'ant-design-vue';

import {
  convertSingleValue,
  getSelectModelArray,
} from '#/components/dict/src/helper';

const props = withDefaults(defineProps<DictRadioProps>(), {
  value: null,
});

const emit = defineEmits(['change', 'update:value']);

const currentValue = ref<string>('');

/**
 * 选项
 */
const options = computed(() => {
  return getSelectModelArray(props.dictType);
});

onMounted(() => {
  currentValue.value = convertSingleValue(props.value);
});

watch(
  () => props.value,
  () => (currentValue.value = convertSingleValue(props.value)),
);

function handleChange() {
  emit('change', unref(currentValue));
  emit('update:value', unref(currentValue));
}
</script>
<template>
  <Segmented
    v-bind="$attrs"
    v-model:value="currentValue"
    :options="options"
    @change="handleChange"
  />
</template>
