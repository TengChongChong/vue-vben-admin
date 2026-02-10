<script setup lang="ts">
import type { FileInfo, SysImportExcelTemplateVO } from '#/api';

import { ref } from 'vue';

import { Button, message } from 'ant-design-vue';

import { downloadTemplateApi } from '#/api';
import { LucideArrowRight } from '#/components/icons';
import { RuleUpload } from '#/components/upload';
import { downloadFileById } from '#/util/download';

const props = defineProps<{
  sysImportExcelTemplate: SysImportExcelTemplateVO;
}>();

const emit = defineEmits(['next']);

const downloadBtnLoading = ref<boolean>(false);
const nextBtnLoading = ref<boolean>(false);
const file = ref<FileInfo>();

async function handleDownload() {
  downloadBtnLoading.value = true;
  await downloadTemplateApi(
    props.sysImportExcelTemplate?.importCode as string,
  ).then((res) => {
    downloadFileById(res);
  });
  downloadBtnLoading.value = false;
}

async function handleStepNext() {
  if (!file.value) {
    message.warn('请上传文件后重试');
    return;
  }
  nextBtnLoading.value = true;
  emit('next', file.value);
  nextBtnLoading.value = false;
}
</script>

<template>
  <div class="mx-auto w-[680px] pb-8 pt-24">
    <RuleUpload
      rule-key="sys-import-data-excel"
      v-model:value="file"
      use-dragger
    />

    <div class="import-tips mt-2 pl-4">
      <ul class="list-decimal">
        <li>
          建议使用
          <Button
            type="link"
            size="small"
            @click="handleDownload()"
            :loading="downloadBtnLoading"
          >
            默认模版（Excel）
          </Button>
          导入数据，使用其他模版需配置导入规则
        </li>
        <li>下载导入模板，按照模板中要求填写数据后上传</li>
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
