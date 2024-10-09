<script setup lang="ts">
import type { TreeItem } from '#/components/tree/src/props';

import { onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';
import { convertCheckedKeys, listToTree } from '@vben/utils';

import { Col, Row } from 'ant-design-vue';

import { selectAllApi } from '#/api/auth/sysPermission';
import { BasicTree } from '#/components/tree';

const menuTreeData = ref<TreeItem[]>([]);

const checkedKeys = ref<KeyType[]>([
  'c25cf52649878c66073c4ac0d691e86b',
  '7da1f5456b340b1fc94e8bb8e8ae5e8f',
]);

onMounted(() => {
  selectAllApi().then((res) => {
    menuTreeData.value = listToTree(res);

    checkedKeys.value = convertCheckedKeys(
      menuTreeData.value,
      checkedKeys.value,
    );
  });
});
</script>

<template>
  <Page>
    <Row :gutter="16">
      <Col :lg="12" :md="24" :xl="8">
        <BasicTree
          v-model:value="checkedKeys"
          :height="280"
          :tree-data="menuTreeData"
          class="mb-4"
          title="基础树"
        />
      </Col>
      <Col :lg="12" :md="24" :xl="8">
        <BasicTree
          v-if="menuTreeData.length > 0"
          v-model:value="checkedKeys"
          :default-expand-level="1"
          :height="280"
          :tree-data="menuTreeData"
          class="mb-4"
          title="默认展开第一层"
        />
      </Col>
      <Col :lg="12" :md="24" :xl="8">
        <BasicTree
          v-model:value="checkedKeys"
          :height="280"
          :show-search="true"
          :show-toolbar="true"
          :tree-data="menuTreeData"
          class="mb-4"
          title="支持搜索&工具栏"
        />
      </Col>
      <Col :lg="12" :md="24" :xl="8">
        <BasicTree
          v-model:value="checkedKeys"
          :height="280"
          :show-search="true"
          :show-toolbar="true"
          :tree-data="menuTreeData"
          checkable
          class="mb-4"
          title="支持勾选"
        />
      </Col>
      <Col :lg="12" :md="24" :xl="8">
        <BasicTree
          v-model:value="checkedKeys"
          :height="280"
          :show-search="true"
          :show-toolbar="true"
          :tree-data="menuTreeData"
          checkable
          class="mb-4"
          size="small"
          title="小尺寸"
        />
      </Col>
    </Row>
  </Page>
</template>

<style scoped></style>
