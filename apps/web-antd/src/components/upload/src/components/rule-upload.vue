<script setup lang="ts">
import type { FileInfo } from '#/api/file/model/file-info-model';
import type { FileUploadRule } from '#/api/file/model/file-upload-rule-model';
import type {
  RuleUploadProps,
  UploadFileModel,
} from '#/components/upload/src/type';

import { computed, onMounted, ref, watch } from 'vue';

import { useAccessStore } from '@vben/stores';

import { Button, message, Tag, Upload, UploadDragger } from 'ant-design-vue';
import { isArray, isString } from 'lodash-es';

import { getByKeyApi } from '#/api/file/file-upload-rule';
import { LucideHardDriveUpload, LucideUpload } from '#/components/icons';
import {
  convertToFileInfo,
  convertToUploadFileModelArray,
} from '#/components/upload/src/helper';
import { useUploadType } from '#/components/upload/src/useUpload';

const props = withDefaults(defineProps<RuleUploadProps>(), {
  listType: 'text',
  maxNumber: 1,
  multiple: false,
  showHelpText: false,
  useDragger: false,
});

const emit = defineEmits(['change', 'update:value']);

const accessStore = useAccessStore();

const loaded = ref(false);
let uploadRule: FileUploadRule = null;

// 已上传文件
let uploadedFileList: FileInfo[] = [];
// 未上传文件
let uploadingFileList: UploadFileModel[] = [];
// 用于显示的文件列表 已上传 + 未上传
const displayFileList = ref<UploadFileModel[]>([]);

// 后端文件上传地址
const url = ref();

onMounted(async () => {
  await initUpload();
});

async function initUpload() {
  loaded.value = false;
  uploadRule = null;
  if (props.ruleKey) {
    uploadRule = await getByKeyApi(props.ruleKey);
  }
  url.value = `${import.meta.env.VITE_GLOB_API_URL}/auth/file/upload/${props.ruleKey}`;
  loaded.value = true;
}

watch(
  () => props.ruleKey,
  () => {
    initUpload();
  },
);

watch(
  () => props.value,
  () => {
    setValue();
  },
  { deep: true },
);

setValue();

const suffixArray = computed(() => {
  return uploadRule?.suffixArray;
});

const upperLimit = computed(() => {
  return uploadRule?.upperLimit;
});

const { getStringAccept, getHelpText } = useUploadType({
  acceptRef: suffixArray,
  helpTextRef: props.helpText,
  maxNumberRef: props?.maxNumber,
  maxSizeRef: upperLimit,
});

function setValue() {
  if (
    props.value === null ||
    props.value === undefined ||
    props.value === '' ||
    isString(props.value)
  ) {
    uploadedFileList = [];
    refreshDisplayFileList();
    return;
  }
  uploadedFileList = isArray(props.value)
    ? initValue(props.value)
    : initValue([props.value]);
  refreshDisplayFileList();
}

function initValue(value: FileInfo[]): FileInfo[] {
  if (!isArray(value)) {
    return [];
  }
  value.forEach((item) => {
    item.status = 'done';
  });
  return value;
}

/**
 * 检查是否允许上传
 *
 * @param file 文件
 */
const beforeUpload = (file: File) => {
  const { maxNumber, maxSize } = props;

  // 上传数量是否超出，此时当前选择的文件尚未添加到上传中数组，所以使用 >=
  if (uploadedFileList.length + uploadingFileList?.length >= maxNumber) {
    message.warning(t('component.upload.maxNumber', [maxNumber]));
    return false;
  }

  // 单文件大小是否超出
  if (maxSize && file.size / 1024 / 1024 >= maxSize) {
    message.error(t('component.upload.maxSizeMultiple', [maxSize]));
    return false;
  }
  return true;
};

/**
 * 文件状态变更
 *
 * @param info info
 */
const handleChange = (info: UploadChangeParam) => {
  const { file, fileList } = info;
  if (!info.file.status) {
    // 如果状态为空，说明在beforeUpload返回了false
    return;
  }
  uploadedFileList = [];
  uploadingFileList = [];
  fileList.forEach((item) => {
    if (item.status === 'error') {
      message.error(item.response?.errorMessage);
    }
    if (item.status === 'success' || item.status === 'done') {
      uploadedFileList.push(convertToFileInfo(item));
    } else {
      uploadingFileList.push(item);
    }
  });
  if (
    file.status === 'success' ||
    file.status === 'done' ||
    file.status === 'removed'
  ) {
    handleValueChange();
  }
  refreshDisplayFileList();
};

/**
 * 已上传文件值改变
 */
function handleValueChange() {
  if (props.multiple) {
    emit('change', uploadedFileList);
    emit('update:value', uploadedFileList);
  } else {
    if (uploadedFileList.length > 0) {
      emit('change', uploadedFileList[0]);
      emit('update:value', uploadedFileList[0]);
    } else {
      emit('change', null);
      emit('update:value', null);
    }
  }
}

/**
 * 刷新显示的文件列表
 */
function refreshDisplayFileList() {
  displayFileList.value = [
    ...convertToUploadFileModelArray(uploadedFileList),
    ...uploadingFileList,
  ];
}
</script>

<template>
  <template v-if="loaded">
    <component
      :is="useDragger ? UploadDragger : Upload"
      v-if="uploadRule"
      :accept="getStringAccept"
      :action="url"
      :before-upload="beforeUpload"
      :file-list="displayFileList"
      :headers="{ Authorization: accessStore.accessToken }"
      :list-type="props.listType"
      :multiple="multiple"
      @change="handleChange"
    >
      <template v-if="props.useDragger">
        <p class="ant-upload-drag-icon">
          <LucideUpload class="mx-auto text-5xl" />
        </p>
        <p class="ant-upload-text">单击或拖动文件到此区域进行上传</p>
        <p class="ant-upload-hint">
          {{ getHelpText }}
        </p>
      </template>
      <template v-else>
        <template v-if="props.listType === 'picture-card'">
          <div class="ant-upload-select-picture-card">
            <LucideHardDriveUpload />
            <div class="ant-upload-text">选择文件</div>
          </div>
        </template>

        <template
          v-if="props.listType === 'text' || props.listType === 'picture'"
        >
          <Button>
            <template #icon>
              <LucideHardDriveUpload />
            </template>

            选择文件
          </Button>
        </template>
      </template>
    </component>
    <Tag v-else color="red">获取上传策略失败</Tag>

    <div v-if="props.showHelpText" class="upload-help-text py-1">
      {{ getHelpText }}
    </div>
  </template>
</template>

<style lang="scss" scoped>
.upload-help-text {
  font-size: 14px;
  color: hsl(var(--secondary-foreground));
}

.ant-upload-select-picture-card {
  text-align: center;

  .iconify {
    margin: 0 auto 8px;
  }
}
</style>
