<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { SysQuickNavigation } from '#/api/sys/model/sys-quick-navigation-model';

import { Page, useVbenModal } from '@vben/common-ui';

import { Button, Space } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  addApi,
  getApi,
  removeApi,
  saveOrderNoApi,
  selectApi,
} from '#/api/sys/sys-quick-navigation';
import { ButtonAdd, ButtonEdit, ButtonRemove } from '#/components/button';
import { LucideSave } from '#/components/icons';
import Navigation from '#/views/sys/quick/navigation/navigation.vue';

import { initColumns } from './data';
import InputModal from './input.vue';

function handleSearch() {
  gridApi.search();
}

const formOptions: VbenFormProps = {
  collapsed: true,
  schema: [
    {
      fieldName: 'name',
      label: '名称',
      component: 'Input',
    },
    {
      fieldName: 'color',
      label: '颜色',
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

const gridOptions: VxeGridProps<SysQuickNavigation> = {
  id: 'sys-quick-navigation',
  columns: initColumns(),
  cellConfig: {
    height: 76,
  },
  rowConfig: {
    drag: true,
  },
  pagerConfig: {
    enabled: false,
  },
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        return await selectApi({ ...formValues }, page);
      },
    },
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  tableTitle: '快捷导航',
  tableTitleHelp:
    '用于管理首页快捷导航，拖动序号前图标调整导航顺序（调整后请点击保存排序）',
  formOptions,
  gridOptions,
});
const [BaseInputModal, baseInputModalApi] = useVbenModal({
  connectedComponent: InputModal,
});
async function handleCreate() {
  addApi().then((res) => {
    baseInputModalApi.setData(res);
    baseInputModalApi.open();
  });
}
function handleEdit(id: string) {
  getApi(id).then((res) => {
    baseInputModalApi.setData(res);
    baseInputModalApi.open();
  });
}

function handleSaveOrderNo() {
  const { fullData } = gridApi.grid.getTableData();

  saveOrderNoApi(fullData).then(() => {
    handleSearch();
  });
}
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #toolbar-tools>
        <Space>
          <ButtonAdd
            :auth-codes="['sys:quick:navigation:save']"
            @click="handleCreate"
          />
          <Button @click="handleSaveOrderNo" type="primary">
            <template #icon>
              <LucideSave />
            </template>
            保存排序
          </Button>
          <ButtonRemove
            :api="removeApi"
            :auth-codes="['sys:quick:navigation:remove']"
            :grid-api="gridApi"
            @success="handleSearch"
          />
        </Space>
      </template>
      <template #quick-navigation="{ row }">
        <div class="mx-auto w-20">
          <Navigation :quick-navigation="row" size="small" :show-name="false" />
        </div>
      </template>
      <template #action="{ row }">
        <ButtonEdit
          :auth-codes="['sys:quick:navigation:save']"
          size="small"
          type="link"
          @click="handleEdit(row.id)"
        />
        <ButtonRemove
          :api="removeApi"
          :auth-codes="['sys:quick:navigation:remove']"
          :ids="[row.id]"
          size="small"
          type="link"
          @success="handleSearch"
        />
      </template>
    </Grid>

    <!--  编辑  -->
    <BaseInputModal @success="handleSearch" />
  </Page>
</template>
