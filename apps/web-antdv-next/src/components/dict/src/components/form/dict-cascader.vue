<script lang="ts" setup>
import type { DictCascaderProps } from '../../props';

import { computed, onMounted, ref, watch } from 'vue';

import { cn } from '@vben/utils';

import { Cascader } from 'antdv-next';
import { isEqual } from 'lodash-es';

import { useDictStore } from '#/store';

/**
 * Cascader 的 showSearch 在 antdv-next 中被放宽为 `boolean | Record<string, any>`，
 * 无法再通过 `CascaderProps['showSearch']['filter']` 取到过滤函数类型，这里自行声明
 */
type ShowSearchFilter = (
  inputValue: string,
  path: Array<{ label: string }>,
) => boolean;

type CascaderValue = Array<number | string> | undefined;

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<DictCascaderProps>(), {});

const emit = defineEmits(['change', 'update:value']);

const currentValue = ref<CascaderValue>([]);

const dictStore = useDictStore();

/**
 * 选项
 */
const options = computed(() => {
  return dictStore.selectTree(props.dictType);
});

onMounted(() => {
  convertValue();
});

function convertValue() {
  const nextValue: CascaderValue = props.multiple
    ? (props.value ?? [])
    : (props.value ?? undefined);
  if (isEqual(currentValue.value, nextValue)) {
    return;
  }
  currentValue.value = nextValue;
}

watch(() => props.value, convertValue);

function handleChange(value: CascaderValue) {
  const relValue = value ?? (props.multiple ? [] : undefined);
  currentValue.value = relValue;
  emit('change', relValue);
  emit('update:value', relValue);
}

const filter: ShowSearchFilter = (inputValue, path) => {
  return path.some((option) =>
    option.label.toLowerCase().includes(inputValue.toLowerCase()),
  );
};
</script>
<template>
  <Cascader
    v-bind="$attrs"
    v-model:value="currentValue"
    :allow-clear="true"
    :class="cn(props.class, 'w-full')"
    :options="options"
    :show-search="{ filter }"
    @change="handleChange" />
</template>
