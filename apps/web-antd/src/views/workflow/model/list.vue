<script setup lang="ts">
import type { TreeDataItem } from 'ant-design-vue/es/tree/Tree';

import type { TreeNode } from '#/api/base/model/tree-model';

import { ref } from 'vue';

import { ColPage } from '@vben/common-ui';
import { listToTree } from '@vben/utils';

import { selectAllApi } from '#/api/workflow/workflow-category';
import { BasicTree } from '#/components/tree';

import ModelList from './components/list.vue';

const treeData = ref<TreeDataItem[]>([]);
const selectedKeys = ref<string[]>([]);

function initData() {
  selectAllApi().then((res) => {
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
    treeData.value = listToTree(treeNodes);
  });
}

initData();
</script>

<template>
  <ColPage
    :resizable="true"
    :split-line="true"
    :split-handle="true"
    :left-collapsible="false"
    :left-min-width="20"
    :left-width="20"
    auto-content-height
  >
    <template #left>
      <BasicTree
        class="mr-2"
        v-if="treeData.length > 0"
        v-model:selected-keys="selectedKeys"
        :default-expand-level="1"
        :tree-data="treeData"
        :show-search="true"
        title="模型分类"
      />
    </template>
    <div class="ml-2 h-full">
      <ModelList :category-id="selectedKeys[0]" />
    </div>
  </ColPage>
</template>

<style scoped></style>
