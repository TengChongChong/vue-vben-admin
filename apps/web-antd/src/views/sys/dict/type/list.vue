<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { SysDictType } from '#/api';

import { ref, unref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { InputSearch, Space } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  addSysDictTypeApi,
  exportSysDictTypeDataApi,
  getSysDictTypeApi,
  removeSysDictTypeApi,
  selectSysDictTypeApi,
} from '#/api';
import {
  ButtonAdd,
  ButtonEdit,
  ButtonExport,
  ButtonRemove,
} from '#/components/button';
import { downloadFileById } from '#/util/download';

import { initColumns } from './data';
import InputModal from './input.vue';

const emit = defineEmits(['change']);
const searchValue = ref('');

// 导出按钮状态
const exportBtnLoading = ref<boolean>(false);

function handleSearch() {
  gridApi.reload();
}

const gridOptions: VxeGridProps<SysDictType> = {
  id: 'sys-dict-type',
  columns: initColumns(),
  toolbarConfig: {
    refresh: false,
    custom: false,
    zoom: false,
  },
  radioConfig: {
    highlight: true,
  },
  pagerConfig: {
    // 每页大小
    pageSize: 200,
  },
  proxyConfig: {
    ajax: {
      query: async ({ page }) => {
        return await selectSysDictTypeApi({ name: unref(searchValue) }, page);
      },
    },
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  tableTitle: '字典类型',
  gridOptions,
  gridEvents: {
    radioChange: ({ newValue }) => {
      emit('change', newValue.type);
    },
  },
});

const [BaseInputModal, baseInputModalApi] = useVbenModal({
  connectedComponent: InputModal,
});

async function handleCreate() {
  addSysDictTypeApi().then((res) => {
    baseInputModalApi.setData(res);
    baseInputModalApi.open();
  });
}

function handleEdit(id: string) {
  getSysDictTypeApi(id).then((res) => {
    baseInputModalApi.setData(res);
    baseInputModalApi.open();
  });
}

const handelExportData = async () => {
  exportBtnLoading.value = true;
  try {
    await exportSysDictTypeDataApi({ name: unref(searchValue) }).then((id) => {
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
  <div class="dict-type-page mr-2 h-full rounded-md bg-card">
    <div class="dict-type-search w-full">
      <InputSearch
        v-model:value="searchValue"
        placeholder="请输入字典类型或名称搜索"
        @search="handleSearch"
      />
    </div>
    <div class="h-full" style="height: calc(100% - 48px)">
      <Grid>
        <template #toolbar-tools>
          <Space>
            <ButtonAdd :auth-codes="['sys:dict:save']" @click="handleCreate" />

            <ButtonExport
              :loading="exportBtnLoading"
              @click="handelExportData"
            />
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
            :api="removeSysDictTypeApi"
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
</template>
<style lang="scss" scoped>
.dict-type-page {
  .dict-type-search {
    padding: 16px 16px 0;
  }

  :deep(.vxe-grid) {
    .vxe-tools--operate {
      display: none;
    }
  }
}
</style>
