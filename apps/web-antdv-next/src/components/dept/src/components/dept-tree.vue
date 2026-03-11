<script setup lang="ts">
import type { TreeNode, TreeNodeModel } from '#/api';
import type { DeptTreeProps } from '#/components/dept/src/props';

import { onMounted, ref, watch } from 'vue';

import { listToTree } from '@vben/utils';

import { selectAllSysDeptApi } from '#/api';
import { ApiTree } from '#/components/form';

defineOptions({
  inheritAttrs: false,
});
const props = defineProps<DeptTreeProps>();
const emit = defineEmits(['change', 'update:value']);

const currentValue = ref<Array<string> | undefined>();

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
      title,
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
  <ApiTree
    v-bind="$attrs"
    v-model:value="currentValue"
    :after-fetch="afterFetch"
    :api="selectAllSysDeptApi"
    @change="handleChange"
  />
</template>

<style scoped></style>
