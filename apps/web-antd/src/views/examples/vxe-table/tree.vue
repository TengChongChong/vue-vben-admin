<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { SysMenu } from '#/api/auth/model/sys-menu-model';

import { h, ref, unref } from 'vue';

import { Page } from '@vben/common-ui';

import { MenuBadge } from '@vben-core/menu-ui';

import { Button, Divider, message, Space, Switch } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { selectApi, setStatusApi } from '#/api/auth/sys-menu';
import { IconifyIcon, LucideMinus, LucidePlus } from '#/components/icons';

const expandIds = ref<string[]>([]);

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
  id: 'sample-sys-menu',
  columns: [
    { type: 'checkbox', width: 50, fixed: 'left' },
    { title: '序号', type: 'seq', width: 100, fixed: 'left' },
    {
      title: '标题',
      field: 'title',
      fixed: 'left',
      align: 'left',
      headerAlign: 'center',
      minWidth: 240,
      treeNode: true,
      slots: { default: 'title' },
    },
    {
      title: '类型',
      field: 'type',
      width: 100,
      cellRender: {
        name: 'DictTag',
        props: { dictType: 'menuType' },
      },
    },
    {
      title: '路由地址',
      field: 'path',
      width: 200,
    },
    {
      title: '页面组件',
      field: 'component',
      width: 200,
    },
    {
      title: '权限标识',
      field: 'authCode',
      width: 200,
    },
    {
      title: '状态',
      field: 'status',
      width: 100,
      slots: {
        default: ({ row }) => {
          if (!Reflect.has(row, 'pendingStatus')) {
            row.pendingStatus = false;
          }
          return h(Switch, {
            checked: row.status === '1',
            checkedChildren: '已启用',
            unCheckedChildren: '已禁用',
            loading: row.pendingStatus,
            onChange(checked: boolean) {
              row.pendingStatus = true;
              const newStatus = checked ? '1' : '2';
              setStatusApi(row.id, newStatus, row.type)
                .then(() => {
                  row.status = newStatus;
                  message.success(`操作成功`);
                  if (
                    row.type === 'menu' && // 同时更新子级数据
                    row.children
                  ) {
                    row.children.forEach((item) => {
                      item.status = newStatus;
                    });
                  }
                })
                .finally(() => {
                  row.pendingStatus = false;
                });
            },
          });
        },
      },
    },
    {
      title: '编辑人',
      field: 'editUser',
      width: 120,
    },
    {
      title: '编辑时间',
      field: 'editDate',
      width: 160,
      formatter: 'dateTime',
    },
  ],
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
  tableTitle: '树表格',
  formOptions,
  gridOptions,
  gridEvents: {
    toggleTreeExpand: () => {
      expandIds.value = gridApi.grid.getTreeExpandRecords();
    },
  },
});

function handleExpandAll() {
  gridApi.grid?.setAllTreeExpand(true);
  expandIds.value = gridApi.grid.getTreeExpandRecords();
}
function handleCollapseAll() {
  gridApi.grid?.clearTreeExpand();
  expandIds.value = gridApi.grid.getTreeExpandRecords();
}
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #toolbar-tools>
        <Space>
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
    </Grid>
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
