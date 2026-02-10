<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { SysDict } from '#/api';

import { ref, unref } from 'vue';

import { AccessControl } from '@vben/access';
import { ColPage, useVbenModal } from '@vben/common-ui';

import { Button, Divider, message, Space } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  addSysDictApi,
  exportSysDictDataApi,
  generateDictEnumApi,
  getSysDictApi,
  refreshSysDictCacheApi,
  removeSysDictApi,
  selectSysDictApi,
} from '#/api';
import {
  ButtonAdd,
  ButtonEdit,
  ButtonExport,
  ButtonRemove,
} from '#/components/button';
import {
  LucideRefreshCw,
  LucideSquareDashedBottomCode,
} from '#/components/icons';
import { downloadFileById } from '#/util/download';

import { initColumns } from './data';
import EnumModal from './enum-modal.vue';
import InputModal from './input.vue';
import SysDictTypeList from './type/list.vue';

// 导出按钮状态
const exportBtnLoading = ref<boolean>(false);

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
  // height: false,
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        return await selectSysDictApi(
          { ...formValues, dictType: unref(dictType) },
          page,
        );
      },
    },
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  tableTitle: '字典管理',
  formOptions,
  gridOptions,
});

const [BaseInputModal, baseInputModalApi] = useVbenModal({
  connectedComponent: InputModal,
});

const [BaseEnumModal, baseEnumModalApi] = useVbenModal({
  connectedComponent: EnumModal,
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

  addSysDictApi(id, type).then((res) => {
    baseInputModalApi.setData(res);
    baseInputModalApi.open();
  });
}

function handleEdit(id: string) {
  getSysDictApi(id).then((res) => {
    baseInputModalApi.setData(res);
    baseInputModalApi.open();
  });
}

function handleReloadCache() {
  refreshSysDictCacheApi().then(() => {
    message.success('刷新成功');
  });
}

function handleDictTypeChange(value: string) {
  dictType.value = value;
  handleSearch();
}

function handleGeneratorEnum() {
  generateDictEnumApi(dictType.value).then((code) => {
    baseEnumModalApi.setData({ ...code });
    baseEnumModalApi.open();
  });
}

const handelExportData = async () => {
  exportBtnLoading.value = true;
  try {
    await exportSysDictDataApi({
      ...(await gridApi.formApi.getValues()),
      dictType: unref(dictType),
    }).then((id) => {
      downloadFileById(id);
    });
  } catch (error) {
    console.error('导出数据错误', error);
  } finally {
    exportBtnLoading.value = false;
  }
};
</script>

<template>
  <ColPage
    :resizable="true"
    :split-line="true"
    :split-handle="true"
    :left-collapsible="false"
    :left-min-width="30"
    :left-width="40"
    auto-content-height
  >
    <template #left>
      <div class="h-full">
        <SysDictTypeList @change="handleDictTypeChange" />
      </div>
    </template>
    <div class="ml-2 h-full">
      <Grid>
        <template #toolbar-tools>
          <Space>
            <ButtonAdd :auth-codes="['sys:dict:save']" @click="handleCreate" />

            <AccessControl :codes="['sys:admin']" type="role">
              <Button
                type="primary"
                @click="handleGeneratorEnum"
                v-if="dictType"
              >
                <template #icon> <LucideSquareDashedBottomCode /> </template>
                生成 Enum
              </Button>
            </AccessControl>

            <ButtonRemove
              :api="removeSysDictApi"
              :auth-codes="['sys:dict:remove']"
              :grid-api="gridApi"
              @success="handleSearch"
            />

            <ButtonExport
              :loading="exportBtnLoading"
              @click="handelExportData"
            />

            <Button @click="handleReloadCache">
              <template #icon> <LucideRefreshCw /> </template>
              刷新缓存
            </Button>

            <Divider class="h-5" type="vertical" />
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
            :api="removeSysDictApi"
            :auth-codes="['sys:dict:remove']"
            :ids="[row.id]"
            size="small"
            type="link"
            @success="handleSearch"
          />
        </template>
      </Grid>
    </div>
    <!--  编辑  -->
    <BaseInputModal @success="handleSearch" />

    <BaseEnumModal />
  </ColPage>
</template>
