<script lang="ts" setup>
import type { SessionTenant } from '#/api';

import { computed, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { useTenantStore } from '@vben/stores';

import { Alert, Checkbox, message, Radio, Space, Table } from 'antdv-next';

import {
  listSysTenantOptionsApi,
  listUserTenantsApi,
  saveUserTenantsApi,
  selectUsersByIdsApi,
} from '#/api';
import { ButtonClose, ButtonSave } from '#/components/button';

interface TenantRow extends SessionTenant {
  selected: boolean;
}

const emit = defineEmits(['success']);

const tenantStore = useTenantStore();
const saveBtnLoading = ref(false);
const loading = ref(false);
const userId = ref('');
const userLabel = ref('');
const tenantRows = ref<TenantRow[]>([]);
const defaultTenantId = ref<string>();

const selectedTenantIds = computed(() =>
  tenantRows.value.filter((row) => row.selected).map((row) => row.id),
);

const columns = [
  { title: '租户名称', dataIndex: 'name', key: 'name' },
  { title: '租户编码', dataIndex: 'tenantCode', key: 'tenantCode', width: 140 },
  { title: '可访问', key: 'selected', width: 90 },
];

async function loadData(currentUserId: string) {
  loading.value = true;
  try {
    const [options, boundTenants, users] = await Promise.all([
      listSysTenantOptionsApi(),
      listUserTenantsApi(currentUserId),
      selectUsersByIdsApi(currentUserId),
    ]);
    const user = users[0];
    userLabel.value = user
      ? `${user.nickname ?? ''}（${user.username ?? currentUserId}）`
      : currentUserId;
    const boundMap = new Map(boundTenants.map((item) => [item.id, item]));
    tenantRows.value = options.map((item) => ({
      ...item,
      selected: boundMap.has(item.id),
      isDefault: boundMap.get(item.id)?.isDefault,
    }));
    defaultTenantId.value =
      boundTenants.find((item) => item.isDefault === '1')?.id ||
      boundTenants[0]?.id;
  } finally {
    loading.value = false;
  }
}

function toggleTenant(row: TenantRow, checked: boolean) {
  row.selected = checked;
  if (!checked && defaultTenantId.value === row.id) {
    defaultTenantId.value = selectedTenantIds.value[0];
  }
  if (checked && selectedTenantIds.value.length === 1) {
    defaultTenantId.value = row.id;
  }
}

async function handleSave() {
  if (selectedTenantIds.value.length === 0) {
    message.warning('请至少选择一个租户');
    return;
  }
  if (
    !defaultTenantId.value ||
    !selectedTenantIds.value.includes(defaultTenantId.value)
  ) {
    message.warning('请选择默认租户');
    return;
  }
  try {
    saveBtnLoading.value = true;
    drawerApi.lock();
    await saveUserTenantsApi({
      userId: userId.value,
      tenantIds: selectedTenantIds.value,
      defaultTenantId: defaultTenantId.value,
    });
    message.success('保存成功');
    emit('success');
    drawerApi.close();
  } catch {
    drawerApi.unlock();
    message.error('保存失败，请稍后重试');
  } finally {
    saveBtnLoading.value = false;
  }
}

const [Drawer, drawerApi] = useVbenDrawer({
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const data = drawerApi.getData<{ userId?: string }>();
      userId.value = data?.userId ?? '';
      if (userId.value) {
        loadData(userId.value);
      }
    }
  },
});
</script>

<template>
  <Drawer class="w-[720px]" title="可访问租户">
    <Alert
      v-if="!tenantStore.enabled"
      class="mb-4"
      message="当前未启用多租户模式，保存后将在开启多租户时生效。"
      show-icon
      type="info" />

    <div v-if="userLabel" class="mb-4 text-sm text-gray-600">
      用户：{{ userLabel }}
    </div>

    <div v-if="selectedTenantIds.length > 0" class="mb-4">
      <div class="mb-2 text-sm font-medium">默认租户</div>
      <Radio.Group v-model:value="defaultTenantId">
        <Space direction="vertical">
          <Radio
            v-for="item in tenantRows.filter((row) => row.selected)"
            :key="item.id"
            :value="item.id">
            {{ item.name }}（{{ item.tenantCode }}）
          </Radio>
        </Space>
      </Radio.Group>
    </div>

    <Table
      :columns="columns"
      :data-source="tenantRows"
      :loading="loading"
      :pagination="false"
      row-key="id"
      size="middle">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'selected'">
          <Checkbox
            :checked="record.selected"
            @change="(e) => toggleTenant(record, e.target.checked)" />
        </template>
      </template>
    </Table>

    <template #footer>
      <Space>
        <ButtonClose @click="drawerApi.close()" />
        <ButtonSave :loading="saveBtnLoading" text="保存" @click="handleSave" />
      </Space>
    </template>
  </Drawer>
</template>
