<script lang="ts" setup>
import type { TreeDataItem } from 'ant-design-vue/es/tree/Tree';

import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { CmsColumn, CmsColumnMember, SysUserVO } from '#/api';

import { computed, onMounted, ref, watch } from 'vue';

import { AccessControl } from '@vben/access';
import { ColPage, useVbenModal } from '@vben/common-ui';
import { formatToDateTime, listToTree } from '@vben/utils';

import {
  Alert,
  Button,
  Empty,
  message,
  Modal,
  Popconfirm,
  Space,
} from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  addCmsColumnMembersApi,
  removeCmsColumnMembersApi,
  selectCmsColumnApi,
  selectCmsColumnMembersApi,
} from '#/api';
import { ButtonAdd } from '#/components/button';
import CmsSiteSwitcher from '#/components/cms/cms-site-switcher.vue';
import { BasicTree } from '#/components/tree';
import UserPickerModal from '#/components/user/src/components/user-picker-modal.vue';
import { useCmsSiteStore } from '#/store';

const cmsSiteStore = useCmsSiteStore();
const hasActiveSite = computed(() => cmsSiteStore.hasActiveSite);

const treeData = ref<TreeDataItem[]>([]);
const selectedKeys = ref<string[]>([]);
const activeColumnId = ref('');
const treeLoading = ref(false);

const activeColumn = computed(() => {
  const findNode = (nodes: TreeDataItem[]): null | TreeDataItem => {
    for (const node of nodes) {
      if (String(node.key) === activeColumnId.value) {
        return node;
      }
      if (node.children?.length) {
        const found = findNode(node.children as TreeDataItem[]);
        if (found) {
          return found;
        }
      }
    }
    return null;
  };
  return findNode(treeData.value);
});

const formOptions: VbenFormProps = {
  collapsed: false,
  showCollapseButton: false,
  schema: [
    {
      fieldName: 'keyword',
      label: '关键字',
      component: 'Input',
      componentProps: {
        placeholder: '用户名 / 昵称 / 部门',
      },
    },
  ],
};

const gridOptions: VxeGridProps<CmsColumnMember> = {
  id: 'cms-column-user',
  rowConfig: {
    keyField: 'userId',
  },
  columns: [
    { type: 'checkbox', width: 50 },
    { title: '用户名', field: 'username', minWidth: 120 },
    { title: '昵称', field: 'nickname', minWidth: 120 },
    { title: '部门', field: 'deptName', minWidth: 160 },
    {
      title: '授权时间',
      field: 'createDate',
      minWidth: 160,
      formatter: ({ cellValue }) => formatToDateTime(cellValue) || '-',
    },
    { title: '操作', field: 'action', width: 140, slots: { default: 'action' } },
  ],
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        if (!activeColumnId.value) {
          return { records: [], total: 0 };
        }
        return await selectCmsColumnMembersApi(
          activeColumnId.value,
          formValues,
          page,
        );
      },
    },
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  tableTitle: '栏目成员权限',
  formOptions,
  gridOptions,
});

const [PickerModal, pickerModalApi] = useVbenModal({
  connectedComponent: UserPickerModal,
});

function refreshMembers() {
  gridApi.query();
}

watch(
  selectedKeys,
  (keys) => {
    const columnId = String(keys[0] ?? '');
    if (activeColumnId.value === columnId) {
      return;
    }
    activeColumnId.value = columnId;
    refreshMembers();
  },
  { deep: true },
);

function openPicker() {
  if (!activeColumnId.value) {
    message.warning('请先选择栏目');
    return;
  }
  pickerModalApi.setData({
    range: 'all',
    selectedIds: [],
  });
  pickerModalApi.open();
}

async function handlePickerConfirm(users: SysUserVO[]) {
  if (!activeColumnId.value) {
    return;
  }
  const userIds = users.map((user) => user.id).filter(Boolean);
  if (userIds.length === 0) {
    return;
  }
  await addCmsColumnMembersApi(activeColumnId.value, userIds);
  message.success('添加成功');
  refreshMembers();
}

async function removeOne(row: CmsColumnMember) {
  if (!activeColumnId.value) {
    return;
  }
  await removeCmsColumnMembersApi(activeColumnId.value, row.userId);
  message.success('移除成功');
  refreshMembers();
}

function batchRemove() {
  if (!activeColumnId.value) {
    return;
  }
  const rows = (gridApi.grid?.getCheckboxRecords() as CmsColumnMember[]) ?? [];
  if (rows.length === 0) {
    message.warning('请选择要移除的用户');
    return;
  }
  Modal.confirm({
    title: `确定移除选中的 ${rows.length} 位用户吗？`,
    onOk: async () => {
      const userIds = rows.map((item) => item.userId).join(',');
      await removeCmsColumnMembersApi(activeColumnId.value, userIds);
      message.success('移除成功');
      refreshMembers();
    },
  });
}

async function loadColumnTree() {
  if (!cmsSiteStore.hasActiveSite) {
    treeData.value = [];
    activeColumnId.value = '';
    selectedKeys.value = [];
    refreshMembers();
    return;
  }
  treeLoading.value = true;
  try {
    const columns = (await selectCmsColumnApi()) ?? [];
    const nodes = columns.map((item: CmsColumn) => ({
      ...item,
      key: item.id,
      title: item.name,
      value: item.id,
    }));
    treeData.value = listToTree(nodes) as TreeDataItem[];

    const stillExists = columns.some(
      (item) => item.id === activeColumnId.value,
    );
    if (!stillExists) {
      const firstId = columns[0]?.id ?? '';
      activeColumnId.value = firstId;
      selectedKeys.value = firstId ? [firstId] : [];
    }
    refreshMembers();
  } finally {
    treeLoading.value = false;
  }
}

watch(
  () => cmsSiteStore.activeSiteId,
  () => {
    void loadColumnTree();
  },
);

onMounted(async () => {
  await cmsSiteStore.ensureLoaded();
  await loadColumnTree();
});
</script>

<template>
  <ColPage
    :left-collapsible="false"
    :left-min-width="22"
    :left-width="26"
    :resizable="true"
    :split-handle="true"
    :split-line="true"
    auto-content-height>
    <template #left>
      <div class="mr-2 h-full">
        <Alert
          v-if="!hasActiveSite"
          banner
          class="mb-2"
          message="请先选择当前编辑站点"
          type="warning" />
        <BasicTree
          v-else-if="treeData.length > 0 || treeLoading"
          v-model:selected-keys="selectedKeys"
          :default-expand-level="2"
          :loading="treeLoading"
          :show-search="true"
          :tree-data="treeData"
          title="栏目树" />
        <Empty
          v-else
          class="mt-12"
          description="暂无栏目"
          :image="Empty.PRESENTED_IMAGE_SIMPLE" />
      </div>
    </template>

    <div class="ml-2 h-full">
      <Grid>
        <template #toolbar-tools>
          <Space>
            <span class="text-muted-foreground">
              {{
                activeColumn ? `当前栏目：${activeColumn.title}` : '请选择栏目'
              }}
            </span>
            <ButtonAdd
              :auth-codes="['cms:column:user:save']"
              :disabled="!activeColumnId"
              text="添加成员"
              @click="openPicker" />
            <AccessControl :codes="['cms:column:user:remove']">
              <Button
                :disabled="!activeColumnId"
                danger
                @click="batchRemove">
                批量移除
              </Button>
            </AccessControl>
          </Space>
        </template>
        <template #action="{ row }">
          <Popconfirm
            cancel-text="取消"
            ok-text="确定"
            title="确定移除该用户吗？"
            @confirm="removeOne(row)">
            <AccessControl :codes="['cms:column:user:remove']">
              <Button danger size="small" type="link"> 移除 </Button>
            </AccessControl>
          </Popconfirm>
        </template>
      </Grid>
    </div>

    <PickerModal @confirm="handlePickerConfirm" />
    <CmsSiteSwitcher />
  </ColPage>
</template>
