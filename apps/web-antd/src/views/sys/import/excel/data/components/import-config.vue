<script setup lang="ts">
import type {
  FileInfo,
  SysImportExcelTemplateDetailVO,
  SysImportExcelTemplateVO,
} from '#/api';

import { computed, ref, watch } from 'vue';

import {
  Button,
  Descriptions,
  DescriptionsItem,
  InputNumber,
  message,
  Select,
  Table,
} from 'ant-design-vue';

import { analysisApi, analysisExcelApi } from '#/api';
import { LucideArrowRight } from '#/components/icons';
import { isString } from '#/util/is';
import { getCellIndex } from '#/views/sys/import/excel/data/util';

const props = defineProps<{
  importFile: FileInfo;
  sysImportExcelTemplate: SysImportExcelTemplateVO;
}>();

const emit = defineEmits(['next']);
const nextBtnLoading = ref<boolean>(false);

// 系统预设导入模版
const columns = ref<Array<any>>([]);
// 导入字段
const dataSource = ref([]);
// 用户导入Excel前10条数据
const importExcelColumns = ref<Array<Array<string>>>([]);
// 起始行
const startRow = ref(2);

watch(
  () => [props.sysImportExcelTemplate, props.importFile],
  () => initConfig(),
);

initConfig();

/**
 * 初始化配置导入规则
 */
function initConfig() {
  if (!checkImportExcelTemplate()) {
    return;
  }
  // @ts-ignore
  startRow.value = props.sysImportExcelTemplate.startRow!;
  // 系统预设导入规则
  // @ts-ignore
  columns.value = props.sysImportExcelTemplate.detailList.map((item, index) => {
    return {
      title: `${getCellIndex(index)}.${item.title}`,
      dataIndex: item.fieldName,
      require: item.dataRequired,
      width: 160,
    };
  });
  columns.value = [
    {
      title: '模版字段',
      dataIndex: 'importField',
      width: 100,
    },
    ...columns.value,
  ];

  if (props.importFile) {
    uploadExcelColumns();
  }

  const data: any = { importField: '导入字段' };

  props.sysImportExcelTemplate?.detailList?.forEach((item) => {
    data[item.fieldName!] = null;
  });
  dataSource.value = [data];
}

/**
 * 加载导入Excel数据
 */
async function uploadExcelColumns() {
  importExcelColumns.value = await analysisExcelApi(props.importFile!);

  if (startRow.value > importExcelColumns.value.length) {
    message.warn('起始行大于Excel数据行数，请重新选择文件或更改起始行');
    return;
  }

  autoUpdateDataSource();
}

/**
 * 起始行改变
 */
function handleStartRowChange() {
  autoUpdateDataSource();
}

/**
 * 根据用户设置起始行，自动匹配导入字段
 */
function autoUpdateDataSource() {
  if (!checkImportExcelTemplate()) {
    return;
  }

  const data: any = { importField: '导入字段' };
  props.sysImportExcelTemplate?.detailList?.forEach((item) => {
    // 根据系统预设模版字段，到用户上传的Excel中自动匹配
    data[item.fieldName!] = matchSimilarColumn(item.title!);
  });
  dataSource.value = [data];
}

/**
 * 根据系统预设模版字段，到用户上传的Excel中自动匹配
 * 1、字段与Excel中字段完全一致
 * 2、字段与Excel中部分文字一致
 * @param title 系统预设模版字段
 */
function matchSimilarColumn(title: string) {
  if (
    importExcelColumns.value.length === 0 ||
    importExcelColumns.value[startRow.value - 1].length === 0
  ) {
    return;
  }
  let similarColumn: null | number = null;
  // 1、字段与Excel中字段完全一致
  importExcelColumns.value[startRow.value - 1].forEach((item, index) => {
    if (item === title) {
      similarColumn = index;
    }
  });
  // 2、字段与Excel中部分文字一致
  if (similarColumn == null) {
    importExcelColumns.value[startRow.value - 1].forEach((item, index) => {
      const itemLowerCase = isString(item) ? item.toLowerCase() : `${item}`;
      const titleLowerCase = isString(title) ? title.toLowerCase() : `${title}`;
      if (
        itemLowerCase.includes(itemLowerCase) ||
        itemLowerCase.includes(titleLowerCase)
      ) {
        similarColumn = index;
      }
    });
  }
  return similarColumn;
}

const columnOptions = computed(() => {
  if (
    importExcelColumns.value.length === 0 ||
    importExcelColumns.value[startRow.value - 1].length === 0
  ) {
    return;
  }
  return importExcelColumns.value[startRow.value - 1].map((item, index) => {
    return {
      value: index,
      label: `${getCellIndex(index)}.${item}`,
    };
  });
});

async function handleStepNext() {
  nextBtnLoading.value = true;
  try {
    if (!checkImportExcelTemplate()) {
      return;
    }
    const importConfig: SysImportExcelTemplateDetailVO[] = [];
    // 1.必填验证
    for (
      let i = 0;
      i < props.sysImportExcelTemplate?.detailList?.length!;
      i++
    ) {
      // @ts-ignore
      const detail = props.sysImportExcelTemplate?.detailList[i]!;
      if (
        detail?.dataRequired &&
        dataSource.value[0][detail.fieldName] == null
      ) {
        message.error(`请选择“${i + 1}.${detail?.title}”导入字段`);
        return;
      }
      importConfig.push({
        fieldName: detail.fieldName,
        index: dataSource.value[0][detail.fieldName],
      });
    }
    // 解析Excel
    const res = await analysisApi(
      props.sysImportExcelTemplate?.id as string,
      startRow.value,
      props.importFile!,
      importConfig,
    );
    if (res) {
      emit('next');
    }
  } catch (error) {
    console.error(error);
  } finally {
    nextBtnLoading.value = false;
  }
}

function checkImportExcelTemplate() {
  if (
    props.sysImportExcelTemplate?.detailList == null ||
    props.sysImportExcelTemplate?.detailList.length === 0
  ) {
    message.error('导入模版未配置，请联系管理员');
    return false;
  }
  return true;
}
</script>

<template>
  <div class="mx-auto py-12">
    <Descriptions class="mb-4" size="middle" bordered :column="1">
      <DescriptionsItem label="起始行" :label-style="{ width: '120px' }">
        <InputNumber
          id="inputNumber"
          v-model:value="startRow"
          :min="1"
          :max="10"
          @change="handleStartRowChange"
        />
      </DescriptionsItem>
    </Descriptions>

    <Table
      v-if="columns && columns.length > 0"
      size="middle"
      :columns="columns"
      :data-source="dataSource"
      :pagination="false"
      :scroll="{ x: '100%', y: 100 }"
    >
      <template #headerCell="{ column }">
        <div :class="[column.require ? 'require-mark' : '']">
          {{ column.title }}
        </div>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'importField'">
          {{ record[column.dataIndex] }}
        </template>
        <template v-if="column.dataIndex !== 'importField'">
          <Select
            show-search
            option-filter-prop="label"
            :options="columnOptions"
            v-model:value="record[column.dataIndex]"
            style="width: 100%"
          />
        </template>
      </template>
    </Table>

    <div class="import-tips mt-2 pl-4">
      <ul class="list-decimal">
        <li>如使用自定义导入模板，需正确关联模板字段与导入字段</li>
        <li>默认读取第一个工作表（Sheet）</li>
        <li>系统将从“起始行”开始读取Excel数据并作为“导入字段”</li>
        <li><span class="require-mark">表示此项为必填项</span></li>
      </ul>
    </div>
  </div>

  <div class="p-1 text-right">
    <Button type="primary" @click="handleStepNext" :loading="nextBtnLoading">
      <template #icon>
        <LucideArrowRight />
      </template>
      下一步
    </Button>
  </div>
</template>

<style scoped></style>
