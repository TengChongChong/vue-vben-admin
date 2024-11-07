<script setup lang="ts">
import type { FileUploadResponse } from '@vben/request';

import type { FileInfo } from '#/api/file/model/file-info-model';
import type { CropperProps } from '#/components/cropper/src/props';

import { computed, type CSSProperties, ref, unref, watch } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Avatar } from 'ant-design-vue';

import CropperModal from '#/components/cropper/src/components/cropper-modal.vue';
import { Upload } from '#/components/icons';

const props = withDefaults(defineProps<CropperProps>(), {
  width: 100,
  // 默认宽高比 1:1
  aspectRatio: 1,
  // 圆形
  circled: true,
  // image alt
  alt: '图片',
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
    height: `${props.width * props.aspectRatio}px`,
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
  const { alt, aspectRatio, circled } = props;
  dragModalApi.setState({ title: `上传${props.alt}` });
  dragModalApi.setData({
    alt,
    aspectRatio,
    circled,
    value: unref(currentValue),
    uploadRuleSlug: 'default-image',
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
        <template v-else>
          <Avatar
            :shape="props.circled ? 'circle' : 'square'"
            :size="props.width"
          >
            {{ props.alt }}
          </Avatar>
        </template>
      </div>
      <div :style="getImageWrapperStyle" class="vben-cropper-image-mask">
        <Upload />
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
    transition: opacity 0.4s;
    transform: translate(-50%, -50%);

    &:hover {
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
