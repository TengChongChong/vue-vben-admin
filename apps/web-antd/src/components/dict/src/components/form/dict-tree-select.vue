<script lang="ts" setup>
import type { DictTreeSelectProps } from '../../props';

import { computed, onMounted, ref, unref, watch } from 'vue';

import { cn } from '@vben/utils';

import { TreeSelect } from 'ant-design-vue';

import { HighlightText } from '#/components/highlight-text';
import { useDictStore } from '#/store';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<DictTreeSelectProps>(), {
  multiple: false,
});

const emit = defineEmits(['change', 'update:value']);

const currentValue = ref<Array<string> | string | undefined>();
const searchValue = ref('');

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
  currentValue.value = props.multiple
    ? (props.value ?? [])
    : (props.value ?? undefined);
}

watch(() => props.value, convertValue);

function handleChange() {
  const relValue = unref(currentValue) ?? (props.multiple ? [] : '');
  emit('change', relValue);
  emit('update:value', relValue);
}
</script>
<template>
  <TreeSelect
    v-bind="$attrs"
    v-model:search-value="searchValue"
    v-model:value="currentValue"
    :class="cn(props.class, 'w-full')"
    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
    :multiple="props.multiple"
    :tree-data="options"
    allow-clear
    show-search
    tree-node-filter-prop="label"
    @change="handleChange"
  >
    <template #title="{ label }">
      <!-- 高亮关键字 -->
      <template v-if="label">
        <HighlightText :keyword="searchValue" :text="label" />
      </template>
    </template>
  </TreeSelect>
</template>
