<script setup lang="ts">
import type { VxeGridProps } from '#/adapter/vxe-table';
import type {
  FileInfo,
  SysConfig,
  SysImportExcelTemplateDetail,
  SysImportExcelTemplateVO,
  SysImportSummary,
} from '#/api';

import { onMounted, ref, watch } from 'vue';

import {
  Button,
  Divider,
  Popconfirm,
  Space,
  Tooltip,
  TypographyText,
} from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  cleanMyImportApi,
  exportVerificationFailDataApi,
  insertDataApi,
  removeSysImportExcelTemporaryApi,
  selectSummaryApi,
  selectSysImportExcelTemporaryApi,
} from '#/api';
import { ButtonRemove } from '#/components/button';
import {
  LucideArrowLeft,
  LucideCheck,
  LucideFileX,
  LucideHardDriveDownload,
} from '#/components/icons';
import { downloadFileById } from '#/util/download';

const props = defineProps<{
  importFile: FileInfo;
  sysImportExcelTemplate: SysImportExcelTemplateVO;
}>();

const emit = defineEmits(['prev', 'next', 'continue', 'update']);

const downloadBtnLoading = ref<boolean>(false);
const prevBtnLoading = ref<boolean>(false);
const nextBtnLoading = ref<boolean>(false);
// 验证结果汇总
const importSummary = ref<SysImportSummary>();

onMounted(() => {
  initTable();
  loadSummary();
});

watch(
  () => props.sysImportExcelTemplate,
  () => {
    initTable();
  },
);

// 默认列
const DEFAULT_COLUMN = [
  {
    title: '验证结果',
    field: 'verificationResults',
    sortable: true,
    minWidth: 160,
    fixed: 'right',
    slots: { default: 'verificationResults' },
  },
  {
    title: '操作',
    field: 'action',
    width: 160,
    fixed: 'right',
    slots: { default: 'action' },
  },
];

/**
 * 初始化表格
 */
function initTable() {
  const columns = [
    { type: 'checkbox', width: 50, fixed: 'left' },
    { title: '序号', type: 'seq', width: 50, fixed: 'left' },
  ];
  const formSchemas = [
    {
      fieldName: `verificationStatus`,
      label: '验证结果',
      component: 'DictSelect',
      componentProps: {
        dictType: 'verificationStatus',
      },
    },
  ];
  if (
    props.sysImportExcelTemplate?.detailList &&
    props.sysImportExcelTemplate?.detailList.length
  ) {
    props.sysImportExcelTemplate?.detailList.forEach((item, index) => {
      columns.push({
        title: item.title,
        field: `field${index + 1}`,
        sortable: true,
        minWidth: getColumnWidth(item),
        cellRender: item.replaceTableDictType
          ? { name: 'DictTag', props: { dictType: item.replaceTableDictType } }
          : undefined,
      });

      if (index < 5) {
        formSchemas.push({
          fieldName: `field${index + 1}`,
          label: item.title,
          component: getFormComponent(item),
          componentProps: {
            dictType: item.replaceTableDictType,
          },
        });
      }
    });

    gridOptions.columns = [...columns, ...DEFAULT_COLUMN];

    // 更新查询条件
    gridApi.setFormOptions({
      collapsed: true,
      schema: formSchemas,
    });

    // 更新表格
    gridApi.setGridOptions(gridOptions);
  }
}

function handleSearch() {
  gridApi.search();
}

const gridOptions: VxeGridProps<SysConfig> = {
  id: 'sys-import-preview.vue',
  columns: [],
  pagerConfig: {
    // 每页大小
    pageSize: 10,
  },
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        return await selectSysImportExcelTemporaryApi(
          { ...formValues, templateId: props.sysImportExcelTemplate?.id },
          page,
        );
      },
    },
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  tableTitle: '导入数据',
  formOptions: {},
  gridOptions,
});

/**
 * 获取查询条件组件类型
 *
 * @param templateDetail
 */
function getFormComponent(templateDetail: SysImportExcelTemplateDetail) {
  return templateDetail.replaceTableDictType ? 'DictSelect' : 'Input';
}

/**
 * 获取单元格宽度
 *
 * @param templateDetail
 */
function getColumnWidth(templateDetail: SysImportExcelTemplateDetail) {
  const max = 360;
  const min = 100;
  return templateDetail.fieldLength
    ? Math.max(Math.min(templateDetail.fieldLength * 4, max), min)
    : 160;
}

function removeCallback() {
  handleSearch();
  loadSummary();
}

function loadSummary() {
  selectSummaryApi(props.sysImportExcelTemplate?.id).then(
    (summary: SysImportSummary) => {
      importSummary.value = summary;
    },
  );
}

/**
 * 上一步
 */
async function handleStepPrev() {
  emit('prev');
}

/**
 * 重新选择文件
 */
async function handleRestart() {
  prevBtnLoading.value = true;
  try {
    await cleanMyImportApi(props.sysImportExcelTemplate?.id as string);
  } catch (error) {
    console.error(error);
  } finally {
    emit('continue');
    prevBtnLoading.value = false;
  }
}

/**
 * 下载验证失败数据
 */
async function handleExportVerificationFailData() {
  downloadBtnLoading.value = true;
  try {
    await exportVerificationFailDataApi(
      props.sysImportExcelTemplate?.id as string,
    ).then((id) => {
      downloadFileById(id);
    });
  } catch (error) {
    console.error(error);
  } finally {
    downloadBtnLoading.value = false;
  }
}

/**
 * 导入验证通过数据
 */
async function handleStepNext() {
  nextBtnLoading.value = true;
  try {
    await insertDataApi(props.sysImportExcelTemplate?.id as string).then(
      (res) => {
        emit('update', {
          total: importSummary.value?.total,
          success: res,
          fail: (importSummary.value?.total as number) - res,
        });
        emit('next');
      },
    );
  } catch (error) {
    console.error(error);
  } finally {
    nextBtnLoading.value = false;
  }
}
</script>

<template>
  <div>
    <div class="h-[692px]">
      <Grid>
        <template #table-title v-if="importSummary">
          <template v-if="importSummary.total === importSummary.success">
            <TypographyText strong type="success">
              共{{ importSummary.total }}条数据，全部验证通过
            </TypographyText>
          </template>
          <template v-else>
            <template v-if="importSummary.total === importSummary.fail">
              <TypographyText strong type="danger">
                共{{ importSummary.total }}条数据，全部验证失败
              </TypographyText>
            </template>
            <template v-else>
              <TypographyText strong type="warning">
                共{{ importSummary.total }}条数据，验证通过{{
                  importSummary.success
                }}条，验证失败{{ importSummary.fail }}条
              </TypographyText>
            </template>
          </template>
        </template>
        <template #toolbar-tools>
          <Space>
            <ButtonRemove
              :api="removeSysImportExcelTemporaryApi"
              :grid-api="gridApi"
              @success="removeCallback"
            />

            <Divider class="h-5" type="vertical" />
          </Space>
        </template>
        <template #verificationResults="{ row }">
          <template v-if="row.verificationStatus === '1'">
            <TypographyText type="success">验证通过</TypographyText>
          </template>
          <template v-else>
            <Tooltip color="red">
              <template #title>
                <template
                  v-for="(item, index) in row.verificationResults.split(';')"
                  :key="index"
                >
                  <div>{{ item }}</div>
                </template>
              </template>
              <div class="truncate">
                <TypographyText type="danger">
                  {{ row.verificationResults }}
                </TypographyText>
              </div>
            </Tooltip>
          </template>
        </template>
        <template #action="{ row }">
          <ButtonRemove
            :api="removeSysImportExcelTemporaryApi"
            :ids="[row.id]"
            size="small"
            type="link"
            @success="removeCallback"
          />
        </template>
      </Grid>
    </div>

    <div class="p-1 text-right">
      <Space>
        <Popconfirm
          title="确定要放弃当前导入数据吗？"
          ok-text="是"
          cancel-text="否"
          @confirm="handleRestart"
        >
          <Button type="primary" :loading="prevBtnLoading">
            <template #icon>
              <LucideFileX />
            </template>
            重新选择文件
          </Button>
        </Popconfirm>
        <Button type="primary" @click="handleStepPrev" v-if="importFile">
          <template #icon>
            <LucideArrowLeft />
          </template>
          上一步
        </Button>
        <Button
          v-if="importSummary?.fail"
          @click="handleExportVerificationFailData"
          :loading="downloadBtnLoading"
        >
          <template #icon>
            <LucideHardDriveDownload />
          </template>
          下载验证失败数据
        </Button>
        <Button
          type="primary"
          v-if="importSummary?.success"
          @click="handleStepNext"
          :loading="nextBtnLoading"
        >
          <template #icon>
            <LucideCheck />
          </template>
          导入验证通过数据
        </Button>
      </Space>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.vxe-grid) {
  .bg-background-deep {
    height: 1px;
  }
}
</style>
