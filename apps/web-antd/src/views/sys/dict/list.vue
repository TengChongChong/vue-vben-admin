<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { SysDict } from '#/api/sys/model/sysDictModel';

import { ref, unref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';

import { Button, message, Space } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  addApi,
  getApi,
  refreshApi,
  removeApi,
  selectApi,
} from '#/api/sys/sysDict';
import { ButtonAdd, ButtonEdit, ButtonRemove } from '#/components/button';
import { LucideRefreshCw } from '#/components/icons';

import { initColumns } from './data';
import InputModal from './input.vue';
import SysDictTypeList from './type/list.vue';

function handleSearch() {
  gridApi.search();
}

const dictType = ref('');

const formOptions: VbenFormProps = {
  showCollapseButton: false,
  schema: [
    {
      fieldName: 'code',
      label: '字典编码',
      component: 'Input',
    },
    {
      fieldName: 'name',
      label: '字典名称',
      component: 'Input',
    },
  ],
};

const gridOptions: VxeGridProps<SysDict> = {
  id: 'sys-dict',
  columns: initColumns(),
  height: false,
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        return await selectApi(
          { ...formValues, dictType: unref(dictType) },
          page,
        );
      },
    },
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions,
  gridOptions,
});

const [BaseInputModal, baseInputModalApi] = useVbenModal({
  connectedComponent: InputModal,
});

/**
 * 新增
 *
 * @param id 上级id
 * @param type 字典类型
 */
async function handleCreate(id: string | undefined, type: string | undefined) {
  if (!type) {
    type = dictType.value;
  }

  addApi(id, type).then((res) => {
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

function handleReloadCache() {
  refreshApi().then(() => {
    message.success('刷新成功');
  });
}

function handleDictTypeChange(value: string) {
  dictType.value = value;
  handleSearch();
}
</script>

<template>
  <Page auto-content-height>
    <div class="flex flex-wrap">
      <div class="w-[600px]">
        <SysDictTypeList @change="handleDictTypeChange" />
      </div>
      <div class="flex-1" style="min-width: 500px">
        <Grid>
          <template #toolbar-actions>
            <span class="table-title">字典管理</span>
          </template>
          <template #toolbar-tools>
            <Space>
              <ButtonAdd
                :auth-codes="['sys:dict:save']"
                @click="handleCreate"
              />

              <ButtonRemove
                :api="removeApi"
                :auth-codes="['sys:dict:remove']"
                :grid-api="gridApi"
                @success="handleSearch"
              />

              <Button @click="handleReloadCache">
                <template #icon> <LucideRefreshCw /> </template>
                刷新缓存
              </Button>
            </Space>
          </template>
          <template #action="{ row }">
            <ButtonEdit
              :auth-codes="['sys:dict:save']"
              size="small"
              type="link"
              @click="handleEdit(row.id)"
            />

            <ButtonRemove
              :api="removeApi"
              :auth-codes="['sys:dict:remove']"
              :ids="[row.id]"
              size="small"
              type="link"
              @success="handleSearch"
            />
          </template>
        </Grid>
      </div>
    </div>

    <!--  编辑  -->
    <BaseInputModal @success="handleSearch" />
  </Page>
</template>
