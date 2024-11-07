<script setup lang="ts">
import type { TreeDataItem } from 'ant-design-vue/es/tree/Tree';

import type { TreeNode } from '#/api/base/model/tree-model';

import { ref } from 'vue';

import { Page } from '@vben/common-ui';
import { useUserStore } from '@vben/stores';
import { listToTree } from '@vben/utils';

import { selectAllApi } from '#/api/auth/sys-dept';
import { BasicTree } from '#/components/tree';

import UserList from './components/user-list.vue';

const userStore = useUserStore();

const deptTreeData = ref<TreeDataItem[]>([]);
const selectedKeys = ref<string[]>([userStore.userInfo?.deptId]);

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
    deptTreeData.value = listToTree(treeNodes);
  });
}

initData();
</script>

<template>
  <Page auto-content-height>
    <div class="flex flex-wrap">
      <div class="w-[520px]">
        <BasicTree
          v-if="deptTreeData.length > 0"
          v-model:selected-keys="selectedKeys"
          :default-expand-level="1"
          :tree-data="deptTreeData"
          title="部门"
        />
      </div>
      <div class="flex-1" style="min-width: 500px">
        <UserList :dept-id="selectedKeys[0]" />
      </div>
    </div>
  </Page>
</template>

<style scoped></style>
