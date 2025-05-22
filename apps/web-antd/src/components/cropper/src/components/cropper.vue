<script setup lang="ts">
import type { CSSProperties } from 'vue';

import type { FileUploadResponse } from '@vben/request';

import type { FileInfo } from '#/api/file/model/file-info-model';
import type { CropperProps } from '#/components/cropper/src/props';

import { computed, ref, unref, watch } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import CropperModal from '#/components/cropper/src/components/cropper-modal.vue';
import { LucideUpload } from '#/components/icons';

const props = withDefaults(defineProps<CropperProps>(), {
  width: 100,
  // 默认宽高比 1:1
  aspectRatio: 1,
  // 圆形
  circled: true,
  // image alt
  alt: '图片',
  ruleKey: 'default-image',
});

const emit = defineEmits(['update:value', 'change']);

const currentValue = ref<FileInfo>(props.value!);

watch(
  () => props.value,
  () => {
    currentValue.value = props.value!;
  },
);

const getImageWrapperStyle = computed((): CSSProperties => {
  return {
    width: `${props.width}px`,
    height: `${props.width / props.aspectRatio}px`,
    borderRadius: props.circled ? '50%' : '4px',
  };
});

const [CropperModalComp, dragModalApi] = useVbenModal({
  connectedComponent: CropperModal,
});

function handleUploadSuccess(data: FileUploadResponse) {
  emit('change', data);
  emit('update:value', data);
}

function handleOpenCropperModal() {
  const { alt, aspectRatio, circled, ruleKey } = props;
  dragModalApi.setState({ title: `上传${props.alt}` });
  dragModalApi.setData({
    alt,
    aspectRatio,
    circled,
    value: unref(currentValue),
    uploadRuleKey: ruleKey,
  });
  // dragModalApi.setState({ title: '外部动态标题' });
  dragModalApi.open();
}
</script>

<template>
  <div class="vben-cropper">
    <div class="vben-cropper-wrapper" @click="handleOpenCropperModal">
      <div :style="getImageWrapperStyle" class="vben-cropper-image-wrapper">
        <template v-if="currentValue">
          <img :src="currentValue.url" alt="" />
        </template>
      </div>
      <div
        :style="getImageWrapperStyle"
        :class="`vben-cropper-image-mask ${currentValue?.url ? '' : 'vben-cropper-image-mask--show'}`"
      >
        <LucideUpload />
      </div>
    </div>
    <CropperModalComp @upload-success="handleUploadSuccess" />
  </div>
</template>

<style lang="scss" scoped>
.vben-cropper {
  display: inline-block;
  text-align: center;

  &-wrapper {
    position: relative;
  }

  &-image-wrapper {
    overflow: hidden;
    cursor: pointer;

    img {
      width: 100%;
    }
  }

  &-image-mask {
    position: absolute;
    top: 50%;
    left: 50%;
    display: inline-flex;
    width: 100%;
    height: 100%;
    cursor: pointer;
    background: rgb(0 0 0 / 40%);
    border: inherit;
    border-radius: inherit;
    opacity: 0;
    transform: translate(-50%, -50%);
    transition: opacity 0.4s;

    &:hover {
      opacity: 40;
    }

    &--show {
      opacity: 40;
    }

    svg {
      margin: auto;
      font-size: 40px;
      color: rgb(214 214 214);
    }
  }
}
</style>
