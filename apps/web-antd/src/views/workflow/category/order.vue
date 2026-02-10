<script lang="ts" setup>
import type { TreeProps } from 'ant-design-vue';
import type { AntTreeNodeDropEvent } from 'ant-design-vue/lib/tree';

import type { WorkflowCategory } from '#/api';

import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { listToTree, treeToList } from '@vben/utils';

import { Alert, Space, Tree } from 'ant-design-vue';

import {
  saveWorkflowCategoryOrderApi,
  selectAllWorkflowCategoryApi,
} from '#/api';
import { ButtonClose, ButtonSave } from '#/components/button';

const emit = defineEmits(['success']);

const saveBtnLoading = ref(false);

const treeData = ref<TreeProps['treeData']>([]);

async function handleSave() {
  try {
    saveBtnLoading.value = true;

    setProps(treeData.value, undefined);

    const params: WorkflowCategory[] = [];
    treeToList(treeData.value).forEach((item) => {
      const { id, parentId, orderNo } = item;
      params.push({
        id,
        parentId,
        orderNo,
      });
    });

    await saveWorkflowCategoryOrderApi(params);
    emit('success');
    drawerApi.close();
  } catch (error) {
    console.error('保存失败', error);
  } finally {
    saveBtnLoading.value = false;
  }
}

const [Modal, drawerApi] = useVbenModal({
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      drawerApi.setLoading(true);
      selectAllWorkflowCategoryApi().then((res) => {
        treeData.value = listToTree(res);
      });
      drawerApi.setLoading(false);
    }
  },
});

function setProps(
  treeNodes: TreeProps['treeData'],
  parentId: string | undefined,
) {
  if (treeNodes) {
    let index = 1;
    treeNodes.forEach((item) => {
      item.orderNo = index;
      item.parentId = parentId;
      if (item.children && item.children.length > 0) {
        setProps(item.children, item.id);
      }
      index++;
    });
  }
}

function onDrop(info: AntTreeNodeDropEvent) {
  const dropKey = info.node.key;
  const dragKey = info.dragNode.key;
  // @ts-ignore
  const dropPos = info.node.pos.split('-');
  const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
  const loop = (
    data: TreeProps['treeData'],
    key: number | string,
    callback: any,
  ) => {
    // @ts-ignore
    data.forEach((item, index) => {
      if (item.key === key) {
        return callback(item, index, data);
      }
      if (item.children) {
        return loop(item.children, key, callback);
      }
    });
  };
  // @ts-ignore
  const data = [...treeData.value];

  // Find dragObject
  let dragObj: TreeDataItem;
  loop(
    data,
    dragKey,
    (item: TreeDataItem, index: number, arr: TreeProps['treeData']) => {
      // @ts-ignore
      arr.splice(index, 1);
      dragObj = item;
    },
  );
  if (!info.dropToGap) {
    // Drop on the content
    loop(data, dropKey, (item: TreeDataItem) => {
      item.children = item.children || [];
      // / where to insert 示例添加到头部，可以是随意位置
      item.children.unshift(dragObj);
    });
  } else if (
    (info.node.children || []).length > 0 && // Has children
    info.node.expanded && // Is expanded
    dropPosition === 1 // On the bottom gap
  ) {
    loop(data, dropKey, (item: TreeDataItem) => {
      item.children = item.children || [];
      // where to insert 示例添加到头部，可以是随意位置
      item.children.unshift(dragObj);
    });
  } else {
    let ar: TreeProps['treeData'] = [];
    let i = 0;
    loop(
      data,
      dropKey,
      (_item: TreeDataItem, index: number, arr: TreeProps['treeData']) => {
        ar = arr;
        i = index;
      },
    );
    if (dropPosition === -1) {
      // @ts-ignore
      ar.splice(i, 0, dragObj);
    } else {
      // @ts-ignore
      ar.splice(i + 1, 0, dragObj);
    }
  }
  treeData.value = data;
}
</script>
<template>
  <Modal class="w-[600px]" title="流程分类排序">
    <Alert
      banner
      class="mb-2"
      message="拖动节点更改流程分类顺序或结构"
      type="info"
    />

    <Tree
      :tree-data="treeData"
      block-node
      class="draggable-tree"
      draggable
      @drop="onDrop"
    />

    <template #footer>
      <Space>
        <ButtonClose @click="drawerApi.close()" />
        <ButtonSave :loading="saveBtnLoading" @click="handleSave" />
      </Space>
    </template>
  </Modal>
</template>
