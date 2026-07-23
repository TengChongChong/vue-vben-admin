<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { SysTenantBrief } from '#/api';

import { computed, nextTick, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Button, message, Radio, RadioGroup, Space } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  selectPackageTenantsApi,
  syncPackageMenusApi,
  syncTenantPackageMenusApi,
} from '#/api';

const emit = defineEmits(['success']);

const packageId = ref('');
const tenantId = ref('');
const packageName = ref('');
const loading = ref(false);

const isPackageMode = computed(() => !!packageId.value && !tenantId.value);

const modeOptions = [
  {
    value: 'add_only',
    label: '仅追加',
    desc: '将套餐新增菜单补到目标角色，不删除已有权限',
  },
  {
    value: 'replace_admin',
    label: '全量替换管理员',
    desc: '将租户管理员角色菜单重置为当前套餐菜单',
  },
  {
    value: 'clip_all',
    label: '裁剪越权',
    desc: '移除所有角色中超出套餐范围的菜单',
  },
  {
    value: 'add_and_clip',
    label: '追加并裁剪',
    desc: '管理员先获得套餐新增项，再裁剪所有角色越权菜单',
  },
] as const;

const scopeOptions = [
  { value: 'admin_only', label: '仅管理员角色' },
  { value: 'all_roles', label: '全部业务角色' },
] as const;

const [SyncForm, syncFormApi] = useVbenForm({
  showDefaultActions: false,
  schema: [
    {
      fieldName: 'mode',
      label: '同步模式',
      component: 'RadioGroup',
      defaultValue: 'add_only',
      rules: 'selectRequired',
    },
    {
      fieldName: 'scope',
      label: '作用范围',
      component: 'RadioGroup',
      defaultValue: 'admin_only',
      componentProps: {
        options: scopeOptions.map(({ value, label }) => ({ value, label })),
      },
      dependencies: {
        show: (values) => values.mode === 'add_only',
        triggerFields: ['mode'],
      },
      rules: 'selectRequired',
    },
  ],
});

const formOptions: VbenFormProps = {
  collapsed: true,
  showCollapseButton: false,
  schema: [
    {
      fieldName: 'tenantCode',
      label: '租户编码',
      component: 'Input',
    },
    {
      fieldName: 'name',
      label: '租户名称',
      component: 'Input',
    },
  ],
};

const gridOptions: VxeGridProps<SysTenantBrief> = {
  id: 'sys-tenant-package-sync-tenants',
  height: 320,
  rowConfig: {
    keyField: 'id',
  },
  checkboxConfig: {
    reserve: true,
    highlight: true,
    range: false,
  },
  toolbarConfig: {
    enabled: false,
  },
  columns: [
    { type: 'checkbox', width: 50 },
    { title: '租户编码', field: 'tenantCode', minWidth: 140 },
    { title: '租户名称', field: 'name', minWidth: 180 },
  ],
  proxyConfig: {
    autoLoad: false,
    ajax: {
      query: async ({ page }, formValues) => {
        if (!packageId.value) {
          return { records: [], total: 0 };
        }
        return await selectPackageTenantsApi(
          packageId.value,
          { ...formValues },
          page,
        );
      },
    },
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions,
  gridOptions,
  separator: false,
  showSearchForm: true,
});

function getSelectedTenantIds() {
  const grid = gridApi.grid;
  if (!grid) {
    return [];
  }
  const current = grid.getCheckboxRecords() as SysTenantBrief[];
  const reserved = grid.getCheckboxReserveRecords() as SysTenantBrief[];
  const idSet = new Set<string>();
  [...current, ...reserved].forEach((item) => {
    if (item.id) {
      idSet.add(item.id);
    }
  });
  return [...idSet];
}

async function handleConfirm() {
  try {
    const { valid } = await syncFormApi.validate();
    if (!valid) {
      return;
    }
    loading.value = true;
    const { mode, scope } = await syncFormApi.getValues();
    let result;
    if (isPackageMode.value) {
      const selectedTenantIds = getSelectedTenantIds();
      if (selectedTenantIds.length === 0) {
        message.warning('请至少选择一个租户');
        return;
      }
      result = await syncPackageMenusApi(packageId.value, {
        mode,
        scope,
        tenantIds: selectedTenantIds,
      });
    } else {
      result = await syncTenantPackageMenusApi(tenantId.value, {
        mode,
        scope,
      });
    }
    const skipped = result.skippedTenantIds?.length ?? 0;
    message.success(
      `同步完成：更新 ${result.updatedRoleCount} 个角色${
        skipped > 0 ? `，跳过 ${skipped} 个租户` : ''
      }`,
    );
    emit('success');
    modalApi.close();
  } catch {
    message.error('同步失败，请稍后重试');
  } finally {
    loading.value = false;
  }
}

const [Modal, modalApi] = useVbenModal({
  onOpenChange: async (isOpen: boolean) => {
    if (isOpen) {
      const data = modalApi.getData<{
        packageId?: string;
        packageName?: string;
        tenantId?: string;
      }>();
      packageId.value = data?.packageId ?? '';
      tenantId.value = data?.tenantId ?? '';
      packageName.value = data?.packageName ?? '';
      await syncFormApi.resetForm();
      await syncFormApi.setValues({ mode: 'add_only', scope: 'admin_only' });
      if (isPackageMode.value) {
        await nextTick();
        gridApi.grid?.clearCheckboxReserve();
        await gridApi.query();
      }
    } else {
      gridApi.grid?.clearCheckboxReserve();
    }
  },
});

defineExpose({
  open: modalApi.open,
  setData: modalApi.setData,
});
</script>

<template>
  <Modal
    :title="
      isPackageMode
        ? `同步套餐菜单${packageName ? ` · ${packageName}` : ''}`
        : '从套餐同步菜单'
    "
    class="w-[800px]">
    <div class="space-y-4">
      <div v-if="isPackageMode">
        <div class="mb-2 text-sm font-medium">选择租户</div>
        <Grid />
      </div>

      <SyncForm>
        <template #mode="slotProps">
          <RadioGroup v-bind="slotProps" class="sync-mode-group">
            <Radio
              v-for="item in modeOptions"
              :key="item.value"
              :value="item.value"
              class="sync-mode-item">
              <div>
                <div class="font-medium">{{ item.label }}</div>
                <div class="text-muted-foreground text-xs">{{ item.desc }}</div>
              </div>
            </Radio>
          </RadioGroup>
        </template>
      </SyncForm>
    </div>

    <template #footer>
      <Space>
        <Button @click="modalApi.close()">取消</Button>
        <Button :loading="loading" type="primary" @click="handleConfirm">
          开始同步
        </Button>
      </Space>
    </template>
  </Modal>
</template>

<style scoped>
.sync-mode-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sync-mode-group :deep(.ant-radio-wrapper) {
  align-items: flex-start;
  margin-inline-end: 0;
}

.sync-mode-item {
  width: 100%;
}
</style>
