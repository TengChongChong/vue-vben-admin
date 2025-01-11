<script lang="ts" setup>
import type { ShowSearchType } from 'ant-design-vue/es/vc-cascader';

import type { DictCascaderProps } from '../../props';

import { useDictStore } from '#/store';
import { cn } from '@vben/utils';
import { Cascader } from 'ant-design-vue';
import { computed, onMounted, ref, unref, watch } from 'vue';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<DictCascaderProps>(), {});

const emit = defineEmits(['change', 'update:value']);

const currentValue = ref<Array<number> | Array<string> | undefined>([]);

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
  const relValue = unref(currentValue) || [];
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
    @change="handleChange"
  />
</template>
