<script setup lang="ts">
import type { TreeDataItem } from 'ant-design-vue/es/tree/Tree';

import type { TreeNode } from '#/api';

import { ref } from 'vue';

import { ColPage } from '@vben/common-ui';
import { useUserStore } from '@vben/stores';
import { listToTree } from '@vben/utils';

import { selectAllSysDeptApi } from '#/api';
import { BasicTree } from '#/components/tree';

import UserList from './components/user-list.vue';

const userStore = useUserStore();

const deptTreeData = ref<TreeDataItem[]>([]);
const selectedKeys = ref<string[]>([userStore.userInfo?.deptId]);

function initData() {
  selectAllSysDeptApi().then((res) => {
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
    deptTreeData.value = listToTree(treeNodes);
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
        v-if="deptTreeData.length > 0"
        v-model:selected-keys="selectedKeys"
        :default-expand-level="1"
        :tree-data="deptTreeData"
        :show-search="true"
        title="部门"
      />
    </template>
    <div class="ml-2 h-full">
      <UserList :dept-id="selectedKeys[0]" />
    </div>
  </ColPage>
</template>

<style scoped></style>
