<script lang="ts" setup>
import type { TreeSelectProps } from 'ant-design-vue';

import type { ApiTreeSelectProps } from '../props';

import { onMounted, ref, unref, watch } from 'vue';

import { cn, findPath, isFunction, isNumber, isString } from '@vben/utils';

import { get } from '@vueuse/shared';
import { TreeSelect } from 'ant-design-vue';

import { HighlightText } from '#/components/highlight-text';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<ApiTreeSelectProps>(), {
  multiple: false,
  immediate: true,
  treeNodeFilterProp: 'label',
});

const emit = defineEmits(['optionsChange', 'change', 'update:value']);

const currentValue = ref<Array<string> | string | undefined>();
const searchValue = ref('');

const treeData = ref<TreeSelectProps['treeData']>([]);
const isFirstLoaded = ref(false);
const loading = ref(false);
const treeExpandedKeys = ref([]);

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

watch(
  () => props.params,
  () => {
    unref(isFirstLoaded) && fetch();
  },
  { deep: true },
);

watch(
  () => props.t,
  () => {
    unref(isFirstLoaded) && fetch();
  },
);

watch(
  () => props.immediate,
  (v) => {
    v && unref(isFirstLoaded) && fetch();
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
    v-model:tree-expanded-keys="treeExpandedKeys"
    v-model:value="currentValue"
    :class="cn(props.class, 'w-full')"
    :multiple="props.multiple"
    :tree-data="treeData"
    :tree-node-filter-prop="treeNodeFilterProp"
    allow-clear
    show-search
    @change="handleChange"
    @tree-expand="treeExpand"
  >
    <template #title="{ label }">
      <!-- 高亮关键字 -->
      <template v-if="label">
        <HighlightText :keyword="searchValue" :text="label" />
      </template>
    </template>
  </TreeSelect>
</template>
