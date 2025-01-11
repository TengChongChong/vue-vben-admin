<script lang="ts" setup>
import type { DictSelectProps } from '../../props';

import {
  convertArrayValue,
  convertSingleValue,
  getSelectModelArray,
} from '#/components/form/src/helper';
import { cn } from '@vben/utils';
import { Select } from 'ant-design-vue';
import { computed, onMounted, ref, unref, watch } from 'vue';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<DictSelectProps>(), {});

const emit = defineEmits(['change', 'update:value']);

const currentValue = ref<
  Array<number> | Array<string> | null | number | string | undefined
>();

/**
 * 选项
 */
const options = computed(() => {
  return getSelectModelArray(props.dictType);
});

onMounted(() => {
  convertValue();
});

function convertValue() {
  currentValue.value =
    props.mode === undefined
      ? convertSingleValue(props.value as string)
      : convertArrayValue(props.value as string[]);
}

watch(() => props.value, convertValue);

function handleChange() {
  let relValue = unref(currentValue);
  if (unref(currentValue) === null) {
    relValue = props.mode === undefined ? '' : [];
  }
  emit('change', relValue);
  emit('update:value', relValue);
}
</script>
<template>
  <Select
    v-bind="$attrs"
    v-model:value="currentValue!"
    :class="cn(props.class, 'w-full')"
    :mode="props.mode"
    :options="options"
    :show-search="options.length > 4"
    allow-clear
    option-filter-prop="label"
    @change="handleChange"
  />
</template>
