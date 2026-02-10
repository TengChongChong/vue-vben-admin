<script setup lang="ts">
import type { FormType } from './types/generator.data';

import type {
  BasicsConfigModel,
  FieldConfig,
  GeneratorConfig,
  ImportCellConfig,
  SelectModel,
  TableCellConfig,
  TableInfo,
} from '#/api';

import { onMounted, ref, unref } from 'vue';

import { Page } from '@vben/common-ui';

import { Card, Step, Steps } from 'ant-design-vue';

import { selectAllSysDictTypeApi } from '#/api';

import BasicsConfig from './components/basics-config.vue';
import Finish from './components/finish.vue';
import ImportAndExportConfig from './components/import-and-export-config.vue';
import InputConfig from './components/input-config.vue';
import ListConfig from './components/list-config.vue';
import { FORM_TYPE } from './types/generator.data';
// 字典类型
import {
  getDefaultExport,
  getDefaultForm,
  getDefaultImport,
  getDefaultTable,
  needGeneratorImportOrExport,
  needGeneratorInput,
  needGeneratorList,
  toDictTypeArray,
} from './util/util';

const dictTypeSelectModelArray = ref<SelectModel[]>([]);
// 生成配置
const generatorConfig = ref<GeneratorConfig>({
  // 表信息
  tableInfo: null,
  // 基础
  basicsConfig: null,
});

// 当前步骤
const current = ref<number>(0);

onMounted(() => {
  selectAllSysDictTypeApi().then((res) => {
    dictTypeSelectModelArray.value = res;
  });
});

/**
 * 更新配置
 *
 * @param property 属性
 * @param config 配置
 */
function updateConfig(
  property: string,
  config:
    | BasicsConfigModel
    | FieldConfig[]
    | ImportCellConfig[]
    | TableCellConfig[]
    | TableInfo,
) {
  const isChangeTable =
    property === 'tableInfo' &&
    unref(generatorConfig).tableInfo?.name !== (config as TableInfo).name;
  generatorConfig.value[property] = config;
  if (isChangeTable) {
    setDefault();
  }
}

/**
 * 根据表信息设置默认值
 */
function setDefault() {
  const dictTypeArray = toDictTypeArray(unref(dictTypeSelectModelArray));
  const tableInfo = unref(generatorConfig).tableInfo as TableInfo;
  // 更改了表，重新设置默认值
  generatorConfig.value.queryConfig = getDefaultForm(
    tableInfo,
    dictTypeArray,
    FORM_TYPE.QUERY as FormType,
  );
  generatorConfig.value.inputConfig = getDefaultForm(
    tableInfo,
    dictTypeArray,
    FORM_TYPE.INPUT as FormType,
  );
  generatorConfig.value.tableConfig = getDefaultTable(tableInfo, dictTypeArray);
  generatorConfig.value.exportConfig = getDefaultExport(
    tableInfo,
    dictTypeArray,
  );
  generatorConfig.value.importConfig = getDefaultImport(
    tableInfo,
    dictTypeArray,
  );
}
/**
 * 上一步
 */
function handleStepPrev() {
  current.value--;
  const basicsConfig = unref(generatorConfig).basicsConfig as BasicsConfigModel;
  if (current.value >= 3) {
    if (needGeneratorImportOrExport(basicsConfig)) {
      return;
    } else {
      current.value--;
    }
  }
  if (current.value >= 2) {
    if (needGeneratorInput(basicsConfig)) {
      return;
    } else {
      current.value--;
    }
  }
  if (current.value >= 1 && !needGeneratorList(basicsConfig)) {
    current.value--;
  }
}

/**
 * 下一步
 */
function handleStepNext() {
  const basicsConfig = unref(generatorConfig).basicsConfig as BasicsConfigModel;
  current.value++;
  if (current.value < 2) {
    if (needGeneratorList(basicsConfig)) {
      return;
    } else {
      current.value++;
    }
  }
  if (current.value < 3) {
    if (needGeneratorInput(basicsConfig)) {
      return;
    } else {
      current.value++;
    }
  }
  if (current.value < 4 && !needGeneratorImportOrExport(basicsConfig)) {
    current.value++;
  }
}
</script>

<template>
  <Page content-class="generator">
    <Card :bordered="false">
      <Steps :current="current">
        <Step description="基本信息设置" title="基本信息" />
        <Step description="查询条件与表格排序" title="列表页面" />
        <Step description="录入页面组件排序" title="详情页面" />
        <Step description="导入及导出字段排序" title="导入&导出" />
        <Step description="生成文件" title="完成" />
      </Steps>
      <div class="step-content mt-8">
        <BasicsConfig
          v-show="current === 0"
          @next="handleStepNext"
          @update-config="updateConfig"
        />

        <ListConfig
          v-show="current === 1"
          :generator-config="generatorConfig"
          @next="handleStepNext"
          @prev="handleStepPrev"
          @update-config="updateConfig"
        />

        <InputConfig
          v-show="current === 2"
          :generator-config="generatorConfig"
          @next="handleStepNext"
          @prev="handleStepPrev"
          @update-config="updateConfig"
        />

        <ImportAndExportConfig
          v-show="current === 3"
          :generator-config="generatorConfig"
          @next="handleStepNext"
          @prev="handleStepPrev"
          @update-config="updateConfig"
        />

        <Finish
          v-show="current === 4"
          :generator-config="generatorConfig"
          @prev="handleStepPrev"
          @update-config="updateConfig"
        />
      </div>
    </Card>
  </Page>
</template>

<style lang="scss">
@use './style/generator' as *;
</style>
