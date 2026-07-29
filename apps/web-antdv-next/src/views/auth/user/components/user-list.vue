<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { SysConfig } from '#/api';

import { watch } from 'vue';

import { AccessControl } from '@vben/access';
import { useVbenDrawer, VbenAvatar } from '@vben/common-ui';

import { Button, Divider, Modal, Popconfirm, Space } from 'antdv-next';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  addSysUserApi,
  getSysUserApi,
  removeSysUserApi,
  resetUserPasswordApi,
  selectSysUserApi,
} from '#/api';
import { ButtonAdd, ButtonEdit, ButtonRemove } from '#/components/button';
import { LucideRotateCcw } from '#/components/icons';
import { buildTenantGridId } from '#/utils/tenant-grid-id';
import CmsUserAuthDrawer from '#/views/cms/auth/user-auth-drawer.vue';
import UserTenantsDrawer from '#/views/sys/tenant/user-tenants-drawer.vue';

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
  gridApi.query();
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
  id: buildTenantGridId('sys-user'),
  columns: initColumns(),
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        return await selectSysUserApi(
          { ...formValues, deptId: props.deptId },
          page,
        );
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

const [UserTenantsDrawerComp, userTenantsDrawerApi] = useVbenDrawer({
  connectedComponent: UserTenantsDrawer,
});

const [CmsUserAuthDrawerComp, cmsUserAuthDrawerApi] = useVbenDrawer({
  connectedComponent: CmsUserAuthDrawer,
});

function handleOpenTenants(userId: string) {
  userTenantsDrawerApi.setData({ userId });
  userTenantsDrawerApi.open();
}

function handleOpenCmsAuth(userId: string) {
  cmsUserAuthDrawerApi.setData({ userId });
  cmsUserAuthDrawerApi.open();
}

async function handleCreate() {
  addSysUserApi(props.deptId).then((res) => {
    baseInputDrawerApi.setData(res);
    baseInputDrawerApi.open();
  });
}

function handleEdit(id: string) {
  getSysUserApi(id).then((res) => {
    baseInputDrawerApi.setData(res);
    baseInputDrawerApi.open();
  });
}

const handleResetPassword = (id: string) => {
  resetUserPasswordApi(id).then((password) => {
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
          :api="removeSysUserApi"
          :auth-codes="['sys:user:remove']"
          :grid-api="gridApi"
          @success="handleSearch" />

        <Divider class="h-5" type="vertical" />
      </Space>
    </template>
    <template #avatar="{ row }">
      <VbenAvatar :alt="row.nickname" :size="32" :src="row.avatarUrl" />
    </template>
    <template #action="{ row }">
      <AccessControl :codes="['cms:site:user:save', 'cms:column:user:save']" type="code">
        <Button size="small" type="link" @click="handleOpenCmsAuth(row.id)">
          CMS 权限
        </Button>
      </AccessControl>

      <AccessControl :codes="['sys:tenant:user:save']">
        <Button size="small" type="link" @click="handleOpenTenants(row.id)">
          租户
        </Button>
      </AccessControl>

      <AccessControl :codes="['sys:user:save']">
        <Popconfirm
          cancel-text="否"
          ok-text="是"
          title="确定要重置为默认密码吗？"
          @confirm="handleResetPassword(row.id)">
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
        @click="handleEdit(row.id)" />

      <ButtonRemove
        :api="removeSysUserApi"
        :auth-codes="['sys:user:remove']"
        :ids="[row.id]"
        size="small"
        type="link"
        @success="handleSearch" />
    </template>
  </Grid>
  <!--  编辑  -->
  <BaseInputDrawer @success="handleSearch" />
  <UserTenantsDrawerComp @success="handleSearch" />
  <CmsUserAuthDrawerComp @success="handleSearch" />
</template>
<style lang="scss" scoped></style>
