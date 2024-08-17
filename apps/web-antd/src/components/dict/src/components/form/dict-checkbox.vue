<script lang="ts" setup>
import type { DictCheckboxProps } from '#/components/dict/src/prop';

import { computed, onMounted, ref, unref, watch } from 'vue';

import { CheckboxGroup } from 'ant-design-vue';

import {
  convertArrayValue,
  getSelectModelArray,
} from '#/components/dict/src/helper';

const props = withDefaults(defineProps<DictCheckboxProps>(), {
  value: [],
});

const emit = defineEmits(['change', 'update:value']);

const currentValue = ref<string[]>([]);

/**
 * 选项
 */
const options = computed(() => {
  return getSelectModelArray(props.dictType);
});

/**
 * 处理传入的value，统一转为string类型数组
 */
function convertValue() {
  currentValue.value = convertArrayValue(props.value);
}

onMounted(() => {
  convertValue();
});

watch(() => props.value, convertValue);

function handleChange() {
  emit('change', unref(currentValue));
  emit('update:value', unref(currentValue));
}
</script>
<template>
  <CheckboxGroup
    v-bind="$attrs"
    v-model:value="currentValue"
    :options="options"
    @change="handleChange"
  />
</template>
