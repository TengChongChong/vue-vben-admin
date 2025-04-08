<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { SysMenu } from '#/api/auth/model/sys-menu-model';

import { ref, unref } from 'vue';

import { Page, useVbenDrawer } from '@vben/common-ui';

import { MenuBadge } from '@vben-core/menu-ui';

import { Button, Space } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { addApi, getApi, removeApi, selectApi } from '#/api/auth/sys-menu';
import { ButtonAdd, ButtonEdit, ButtonRemove } from '#/components/button';
import {
  IconifyIcon,
  LucideListOrdered,
  LucideMinus,
  LucidePlus,
} from '#/components/icons';

import { initColumns } from './data';
import InputDrawer from './input.vue';
import OrderDrawer from './order.vue';

const expandIds = ref<string[]>([]);
function handleSearch() {
  gridApi.search();
}

const formOptions: VbenFormProps = {
  collapsed: true,
  schema: [
    {
      fieldName: 'title',
      label: '标题',
      component: 'Input',
    },
    {
      fieldName: 'authCode',
      label: '权限标识',
      component: 'Input',
    },
    {
      fieldName: 'path',
      label: '路由地址',
      component: 'Input',
    },
    {
      fieldName: 'linkSrc',
      label: '链接地址',
      component: 'Input',
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'DictSelect',
      componentProps: {
        dictType: 'commonStatus',
      },
    },
  ],
};

const gridOptions: VxeGridProps<SysMenu> = {
  id: 'sys-menu',
  columns: initColumns(),
  pagerConfig: {
    enabled: false,
  },
  checkboxConfig: {
    range: false,
  },
  treeConfig: {
    transform: true,
    // 用于 tree-config.transform，树节点的字段名
    rowField: 'id',
    // 用于 tree-config.transform，树父节点的字段名
    parentField: 'parentId',
  },
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        // 保持展开状态
        await gridApi.grid.setTreeExpand(unref(expandIds), true);
        return await selectApi({ ...formValues }, page);
      },
    },
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  tableTitle: '菜单管理',
  formOptions,
  gridOptions,
  gridEvents: {
    toggleTreeExpand: () => {
      expandIds.value = gridApi.grid.getTreeExpandRecords();
    },
  },
});
const [BaseInputDrawer, baseInputDrawerApi] = useVbenDrawer({
  connectedComponent: InputDrawer,
});
const [BaseOrderDrawer, baseOrderDrawerApi] = useVbenDrawer({
  connectedComponent: OrderDrawer,
});
async function handleCreate(id: string) {
  addApi(id).then((res) => {
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

function handleOrder() {
  baseOrderDrawerApi.open();
}

function handleExpandAll() {
  gridApi.grid?.setAllTreeExpand(true);
}
function handleCollapseAll() {
  gridApi.grid?.clearTreeExpand();
}
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #toolbar-tools>
        <Space>
          <ButtonAdd :auth-codes="['sys:menu:save']" @click="handleCreate" />
          <Button @click="handleOrder">
            <template #icon>
              <LucideListOrdered />
            </template>
            排序
          </Button>
          <Button @click="handleExpandAll">
            <template #icon>
              <LucidePlus />
            </template>
            展开全部
          </Button>
          <Button @click="handleCollapseAll">
            <template #icon>
              <LucideMinus />
            </template>
            折叠全部
          </Button>
          <ButtonRemove
            :api="removeApi"
            :auth-codes="['sys:menu:remove']"
            :grid-api="gridApi"
            @success="handleSearch"
          />
        </Space>
      </template>
      <template #title="{ row }">
        <!-- 隐藏菜单使用opacity: 50% -->
        <div
          class="flex w-full items-center gap-1"
          :class="[row.hideInMenu === '1' ? 'opacity-50' : '']"
        >
          <div class="size-4 flex-shrink-0">
            <IconifyIcon
              v-if="row.type === 'button'"
              icon="lucide:shield-check"
              class="size-full"
            />
            <IconifyIcon
              v-else-if="row.icon"
              :icon="row.icon"
              class="size-full"
            />
          </div>
          <span class="flex-auto">
            {{ row.title }}
          </span>
          <div class="items-center justify-end"></div>
        </div>
        <MenuBadge
          v-if="row.badgeType"
          class="menu-badge"
          :badge="row.badge"
          :badge-type="row.badgeType"
          :badge-variants="row.badgeVariants"
        />
      </template>
      <template #action="{ row }">
        <ButtonAdd
          :auth-codes="['sys:menu:save']"
          size="small"
          text="新增下级"
          type="link"
          @click="handleCreate(row.id)"
        />
        <ButtonEdit
          :auth-codes="['sys:menu:save']"
          size="small"
          type="link"
          @click="handleEdit(row.id)"
        />
        <ButtonRemove
          :api="removeApi"
          :auth-codes="['sys:menu:remove']"
          :ids="[row.id]"
          size="small"
          type="link"
          @success="handleSearch"
        />
      </template>
    </Grid>

    <!--  编辑  -->
    <BaseInputDrawer @success="handleSearch" />
    <!--  排序  -->
    <BaseOrderDrawer @success="handleSearch" />
  </Page>
</template>
<style lang="scss" scoped>
.menu-badge {
  top: 50%;
  right: 0;
  transform: translateY(-50%);

  & > :deep(div) {
    padding-top: 0;
    padding-bottom: 0;
  }
}
</style>
