<script lang="ts" setup>
import type { TreeProps } from 'antdv-next';
import type { AntTreeNodeDropEvent } from 'antdv-next/dist/tree/Tree';

import type { CmsColumn } from '#/api';

import { ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { listToTree, treeToList } from '@vben/utils';

import { Alert, message, Space, Tree } from 'antdv-next';

import { saveCmsColumnOrderApi, selectAllCmsColumnApi } from '#/api';
import { ButtonClose, ButtonSave } from '#/components/button';

interface OrderTreeNode {
  children?: OrderTreeNode[];
  id: string;
  key: string;
  orderNo?: number;
  parentId?: string;
  title: string;
}

const emit = defineEmits(['success']);

const saveBtnLoading = ref(false);
const treeData = ref<TreeProps['treeData']>([]);

async function handleSave() {
  try {
    saveBtnLoading.value = true;
    drawerApi.lock();
    setProps(treeData.value as OrderTreeNode[], undefined);

    const params: CmsColumn[] = [];
    treeToList(treeData.value as OrderTreeNode[]).forEach((item) => {
      const { id, parentId, orderNo } = item;
      params.push({ id, parentId, orderNo } as CmsColumn);
    });

    await saveCmsColumnOrderApi(params);
    emit('success');
    drawerApi.close();
  } catch {
    message.error('保存失败，请稍后重试');
  } finally {
    saveBtnLoading.value = false;
    drawerApi.unlock();
  }
}

const [Drawer, drawerApi] = useVbenDrawer({
  async onOpenChange(isOpen: boolean) {
    if (isOpen) {
      drawerApi.setState({ loading: true });
      try {
        const res = await selectAllCmsColumnApi();
        treeData.value = listToTree(
          res.map((item) => ({
            id: item.id,
            parentId: item.parentId,
            key: item.key || item.id,
            title: item.title || item.label,
          })),
        );
      } catch {
        message.error('加载栏目数据失败，请稍后重试');
      } finally {
        drawerApi.setState({ loading: false });
      }
    }
  },
});

function setProps(
  treeNodes: OrderTreeNode[] | undefined,
  parentId: string | undefined,
) {
  if (!treeNodes) {
    return;
  }
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

function onDrop(info: AntTreeNodeDropEvent) {
  const dropKey = info.node.key;
  const dragKey = info.dragNode.key;
  const dropPos = String((info.node as any).pos || '').split('-');
  const dropPosition =
    info.dropPosition - Number(dropPos[dropPos.length - 1] || 0);

  const loop = (
    data: OrderTreeNode[],
    key: number | string,
    callback: (
      item: OrderTreeNode,
      index: number,
      arr: OrderTreeNode[],
    ) => void,
  ) => {
    data.forEach((item, index) => {
      if (item.key === key) {
        return callback(item, index, data);
      }
      if (item.children) {
        return loop(item.children, key, callback);
      }
    });
  };

  const data = [...((treeData.value as OrderTreeNode[]) || [])];
  let dragObj!: OrderTreeNode;
  loop(data, dragKey, (item, index, arr) => {
    arr.splice(index, 1);
    dragObj = item;
  });

  if (!info.dropToGap) {
    loop(data, dropKey, (item) => {
      item.children = item.children || [];
      item.children.unshift(dragObj);
    });
  } else if (
    (info.node.children || []).length > 0 &&
    info.node.expanded &&
    dropPosition === 1
  ) {
    loop(data, dropKey, (item) => {
      item.children = item.children || [];
      item.children.unshift(dragObj);
    });
  } else {
    let ar: OrderTreeNode[] = [];
    let i = 0;
    loop(data, dropKey, (_item, index, arr) => {
      ar = arr;
      i = index;
    });
    if (dropPosition === -1) {
      ar.splice(i, 0, dragObj);
    } else {
      ar.splice(i + 1, 0, dragObj);
    }
  }
  treeData.value = data;
}
</script>

<template>
  <Drawer class="w-[600px]" title="栏目排序">
    <Alert
      banner
      class="mb-2"
      message="拖动节点更改栏目顺序或结构"
      type="info" />
    <Tree
      :tree-data="treeData"
      block-node
      class="draggable-tree"
      draggable
      @drop="onDrop" />
    <template #footer>
      <Space>
        <ButtonClose @click="drawerApi.close()" />
        <ButtonSave
          :auth-codes="['cms:column:save']"
          :loading="saveBtnLoading"
          @click="handleSave" />
      </Space>
    </template>
  </Drawer>
</template>
