<script lang="ts" setup>
import type { TreeProps } from 'ant-design-vue';

import type { ApiTreeProps } from '../props';

import { onMounted, ref, unref, watch } from 'vue';

import { findPath, isFunction, isNumber, isString } from '@vben/utils';

import { get } from '@vueuse/shared';
import { Tree } from 'ant-design-vue';

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
  setExpandedKeys();
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

watch(
  () => currentValue.value,
  () => {
    handleChange();
  },
);

watch(
  () => props.value,
  () => {
    setExpandedKeys();
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

/**
 * 展开选中节点
 */
function setExpandedKeys() {
  treeExpandedKeys.value = [];

  if (treeData.value === null || treeData.value.length === 0) {
    return;
  }

  let pathArray: any[] = [];
  // value 有值
  if (isString(props.value) || isNumber(props.value)) {
    pathArray = findPath(treeData.value, (n) => n.value === props.value);
  } else if (Array.isArray(props.value)) {
    props.value.forEach((item) => {
      pathArray = [
        ...pathArray,
        ...findPath(treeData.value, (n) => n.value === item),
      ];
    });
  }
  if (pathArray && pathArray.length > 1) {
    // 去掉最后一级（当前节点不需要展开）
    pathArray = pathArray.slice(0, -1);
    pathArray.forEach((item) => {
      treeExpandedKeys.value.push(item.key);
    });
  }
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
    @tree-expand="treeExpand"
  />
</template>
