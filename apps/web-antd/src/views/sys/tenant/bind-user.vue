<script lang="ts" setup>
import type { SessionTenant } from '#/api';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message, Radio, RadioGroup, Space } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import {
  listSysTenantOptionsApi,
  listUserTenantsApi,
  saveUserTenantsApi,
} from '#/api';
import { ButtonClose, ButtonSave } from '#/components/button';

const emit = defineEmits(['success']);

const saveBtnLoading = ref(false);
const tenantOptions = ref<SessionTenant[]>([]);
const selectedTenantIds = ref<string[]>([]);
const defaultTenantId = ref<string>();

const tenantCheckboxOptions = computed(() =>
  tenantOptions.value.map((item) => ({
    label: `${item.name}（${item.tenantCode}）`,
    value: item.id,
  })),
);

const [BaseForm, baseFormApi] = useVbenForm({
  showDefaultActions: false,
  schema: [
    {
      fieldName: 'userId',
      label: '用户',
      component: 'UserSelect',
      rules: 'selectRequired',
      componentProps: {
        onChange: async (userId: string) => {
          await loadUserTenants(userId);
        },
      },
    },
  ],
});

async function loadTenantOptions() {
  tenantOptions.value = await listSysTenantOptionsApi();
}

async function loadUserTenants(userId?: string) {
  selectedTenantIds.value = [];
  defaultTenantId.value = undefined;
  if (!userId) {
    return;
  }
  const userTenants = await listUserTenantsApi(userId);
  selectedTenantIds.value = userTenants.map((item) => item.id);
  defaultTenantId.value =
    userTenants.find((item) => item.isDefault === '1')?.id ||
    selectedTenantIds.value[0];
}

function handleTenantChange(values: string[]) {
  selectedTenantIds.value = values;
  if (
    defaultTenantId.value &&
    !selectedTenantIds.value.includes(defaultTenantId.value)
  ) {
    defaultTenantId.value = selectedTenantIds.value[0];
  }
}

async function handleSave() {
  try {
    saveBtnLoading.value = true;
    const { valid } = await baseFormApi.validate();
    if (!valid) {
      return;
    }
    if (selectedTenantIds.value.length === 0) {
      message.warning('请至少选择一个租户');
      return;
    }
    if (!defaultTenantId.value) {
      message.warning('请选择默认租户');
      return;
    }
    modalApi.lock();
    const { userId } = await baseFormApi.getValues();
    await saveUserTenantsApi({
      userId,
      tenantIds: selectedTenantIds.value,
      defaultTenantId: defaultTenantId.value,
    });
    message.success('绑定成功');
    emit('success');
    modalApi.close();
  } catch (error) {
    modalApi.unlock();
    console.error('绑定失败', error);
  } finally {
    saveBtnLoading.value = false;
  }
}

const [Modal, modalApi] = useVbenModal({
  onOpenChange: async (isOpen: boolean) => {
    if (isOpen) {
      modalApi.setState({ loading: true });
      try {
        await baseFormApi.resetForm();
        await loadTenantOptions();
        const data = modalApi.getData<Record<string, any>>();
        if (data.userId) {
          await baseFormApi.setValues({ userId: data.userId });
          await loadUserTenants(data.userId);
        } else {
          selectedTenantIds.value = [];
          defaultTenantId.value = undefined;
        }
      } finally {
        modalApi.setState({ loading: false });
      }
    }
  },
});
</script>
<template>
  <Modal class="w-[640px]" title="用户租户绑定">
    <BaseForm />

    <div class="mt-4">
      <div class="mb-2 font-medium">可访问租户</div>
      <a-checkbox-group
        :options="tenantCheckboxOptions"
        :value="selectedTenantIds"
        class="flex flex-col gap-2"
        @change="handleTenantChange" />
    </div>

    <div v-if="selectedTenantIds.length > 0" class="mt-4">
      <div class="mb-2 font-medium">默认租户</div>
      <RadioGroup v-model:value="defaultTenantId">
        <Space direction="vertical">
          <Radio
            v-for="item in tenantOptions.filter((tenant) =>
              selectedTenantIds.includes(tenant.id),
            )"
            :key="item.id"
            :value="item.id">
            {{ item.name }}（{{ item.tenantCode }}）
          </Radio>
        </Space>
      </RadioGroup>
    </div>

    <template #footer>
      <Space>
        <ButtonClose @click="modalApi.close()" />
        <ButtonSave :loading="saveBtnLoading" text="保存" @click="handleSave" />
      </Space>
    </template>
  </Modal>
</template>
