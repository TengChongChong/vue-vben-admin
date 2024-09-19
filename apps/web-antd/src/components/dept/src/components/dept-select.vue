<script setup lang="ts">
import type { TreeNode, TreeNodeModel } from '#/api/base/model/treeModel';

import { onMounted, ref, watch } from 'vue';

import { listToTree } from '@vben/utils';

import { selectAllApi } from '#/api/auth/sysDept';
import { ApiTreeSelect } from '#/components/form';

defineOptions({
  inheritAttrs: false,
});
const props = defineProps<{
  // 支持多选（当设置 treeCheckable 时自动变为 true）
  multiple?: boolean;
  // value
  value: Array<string> | string | undefined;
}>();
const emit = defineEmits(['change', 'update:value']);

const currentValue = ref<Array<string> | string | undefined>();

watch(
  () => props.value,
  () => {
    currentValue.value = props.value;
  },
);

onMounted(() => {
  currentValue.value = props.value;
});

function afterFetch(res: TreeNodeModel[]) {
  const treeNodes: TreeNode[] = [] as TreeNode[];
  res.forEach((item) => {
    const { id, parentId, title } = item;
    treeNodes.push({
      id,
      parentId,
      label: title,
      value: id,
      key: id,
    });
  });
  return listToTree(treeNodes);
}

function handleChange(value) {
  currentValue.value = value;
  emit('change', value);
  emit('update:value', value);
}
</script>

<template>
  <ApiTreeSelect
    v-bind="$attrs"
    v-model:value="currentValue"
    :after-fetch="afterFetch"
    :api="selectAllApi"
    :multiple="props.multiple"
    @change="handleChange"
  />
</template>

<style scoped></style>
