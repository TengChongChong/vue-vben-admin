<script lang="ts" setup>
import type { DictTreeSelectProps } from '#/components/dict/src/prop';

import { computed, onMounted, ref, unref, watch } from 'vue';

import { TreeSelect } from 'ant-design-vue';

import { useDictStore } from '#/store';

const props = withDefaults(defineProps<DictTreeSelectProps>(), {
  multiple: false,
});

const emit = defineEmits(['change', 'update:value']);

const currentValue = ref<Array<string> | string>();
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
    : (props.value ?? '');
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
    v-model:searchValue="searchValue"
    v-model:value="currentValue"
    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
    :multiple="props.multiple"
    :tree-data="options"
    allow-clear
    show-search
    style="width: 100%"
    tree-node-filter-prop="label"
    @change="handleChange"
  >
    <template #title="{ label }">
      <!-- 高亮关键字 -->
      <template v-if="label">
        <template
          v-for="(fragment, i) in label.split(
            new RegExp(`(?<=${searchValue})|(?=${searchValue})`, 'i'),
          )"
        >
          <span
            v-if="fragment.toLowerCase() === searchValue.toLowerCase()"
            :key="i"
            style="color: hsl(var(--primary))"
          >
            {{ fragment }}
          </span>
          <template v-else>{{ fragment }}</template>
        </template>
      </template>
    </template>
  </TreeSelect>
</template>
