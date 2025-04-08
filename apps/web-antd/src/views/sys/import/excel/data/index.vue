<script setup lang="ts">
import type { FileInfo } from '#/api/file/model/file-info-model';
import type { SysImportExcelTemplateVO } from '#/api/sys/model/sys-import-excel-template-model';
import type { SysImportSummary } from '#/api/sys/sys-import-excel-data';

import { onMounted, ref, unref } from 'vue';
import { useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';

import { Card, Result, Step, Steps } from 'ant-design-vue';

import {
  checkLastDataApi,
  getImportExcelTemplateApi,
} from '#/api/sys/sys-import-excel-data';

import ImportConfig from './components/import-config.vue';
import ImportPreview from './components/import-preview.vue';
import ImportResult from './components/import-result.vue';
import ImportUpload from './components/import-upload.vue';

const { currentRoute } = useRouter();
// 模版标识
const { importCode } = unref(currentRoute).params;
const isHav = ref<boolean>(true);

// 导入模板
const sysImportExcelTemplate = ref<SysImportExcelTemplateVO>();

// 导入文件
const importFile = ref<FileInfo>();

// 结果汇总
const importSummary = ref<SysImportSummary>();

onMounted(async () => {
  // 模板
  sysImportExcelTemplate.value = await getImportExcelTemplateApi(importCode);
  if (sysImportExcelTemplate.value) {
    // 检查是否有上次未保存的数据
    const isHas = await checkLastDataApi(
      sysImportExcelTemplate.value.id as string,
    );
    if (isHas) {
      current.value = 2;
    }
  } else {
    isHav.value = false;
  }
});

// 当前步骤
const current = ref<number>(0);

/**
 * 上传数据
 *
 * @param fileInfo fileInfo
 */
function handleSetImportFile(fileInfo: FileInfo) {
  importFile.value = fileInfo;
  handleStepNext();
}

/**
 * 更新结果
 */
function updateResult(result) {
  importSummary.value = result;
}

/**
 * 继续导入
 */
function continueImport() {
  current.value = 0;
}

/**
 * 上一步
 */
function handleStepPrev() {
  current.value--;
}

/**
 * 下一步
 */
function handleStepNext() {
  current.value++;
}
</script>

<template>
  <Page auto-content-height>
    <Card
      :title="`导入数据 - ${sysImportExcelTemplate?.name ? sysImportExcelTemplate?.name : '错误'}`"
      :bordered="false"
    >
      <Steps :current="current" v-if="isHav">
        <Step title="上传数据" description="上传Excel文件" />
        <Step title="导入规则" description="匹配模版字段" />
        <Step title="查看数据" description="预览解析数据" />
        <Step title="导入数据" description="保存" />
      </Steps>

      <div class="step-container" v-if="isHav">
        <!-- 上传数据 -->
        <ImportUpload
          v-if="current === 0"
          :sys-import-excel-template="sysImportExcelTemplate"
          @next="handleSetImportFile"
        />
        <!-- 导入规则 -->
        <ImportConfig
          v-if="current === 1"
          :sys-import-excel-template="sysImportExcelTemplate"
          :import-file="importFile"
          @prev="handleStepPrev"
          @next="handleStepNext"
        />
        <!-- 查看数据 -->
        <ImportPreview
          v-if="current === 2"
          :sys-import-excel-template="sysImportExcelTemplate"
          :import-file="importFile"
          @update="updateResult"
          @next="handleStepNext"
          @prev="handleStepPrev"
          @continue="continueImport"
        />
        <!-- 导入数据 -->
        <ImportResult
          v-if="current === 3"
          :sys-import-excel-template="sysImportExcelTemplate"
          :import-summary="importSummary"
          @continue="continueImport"
        />
      </div>
      <Result
        v-else
        title="未找到导入模版"
        :sub-title="`我们未找到当前请求的模版信息（${importCode}），请刷新页面重试或联系管理员`"
        status="error"
      />
    </Card>
  </Page>
</template>

<style scoped></style>
