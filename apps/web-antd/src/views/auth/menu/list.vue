<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { SysMenu } from '#/api';

import { AccessControl } from '@vben/access';
import { Page, useVbenDrawer, useVbenModal } from '@vben/common-ui';

import { MenuBadge } from '@vben-core/menu-ui';

import {
  Button,
  Divider,
  Dropdown,
  Menu,
  MenuItem,
  Space,
} from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  addSysMenuApi,
  addSysQuickNavigationApi,
  getSysMenuApi,
  removeSysMenuApi,
  selectSysMenuApi,
} from '#/api';
import { ButtonAdd, ButtonEdit, ButtonRemove } from '#/components/button';
import {
  IconifyIcon,
  LucideChevronDown,
  LucideListOrdered,
  LucideMinus,
  LucidePlus,
  TablerDirections,
} from '#/components/icons';
import QuickNavigationModal from '#/views/sys/quick/navigation/input.vue';

import { initColumns } from './data';
import InputDrawer from './input.vue';
import OrderDrawer from './order.vue';

function handleSearch() {
  gridApi.query();
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
    // 是否保留展开状态，对于某些场景可能会用到，比如数据被刷新之后还保留之前展开的状态（需要有 row-config.keyField）
    reserve: true,
    // 自动将列表转为树结构（支持虚拟滚动）
    transform: true,
    // 用于 tree-config.transform，树节点的字段名
    rowField: 'id',
    // 用于 tree-config.transform，树父节点的字段名
    parentField: 'parentId',
  },
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        return await selectSysMenuApi({ ...formValues }, page);
      },
    },
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  tableTitle: '菜单管理',
  formOptions,
  gridOptions,
});
const [BaseInputDrawer, baseInputDrawerApi] = useVbenDrawer({
  connectedComponent: InputDrawer,
});
const [BaseOrderDrawer, baseOrderDrawerApi] = useVbenDrawer({
  connectedComponent: OrderDrawer,
});
const [BaseQuickNavigationModal, baseQuickNavigationModalApi] = useVbenModal({
  connectedComponent: QuickNavigationModal,
});
async function handleCreate(id: string) {
  addSysMenuApi(id).then((res) => {
    baseInputDrawerApi.setData(res);
    baseInputDrawerApi.open();
  });
}
function handleEdit(id: string) {
  getSysMenuApi(id).then((res) => {
    baseInputDrawerApi.setData(res);
    baseInputDrawerApi.open();
  });
}

function handleConvertQuickNavigation(sysMenu: SysMenu) {
  const { title, path, icon } = sysMenu;
  addSysQuickNavigationApi().then((res) => {
    baseQuickNavigationModalApi.setData({
      ...res,
      name: title,
      url: path,
      icon,
    });
    baseQuickNavigationModalApi.open();
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
            :api="removeSysMenuApi"
            :auth-codes="['sys:menu:remove']"
            :grid-api="gridApi"
            @success="handleSearch"
          />

          <Divider class="h-5" type="vertical" />
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
        <ButtonEdit
          :auth-codes="['sys:menu:save']"
          size="small"
          type="link"
          @click="handleEdit(row.id)"
        />
        <ButtonRemove
          :api="removeSysMenuApi"
          :auth-codes="['sys:menu:remove']"
          :ids="[row.id]"
          size="small"
          type="link"
          @success="handleSearch"
        />
        <Dropdown>
          <Button size="small" type="link" @click.prevent>
            更多
            <LucideChevronDown />
          </Button>
          <template #overlay>
            <Menu>
              <AccessControl :codes="['sys:menu:save']">
                <MenuItem @click="handleCreate(row.id)">
                  <template #icon>
                    <LucidePlus />
                  </template>
                  新增下级
                </MenuItem>
              </AccessControl>

              <MenuItem @click="handleConvertQuickNavigation(row)">
                <template #icon>
                  <TablerDirections />
                </template>
                生成快捷菜单
              </MenuItem>
            </Menu>
          </template>
        </Dropdown>
      </template>
    </Grid>

    <!--  编辑  -->
    <BaseInputDrawer @success="handleSearch" />

    <!--  排序  -->
    <BaseOrderDrawer @success="handleSearch" />

    <!--  快捷菜单  -->
    <BaseQuickNavigationModal @success="handleSearch" />
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
