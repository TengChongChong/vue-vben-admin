<script setup lang="ts">
import type { SysImportExcelTemplateVO } from '#/api/sys/model/sys-import-excel-template-model';
import type { SysImportSummary } from '#/api/sys/sys-import-excel-data';

import { ref } from 'vue';

import { Button, Result } from 'ant-design-vue';

import { exportVerificationFailDataApi } from '#/api/sys/sys-import-excel-data';
import { cleanMyImportApi } from '#/api/sys/sys-import-excel-temporary';
import {
  LucideHardDriveDownload,
  LucideHardDriveUpload,
} from '#/components/icons';
import { downloadFileById } from '#/util/download';

const props = defineProps<{
  importSummary: SysImportSummary;
  sysImportExcelTemplate: SysImportExcelTemplateVO;
}>();

const emit = defineEmits(['continue']);

const downloadBtnLoading = ref<boolean>(false);
const continueBtnLoading = ref<boolean>(false);

/**
 * 继续导入
 */
async function handleContinueImport() {
  continueBtnLoading.value = true;
  try {
    await cleanMyImportApi(props.sysImportExcelTemplate?.id as string);
  } catch (error) {
    console.error(error);
  } finally {
    emit('continue');
    continueBtnLoading.value = false;
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
</script>

<template>
  <div class="mx-auto w-[600px] py-12">
    <Result
      :title="`成功导入${importSummary.success}条数据`"
      :sub-title="
        importSummary.fail
          ? `${importSummary.fail}条数据由于验证失败未导入，你可以下载验证失败数据修改后重新导入。`
          : null
      "
      :status="
        importSummary.total === importSummary.success
          ? 'success'
          : importSummary.success > 0
            ? 'warning'
            : 'error'
      "
    >
      <template #extra>
        <Button
          type="primary"
          :loading="continueBtnLoading"
          @click="handleContinueImport"
        >
          <template #icon>
            <LucideHardDriveUpload />
          </template>
          继续导入
        </Button>
        <Button
          v-if="importSummary.fail > 0"
          :loading="downloadBtnLoading"
          @click="handleExportVerificationFailData"
        >
          <template #icon>
            <LucideHardDriveDownload />
          </template>
          下载验证失败数据
        </Button>
      </template>
    </Result>
  </div>
</template>

<style scoped></style>
