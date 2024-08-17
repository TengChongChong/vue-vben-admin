<script lang="ts" setup>
import type { DictCascaderProps } from '#/components/dict/src/prop';

import { computed, onMounted, ref, unref, watch } from 'vue';

import { Cascader } from 'ant-design-vue';

import { convertArrayValue } from '#/components/dict/src/helper';
import { useDictStore } from '#/store';

const props = withDefaults(defineProps<DictCascaderProps>(), {});

const emit = defineEmits(['change', 'update:value']);

const currentValue = ref<Array<number> | Array<string>>([]);

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
  currentValue.value = convertArrayValue(props.value);
}

watch(() => props.value, convertValue);

function handleChange() {
  const relValue = unref(currentValue) || [];
  emit('change', relValue);
  emit('update:value', relValue);
}
</script>
<template>
  <Cascader
    v-bind="$attrs"
    v-model:value="currentValue"
    :allow-clear="true"
    :options="options"
    style="width: 100%"
    @change="handleChange"
  />
</template>
