<script lang="ts" setup>
import type { DictRadioProps } from '../../props';

import {
  convertSingleValue,
  getSelectModelArray,
} from '#/components/form/src/helper';
import { Segmented } from 'ant-design-vue';
import { computed, onMounted, ref, unref, watch } from 'vue';

defineOptions({
  inheritAttrs: false,
});

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
  // Segmented value null或者undefined 会有警告
  currentValue.value = convertSingleValue(props.value) || '';
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
