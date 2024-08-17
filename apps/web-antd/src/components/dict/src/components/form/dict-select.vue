<script lang="ts" setup>
import type { DictSelectProps } from '#/components/dict/src/prop';

import { computed, onMounted, ref, unref, watch } from 'vue';

import { Select } from 'ant-design-vue';

import {
  convertArrayValue,
  convertSingleValue,
  getSelectModelArray,
} from '#/components/dict/src/helper';

const props = withDefaults(defineProps<DictSelectProps>(), {
  optionFilterProp: 'label',
});

const emit = defineEmits(['change', 'update:value']);

const currentValue = ref<
  Array<number> | Array<string> | null | number | string
>();

// 配置是否可搜索
const showSearch = ref(props.showSearch);

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
    :allow-clear="true"
    :mode="props.mode"
    :option-filter-prop="props.optionFilterProp"
    :options="options"
    :show-search="showSearch"
    style="width: 100%"
    @change="handleChange"
  />
</template>
