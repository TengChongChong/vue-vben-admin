<script setup lang="ts">
import type { TreeDataItem } from 'ant-design-vue/es/tree/Tree';

import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';
import type { SysUserVO } from '#/api';
import type { UserPickerModalData } from '#/components/user/src/type';

import { nextTick, ref, shallowRef, watch } from 'vue';

import { ColPage, useVbenModal } from '@vben/common-ui';
import { useUserStore } from '@vben/stores';
import { listToTree } from '@vben/utils';

import { message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  selectAllSysDeptApi,
  selectSysUserApi,
  selectUsersByIdsApi,
} from '#/api';
import { BasicTree } from '#/components/tree';
import { pickerColumns } from '#/components/user/src/components/picker-data';
import UserSelectedTags from '#/components/user/src/components/user-selected-tags.vue';
import {
  enrichUserDeptName,
  findDeptTitle,
} from '#/components/user/src/util/user-helpers';

const emit = defineEmits<{
  confirm: [SysUserVO[]];
}>();

const userStore = useUserStore();
const deptTreeData = ref<TreeDataItem[]>([]);
const selectedDeptKeys = ref<string[]>([]);
const selectedMap = shallowRef(new Map<string, SysUserVO>());
const modalConfig = ref<UserPickerModalData>({});
const selectedUsers = ref<SysUserVO[]>([]);
const isInitialized = ref(false);

function updateSelectedUsers() {
  selectedUsers.value = [...selectedMap.value.values()];
}

function syncSelectedMap(users: SysUserVO[]) {
  const nextMap = new Map<string, SysUserVO>();
  users.forEach((user) => {
    if (user.id) {
      nextMap.set(user.id, user);
    }
  });
  selectedMap.value = nextMap;
  updateSelectedUsers();
}

function canSelectMore(count = 1) {
  const maxCount = modalConfig.value.maxCount;
  if (!maxCount) {
    return true;
  }
  return selectedMap.value.size + count <= maxCount;
}

function syncGridCheckboxState() {
  nextTick(() => {
    const grid = gridApi.grid;
    if (!grid) {
      return;
    }
    grid.clearCheckboxRow();
    const tableData = grid.getTableData().fullData as SysUserVO[];
    tableData.forEach((row) => {
      if (row.id && selectedMap.value.has(row.id)) {
        grid.setCheckboxRow(row, true);
      }
    });
  });
}

function normalizeGridUser(row: SysUserVO) {
  return enrichUserDeptName(
    row,
    findDeptTitle(deptTreeData.value, selectedDeptKeys.value[0]),
  );
}

function handleCheckboxChange({
  checked,
  row,
}: {
  checked: boolean;
  row: SysUserVO;
}) {
  if (!row.id) {
    return;
  }

  const nextMap = new Map(selectedMap.value);
  if (checked) {
    if (!canSelectMore()) {
      message.warning(`最多只能选择 ${modalConfig.value.maxCount} 位用户`);
      gridApi.grid?.setCheckboxRow(row, false);
      return;
    }
    nextMap.set(row.id, normalizeGridUser(row));
  } else {
    nextMap.delete(row.id);
  }
  selectedMap.value = nextMap;
  updateSelectedUsers();
}

function handleCheckboxAll({ checked }: { checked: boolean }) {
  const grid = gridApi.grid;
  if (!grid) {
    return;
  }

  const tableData = grid.getTableData().fullData as SysUserVO[];
  const nextMap = new Map(selectedMap.value);

  if (checked) {
    for (const row of tableData) {
      if (!row.id) {
        continue;
      }
      if (!nextMap.has(row.id) && !canSelectMore()) {
        message.warning(`最多只能选择 ${modalConfig.value.maxCount} 位用户`);
        syncGridCheckboxState();
        return;
      }
      nextMap.set(row.id, normalizeGridUser(row));
    }
  } else {
    tableData.forEach((row) => {
      if (row.id) {
        nextMap.delete(row.id);
      }
    });
  }

  selectedMap.value = nextMap;
  updateSelectedUsers();
}

function handleRemoveSelected(id: string) {
  const nextMap = new Map(selectedMap.value);
  nextMap.delete(id);
  selectedMap.value = nextMap;
  updateSelectedUsers();
  syncGridCheckboxState();
}

function handleClearSelected() {
  selectedMap.value = new Map();
  updateSelectedUsers();
  syncGridCheckboxState();
}

const formOptions: VbenFormProps = {
  collapsed: true,
  schema: [
    {
      fieldName: 'username',
      label: '用户名',
      component: 'Input',
    },
    {
      fieldName: 'nickname',
      label: '昵称',
      component: 'Input',
    },
    {
      fieldName: 'phoneNumber',
      label: '手机号',
      component: 'Input',
    },
  ],
};

const gridOptions: VxeGridProps<SysUserVO> = {
  id: 'user-picker-modal',
  height: 320,
  columns: pickerColumns,
  checkboxConfig: {
    range: false,
    reserve: true,
    highlight: true,
  },
  proxyConfig: {
    autoLoad: false,
    ajax: {
      query: async ({ page }, formValues) => {
        const deptId = selectedDeptKeys.value[0];
        if (!deptId) {
          return { records: [], total: 0 };
        }
        return await selectSysUserApi(
          {
            ...formValues,
            deptId,
          },
          page,
        );
      },
      querySuccess: () => {
        syncGridCheckboxState();
      },
    },
  },
};

const gridEvents: VxeGridListeners<SysUserVO> = {
  checkboxAll: handleCheckboxAll,
  checkboxChange: handleCheckboxChange,
};

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions,
  gridEvents,
  gridOptions,
  separator: false,
  showSearchForm: true,
});

async function loadDeptTree() {
  const res = await selectAllSysDeptApi();
  const treeNodes: TreeDataItem[] = [];
  res.forEach((item) => {
    const { id, parentId, title } = item;
    treeNodes.push({
      id,
      key: id,
      parentId,
      title,
    });
  });
  deptTreeData.value = listToTree(treeNodes);
  if (selectedDeptKeys.value.length === 0) {
    const defaultDeptId =
      modalConfig.value.deptId ||
      userStore.userInfo?.deptId ||
      treeNodes[0]?.id;
    if (defaultDeptId) {
      selectedDeptKeys.value = [defaultDeptId];
    }
  }
}

async function initModalData() {
  isInitialized.value = false;
  const data = modalApi.getData<UserPickerModalData>();
  modalConfig.value = data ?? {};
  const selectedIds = data?.selectedIds ?? [];
  if (selectedIds.length > 0) {
    const users = await selectUsersByIdsApi(selectedIds);
    syncSelectedMap(users);
  } else {
    syncSelectedMap([]);
  }
  selectedDeptKeys.value = data?.deptId ? [data.deptId] : [];
  await loadDeptTree();
  await nextTick();
  isInitialized.value = true;
}

watch(
  [() => isInitialized.value, () => selectedDeptKeys.value[0]],
  ([initialized, deptId]) => {
    if (initialized && deptId) {
      gridApi.query();
    }
  },
);

const [Modal, modalApi] = useVbenModal({
  destroyOnClose: true,
  onConfirm() {
    emit('confirm', [...selectedMap.value.values()]);
    modalApi.close();
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      initModalData();
    }
  },
  title: '选择用户',
});
</script>

<template>
  <Modal class="w-[1200px]">
    <div class="user-picker-modal">
      <ColPage
        :left-collapsible="false"
        :left-min-width="30"
        :left-width="30"
        :resizable="true"
        :split-handle="true"
        :split-line="true"
        class="user-picker-modal__body"
      >
        <template #left>
          <BasicTree
            v-if="deptTreeData.length > 0"
            v-model:selected-keys="selectedDeptKeys"
            :default-expand-level="1"
            :show-search="true"
            :tree-data="deptTreeData"
            :use-card="false"
            class="user-picker-modal__tree"
            title="部门"
          />
        </template>

        <div class="user-picker-modal__grid">
          <Grid />
        </div>
      </ColPage>

      <div class="user-picker-modal__selected">
        <UserSelectedTags
          :users="selectedUsers"
          @clear="handleClearSelected"
          @remove="handleRemoveSelected"
        />
      </div>
    </div>
  </Modal>
</template>

<style lang="scss" scoped>
.user-picker-modal {
  display: flex;
  flex-direction: column;
  gap: 12px;

  &__body {
    min-height: 380px;
  }

  &__tree {
    height: 100%;
    margin-right: 8px;
  }

  &__grid {
    height: 100%;
    min-height: 360px;
    margin-left: 8px;
  }

  &__selected {
    padding-top: 12px;
    border-top: 1px solid hsl(var(--border));
  }
}
</style>
