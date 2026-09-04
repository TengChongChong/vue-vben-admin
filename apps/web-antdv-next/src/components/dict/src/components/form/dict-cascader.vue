<script lang="ts" setup>
import type { CascaderProps } from 'antdv-next';

import type { DictCascaderProps } from '../../props';

import { computed, onMounted, ref, watch } from 'vue';

import { cn } from '@vben/utils';

import { Cascader } from 'antdv-next';
import { isEqual } from 'lodash-es';

import { useDictStore } from '#/store';

type ShowSearchType = NonNullable<CascaderProps['showSearch']>;
type CascaderValue = Array<number> | Array<string> | undefined;

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

const filter: ShowSearchType['filter'] = (inputValue, path) => {
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
