<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { SysUserOnline } from '#/api';

import { AccessControl } from '@vben/access';
import { Page, VbenAvatar } from '@vben/common-ui';

import { Button, Popconfirm } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { forceLoginApi, selectSysUserOnlineApi } from '#/api';
import { LucideLogOut } from '#/components/icons';

import { initColumns } from './data';

function handleSearch() {
  gridApi.search();
}

const formOptions: VbenFormProps = {
  collapsed: true,
  schema: [
    {
      fieldName: 'token',
      label: 'Token',
      component: 'Input',
    },
    // {
    //   fieldName: 'username',
    //   label: '用户名',
    //   component: 'Input',
    // },
    // {
    //   fieldName: 'nickname',
    //   label: '昵称',
    //   component: 'Input',
    // },
    // {
    //   fieldName: 'deptName',
    //   label: '部门',
    //   component: 'Input',
    // },
  ],
};

const gridOptions: VxeGridProps<SysUserOnline> = {
  id: 'auth-user-online',
  columns: initColumns(),
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        return await selectSysUserOnlineApi({ ...formValues }, page);
      },
    },
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  tableTitle: '在线用户',
  formOptions,
  gridOptions,
});

function handleForceLogin(token: string) {
  forceLoginApi(token).then(() => {
    handleSearch();
  });
}
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #avatar="{ row }">
        <VbenAvatar
          :alt="row.nickname"
          :size="32"
          :src="row.avatarUrl"
          class="mx-auto"
        />
      </template>
      <template #action="{ row }">
        <AccessControl :codes="['sys:online:force']">
          <Popconfirm
            cancel-text="否"
            ok-text="是"
            title="确定要强制退出吗？"
            @confirm="handleForceLogin(row.token)"
          >
            <Button danger size="small" type="link">
              <template #icon>
                <LucideLogOut />
              </template>
              强制退出
            </Button>
          </Popconfirm>
        </AccessControl>
      </template>
    </Grid>
  </Page>
</template>
