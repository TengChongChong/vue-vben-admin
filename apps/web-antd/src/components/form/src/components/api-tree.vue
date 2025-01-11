<script lang="ts" setup>
import type { TreeProps } from 'ant-design-vue';

import type { ApiTreeProps } from '../props';

import { isFunction } from '@vben/utils';
import { get } from '@vueuse/shared';
import { Tree } from 'ant-design-vue';
import { onMounted, ref, unref, watch } from 'vue';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<ApiTreeProps>(), {
  immediate: true,
});

const emit = defineEmits(['optionsChange', 'change', 'update:value']);

const currentValue = ref<Array<number> | Array<string> | undefined>();
const treeExpandedKeys = ref([]);

const treeData = ref<TreeProps['treeData']>([]);
const isFirstLoaded = ref(false);
const loading = ref(false);

async function fetch() {
  const { api, afterFetch } = props;
  if (!api || !isFunction(api)) return;
  loading.value = true;
  treeData.value = [];
  let result;
  try {
    result = await api(props.params);
  } catch (error) {
    console.error(error);
  }
  if (afterFetch && isFunction(afterFetch)) {
    result = afterFetch(result);
  }
  loading.value = false;
  if (!result) return;
  if (!Array.isArray(result)) {
    result = get(result, props.resultField);
  }
  treeData.value = result || [];
  isFirstLoaded.value = true;
  emit('optionsChange', treeData.value);
}

watch(
  () => props.params,
  () => {
    unref(isFirstLoaded) && fetch();
  },
  { deep: true },
);

watch(
  () => props.immediate,
  (v) => {
    v && unref(isFirstLoaded) && fetch();
  },
);

onMounted(() => {
  props.immediate && fetch();
  convertValue();
});

function convertValue() {
  currentValue.value = props.value ?? [];
}

watch(() => props.value, convertValue);

function handleChange() {
  emit('change', unref(currentValue));
  emit('update:value', unref(currentValue));
}

function treeExpand(keys) {
  treeExpandedKeys.value = keys;
}
</script>
<template>
  <Tree
    v-bind="$attrs"
    v-model:expanded-keys="treeExpandedKeys"
    v-model:selected-keys="currentValue"
    :tree-data="treeData"
    @select="handleChange"
    @tree-expand="treeExpand"
  />
</template>
