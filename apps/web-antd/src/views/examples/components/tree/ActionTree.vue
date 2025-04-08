<script lang="ts">
import type { TreeItem } from '#/components/tree/src/types';

import { BasicTree } from '#/components/tree';
import { Page } from '@vben/common-ui';
import { Button, message } from 'ant-design-vue';
import { defineComponent, ref, unref } from 'vue';

export default defineComponent({
  name: 'SampleCompTreeActionTree',
  components: { Page, BasicTree, Button },
  setup() {
    const treeRef = ref(null);

    const treeData: TreeItem[] = [
      {
        title: 'parent ',
        key: '0-0',
        children: [
          { title: 'leaf', key: '0-0-0' },
          {
            title: 'leaf',
            key: '0-0-1',
            children: [
              {
                title: 'leaf',
                key: '0-0-0-0',
                children: [{ title: 'leaf', key: '0-0-0-0-1' }],
              },
              { title: 'leaf', key: '0-0-0-1' },
            ],
          },
        ],
      },
      {
        title: 'parent 2',
        key: '1-1',
        children: [
          { title: 'leaf', key: '1-1-0' },
          { title: 'leaf', key: '1-1-1' },
        ],
      },
      {
        title: 'parent 3',
        key: '2-2',
        children: [
          { title: 'leaf', key: '2-2-0' },
          { title: 'leaf', key: '2-2-1' },
        ],
      },
    ];

    function getTree() {
      const tree = unref(treeRef);
      if (!tree) {
        throw new Error('tree is null!');
      }
      return tree;
    }

    function handleLevel(level: number) {
      getTree().filterByLevel(level);
    }

    function handleSetCheckData() {
      getTree().setCheckedKeys(['0-0']);
    }

    function handleGetCheckData() {
      const keys = getTree().getCheckedKeys();
      message.success(JSON.stringify(keys));
    }

    function handleSetSelectData() {
      getTree().setSelectedKeys(['0-0']);
    }

    function handleGetSelectData() {
      const keys = getTree().getSelectedKeys();
      message.success(JSON.stringify(keys));
    }

    function handleGetSelectNode() {
      const keys = getTree().getSelectedKeys();
      const node = getTree().getSelectedNode(keys[0]);
      message.success(node === null ? null : JSON.stringify(node));
    }

    function handleSetExpandData() {
      getTree().setExpandedKeys(['0-0']);
    }

    function handleGetExpandData() {
      const keys = getTree().getExpandedKeys();
      message.success(JSON.stringify(keys));
    }

    function checkAll(checkAll: boolean) {
      getTree().checkAll(checkAll);
    }

    function expandAll(checkAll: boolean) {
      getTree().expandAll(checkAll);
    }

    function appendNodeByKey(parentKey: null | string = null) {
      getTree().insertNodeByKey({
        parentKey,
        node: {
          title: '新增节点',
          key: '2-2-2',
        },
        // 往后插入
        push: 'push',
        // 往前插入
        // push:'unshift'
      });
    }

    function deleteNodeByKey(key: string) {
      getTree().deleteNodeByKey(key);
    }

    function updateNodeByKey(key: string) {
      getTree().updateNodeByKey(key, {
        title: 'parent2-new',
      });
    }

    return {
      treeData,
      treeRef,
      handleLevel,
      handleSetCheckData,
      handleGetCheckData,
      handleSetSelectData,
      handleGetSelectData,
      handleSetExpandData,
      handleGetExpandData,
      handleGetSelectNode,
      appendNodeByKey,
      deleteNodeByKey,
      updateNodeByKey,
      checkAll,
      expandAll,
    };
  },
});
</script>
<template>
  <Page>
    <div class="mb-4">
      <Button class="mr-2" @click="expandAll(true)"> 展开全部 </Button>
      <Button class="mr-2" @click="expandAll(false)"> 折叠全部 </Button>
      <Button class="mr-2" @click="checkAll(true)"> 全选 </Button>
      <Button class="mr-2" @click="checkAll(false)"> 全不选 </Button>
      <Button class="mr-2" @click="handleLevel(2)"> 显示到第2级 </Button>
      <Button class="mr-2" @click="handleLevel(1)"> 显示到第1级 </Button>
    </div>
    <div class="mb-4">
      <Button class="mr-2" @click="handleSetCheckData"> 设置勾选数据 </Button>
      <Button class="mr-2" @click="handleGetCheckData"> 获取勾选数据 </Button>
      <Button class="mr-2" @click="handleSetSelectData"> 设置选中数据 </Button>
      <Button class="mr-2" @click="handleGetSelectData"> 获取选中数据 </Button>
      <Button class="mr-2" @click="handleGetSelectNode"> 获取选中节点 </Button>

      <Button class="mr-2" @click="handleSetExpandData"> 设置展开数据 </Button>
      <Button class="mr-2" @click="handleGetExpandData"> 获取展开数据 </Button>
    </div>
    <div class="mb-4">
      <Button class="mr-2" @click="appendNodeByKey(null)"> 添加根节点 </Button>
      <Button class="mr-2" @click="appendNodeByKey('2-2')">
        添加在parent3内添加节点
      </Button>
      <Button class="mr-2" @click="deleteNodeByKey('2-2')">
        删除parent3节点
      </Button>
      <Button class="mr-2" @click="updateNodeByKey('1-1')">
        更新parent2节点
      </Button>
    </div>
    <BasicTree
      ref="treeRef"
      :checkable="true"
      :tree-data="treeData"
      title="函数操作"
    />
  </Page>
</template>
