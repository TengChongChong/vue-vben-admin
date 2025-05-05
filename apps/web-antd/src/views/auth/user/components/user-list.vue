<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { SysConfig } from '#/api/sys/model/sys-config-model';

import { watch } from 'vue';

import { AccessControl } from '@vben/access';
import { useVbenDrawer, VbenAvatar } from '@vben/common-ui';

import { Button, Divider, Modal, Popconfirm, Space } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  addApi,
  getApi,
  removeApi,
  resetPasswordApi,
  selectApi,
} from '#/api/auth/sys-user';
import { ButtonAdd, ButtonEdit, ButtonRemove } from '#/components/button';
import { LucideRotateCcw } from '#/components/icons';

import { initColumns } from './data';
import InputDrawer from './input.vue';

const props = defineProps<{
  deptId: string;
}>();

watch(
  () => props.deptId,
  () => {
    handleSearch();
  },
);

function handleSearch() {
  gridApi.search();
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
      fieldName: 'phoneNumber',
      label: '手机号',
      component: 'Input',
    },
    {
      fieldName: 'nickname',
      label: '昵称',
      component: 'Input',
    },
  ],
};

const gridOptions: VxeGridProps<SysConfig> = {
  id: 'sys-user',
  columns: initColumns(),
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        return await selectApi({ ...formValues, deptId: props.deptId }, page);
      },
    },
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  tableTitle: '用户信息',
  formOptions,
  gridOptions,
});

const [BaseInputDrawer, baseInputDrawerApi] = useVbenDrawer({
  connectedComponent: InputDrawer,
});

async function handleCreate() {
  addApi(props.deptId).then((res) => {
    baseInputDrawerApi.setData(res);
    baseInputDrawerApi.open();
  });
}

function handleEdit(id: string) {
  getApi(id).then((res) => {
    baseInputDrawerApi.setData(res);
    baseInputDrawerApi.open();
  });
}

const handleResetPassword = (id: string) => {
  resetPasswordApi(id).then((password) => {
    Modal.success({
      title: '重置成功',
      content: `密码已重置为 ${password}，请告知用户使用新密码登录`,
    });
  });
};
</script>

<template>
  <Grid>
    <template #toolbar-tools>
      <Space>
        <ButtonAdd :auth-codes="['sys:user:save']" @click="handleCreate" />

        <ButtonRemove
          :api="removeApi"
          :auth-codes="['sys:user:remove']"
          :grid-api="gridApi"
          @success="handleSearch"
        />

        <Divider class="h-5" type="vertical" />
      </Space>
    </template>
    <template #avatar="{ row }">
      <VbenAvatar :alt="row.nickname" :size="32" :src="row.avatarUrl" />
    </template>
    <template #action="{ row }">
      <AccessControl :codes="['sys:user:save']">
        <Popconfirm
          cancel-text="否"
          ok-text="是"
          title="确定要重置为默认密码吗？"
          @confirm="handleResetPassword(row.id)"
        >
          <Button size="small" type="link">
            <template #icon> <LucideRotateCcw /> </template>
            重置密码
          </Button>
        </Popconfirm>
      </AccessControl>

      <ButtonEdit
        :auth-codes="['sys:user:save']"
        size="small"
        type="link"
        @click="handleEdit(row.id)"
      />

      <ButtonRemove
        :api="removeApi"
        :auth-codes="['sys:user:remove']"
        :ids="[row.id]"
        size="small"
        type="link"
        @success="handleSearch"
      />
    </template>
  </Grid>
  <!--  编辑  -->
  <BaseInputDrawer @success="handleSearch" />
</template>
<style lang="scss" scoped></style>
