<script lang="ts" setup>
import type { Cropper, CropperEndResult } from '../typing';

import type { CropperModalProps } from '#/components/cropper/src/props';

import { computed, ref, unref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Avatar, Button, Space, Tooltip, Upload } from 'ant-design-vue';

import { fileUpload } from '#/api/file/fileUpload';
import {
  MoveHorizontal,
  MoveVertical,
  RotateCcwSquare,
  RotateCw,
  RotateCwSquare,
  Upload as UploadIcon,
  ZoomIn,
  ZoomOut,
} from '#/components/icons';

import CropperImage from './cropper-image.vue';

const emit = defineEmits(['uploadSuccess']);

const cropperModalProps = ref<CropperModalProps>();

const toolbarDisabled = computed(() => false);

let filename = '';
const src = ref('');
const previewSource = ref('');
const imageBlob = ref<Blob>();
const cropper = ref<Cropper>();
let scaleX = 1;
let scaleY = 1;

const [Modal, modalApi] = useVbenModal({
  draggable: true,
  title: '上传图片',
  onCancel() {
    modalApi.close();
  },
  onConfirm() {
    handleOk();
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      const data = modalApi.getData<Record<string, any>>();
      const { alt, circled, aspectRatio, uploadRuleSlug, value } = data;
      cropperModalProps.value = { alt, circled, aspectRatio, uploadRuleSlug };
      if (value) {
        src.value = value.url;
      }
    }
  },
});

// Block upload
function handleBeforeUpload(file: File) {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  src.value = '';
  previewSource.value = '';
  reader.addEventListener('load', (e) => {
    src.value = (e.target?.result as string) ?? '';
    filename = file.name;
  });
  return false;
}

function handleCropperEnd({ blob, imgBase64 }: CropperEndResult) {
  imageBlob.value = blob;
  previewSource.value = imgBase64;
}

function handleReady(cropperInstance: Cropper) {
  cropper.value = cropperInstance;
}

function handlerToolbar(event: string, arg?: number) {
  if (event === 'scaleX') {
    scaleX = arg = scaleX === -1 ? 1 : -1;
  }
  if (event === 'scaleY') {
    scaleY = arg = scaleY === -1 ? 1 : -1;
  }
  // @ts-ignore
  cropper?.value?.[event]?.(arg);
}

async function handleOk() {
  try {
    // setModalProps({ confirmLoading: true });
    // @ts-ignore
    const result = await fileUpload(cropperModalProps.value?.uploadRuleSlug, {
      name: 'file',
      file: unref(imageBlob),
      filename,
    });
    emit('uploadSuccess', result);
    modalApi.close();
  } finally {
    // setModalProps({ confirmLoading: false });
  }
}
</script>
<template>
  <Modal class="w-[800px]">
    <div class="vben-cropper-modal">
      <div class="vben-cropper-modal-left">
        <div class="vben-cropper-modal-cropper">
          <CropperImage
            v-if="src"
            :alt="cropperModalProps?.alt"
            :circled="cropperModalProps?.circled"
            :height="300"
            :options="{ aspectRatio: cropperModalProps?.aspectRatio }"
            :src="src"
            @cropper-end="handleCropperEnd"
            @ready="handleReady"
          />
        </div>
        <div class="vben-cropper-modal-toolbar">
          <Upload
            :before-upload="handleBeforeUpload"
            :file-list="[]"
            accept="image/*"
          >
            <Tooltip placement="bottom" title="选择图片">
              <Button size="small" type="primary">
                <template #icon>
                  <UploadIcon />
                </template>
              </Button>
            </Tooltip>
          </Upload>
          <Space>
            <Tooltip placement="bottom" title="重置">
              <Button
                :disabled="toolbarDisabled"
                size="small"
                type="primary"
                @click="handlerToolbar('reset')"
              >
                <template #icon>
                  <RotateCw />
                </template>
              </Button>
            </Tooltip>
            <Tooltip placement="bottom" title="逆时针旋转">
              <Button
                :disabled="toolbarDisabled"
                size="small"
                type="primary"
                @click="handlerToolbar('rotate', -45)"
              >
                <template #icon>
                  <RotateCcwSquare />
                </template>
              </Button>
            </Tooltip>
            <Tooltip placement="bottom" title="顺时针旋转">
              <Button
                :disabled="toolbarDisabled"
                size="small"
                type="primary"
                @click="handlerToolbar('rotate', 45)"
              >
                <template #icon>
                  <RotateCwSquare />
                </template>
              </Button>
            </Tooltip>
            <Tooltip placement="bottom" title="水平翻转">
              <Button
                :disabled="toolbarDisabled"
                size="small"
                type="primary"
                @click="handlerToolbar('scaleX')"
              >
                <template #icon>
                  <MoveHorizontal />
                </template>
              </Button>
            </Tooltip>
            <Tooltip placement="bottom" title="垂直翻转">
              <Button
                :disabled="toolbarDisabled"
                size="small"
                type="primary"
                @click="handlerToolbar('scaleY')"
              >
                <template #icon>
                  <MoveVertical />
                </template>
              </Button>
            </Tooltip>
            <Tooltip placement="bottom" title="放大">
              <Button
                :disabled="toolbarDisabled"
                size="small"
                type="primary"
                @click="handlerToolbar('zoom', 0.1)"
              >
                <template #icon>
                  <ZoomIn />
                </template>
              </Button>
            </Tooltip>
            <Tooltip placement="bottom" title="缩小">
              <Button
                :disabled="toolbarDisabled"
                size="small"
                type="primary"
                @click="handlerToolbar('zoom', -0.1)"
              >
                <template #icon>
                  <ZoomOut />
                </template>
              </Button>
            </Tooltip>
          </Space>
        </div>
      </div>
      <div class="vben-cropper-modal-right">
        <div
          :class="`vben-cropper-modal-preview vben-cropper-modal-preview--${cropperModalProps?.circled ? 'circled' : 'square'} `"
        >
          <img v-if="previewSource" :src="previewSource" alt="" />
        </div>
        <template v-if="previewSource && cropperModalProps">
          <div class="vben-cropper-modal-group">
            <Avatar
              :shape="cropperModalProps.circled ? 'circle' : 'square'"
              :src="previewSource"
              :style="{
                width: '48px',
                height: `${48 / cropperModalProps.aspectRatio}px`,
              }"
            />
            <Avatar
              :shape="cropperModalProps.circled ? 'circle' : 'square'"
              :src="previewSource"
              :style="{
                width: '64px',
                height: `${64 / cropperModalProps.aspectRatio}px`,
              }"
            />
            <Avatar
              :shape="cropperModalProps.circled ? 'circle' : 'square'"
              :src="previewSource"
              :style="{
                width: '80px',
                height: `${80 / cropperModalProps.aspectRatio}px`,
              }"
            />
          </div>
        </template>
      </div>
    </div>
  </Modal>
</template>
<style lang="scss" scoped>
.vben-cropper-modal {
  display: flex;

  &-left,
  &-right {
    height: 340px;
  }

  &-left {
    width: 55%;
  }

  &-right {
    width: 45%;
  }

  &-cropper {
    height: 300px;
    background:
      #eee
        linear-gradient(
          45deg,
          rgb(0 0 0 / 25%) 25%,
          transparent 0,
          transparent 75%,
          rgb(0 0 0 / 25%) 0
        ),
      linear-gradient(
          45deg,
          rgb(0 0 0 / 25%) 25%,
          transparent 0,
          transparent 75%,
          rgb(0 0 0 / 25%) 0
        )
        0 0,
      12px 12px;
    background-size: 24px 24px;
  }

  &-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 10px;
  }

  &-preview {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 220px;
    padding: 10px;
    margin: 0 auto;
    overflow: hidden;

    &--circled {
      img {
        border-radius: 50%;
      }
    }

    img {
      max-width: 100%;
      max-height: 100%;
    }
  }

  &-group {
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding-top: 8px;
    margin-top: 8px;
    //border-top: 1px solid @border-color-base;
  }
}
</style>
