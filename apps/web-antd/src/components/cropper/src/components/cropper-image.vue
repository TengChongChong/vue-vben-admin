<script setup lang="ts">
import type { CSSProperties } from 'vue';

import type { CropperImageProps } from '#/components/cropper/src/props';

import { computed, onMounted, onUnmounted, ref, unref, useAttrs } from 'vue';

import { useDebounceFn } from '@vueuse/shared';
import Cropper from 'cropperjs';

import 'cropperjs/dist/cropper.css';

const props = withDefaults(defineProps<CropperImageProps>(), {
  height: 360,
  realTimePreview: true,
});

const emit = defineEmits(['cropperEnd', 'ready', 'cropperEndError']);

const attrs = useAttrs();

const defaultOptions: Cropper.Options = {
  aspectRatio: 1,
  viewMode: 1,
  zoomable: true,
  zoomOnTouch: true,
  zoomOnWheel: true,
  cropBoxMovable: true,
  cropBoxResizable: true,
  toggleDragModeOnDblclick: true,
  autoCrop: true,
  background: true,
  highlight: true,
  center: true,
  responsive: true,
  restore: true,
  checkCrossOrigin: true,
  checkOrientation: true,
  scalable: true,
  modal: true,
  guides: true,
  movable: true,
  rotatable: true,
};

const imgElRef = ref();
const cropper = ref<Cropper>();
const isReady = ref(false);

// event: return base64 and width and height information after cropping
function croppered() {
  if (!cropper.value) {
    return;
  }
  const imgInfo = cropper.value.getData();
  const canvas = cropper.value.getCroppedCanvas();
  canvas.toBlob((blob) => {
    if (!blob) {
      return;
    }
    const fileReader: FileReader = new FileReader();
    fileReader.readAsDataURL(blob);
    fileReader.onloadend = (e) => {
      emit('cropperEnd', {
        blob,
        imgBase64: e.target?.result ?? '',
        imgInfo,
      });
    };
    // eslint-disable-next-line unicorn/prefer-add-event-listener
    fileReader.onerror = () => {
      emit('cropperEndError');
    };
  }, 'image/jpg');
}
// Real-time display preview
function realTimeCropper() {
  props.realTimePreview && croppered();
}

// const debounceRealTimeCropper = debounce(realTimeCropper, 80);

const debounceRealTimeCropper = useDebounceFn(realTimeCropper, 100);

onMounted(init);

onUnmounted(() => {
  cropper.value?.destroy();
});

async function init() {
  const imgEl = unref(imgElRef);
  if (!imgEl) {
    return;
  }
  cropper.value = new Cropper(imgEl, {
    ...defaultOptions,
    ready: () => {
      isReady.value = true;
      realTimeCropper();
      emit('ready', cropper.value);
    },
    crop() {
      debounceRealTimeCropper();
    },
    zoom() {
      debounceRealTimeCropper();
    },
    cropmove() {
      debounceRealTimeCropper();
    },
    ...props.options,
  });
}

const getWrapperStyle = computed((): CSSProperties => {
  return {
    height: `${props.height}px`,
  };
});

const getImageStyle = computed((): CSSProperties => {
  return {
    height: props.height,
    maxWidth: '100%',
    ...props.imageStyle,
  };
});

const getClass = computed(() => {
  return [
    'vben-cropper-image',
    attrs.class,
    {
      [`vben-cropper-image--circled`]: props.circled,
    },
  ];
});
</script>

<template>
  <div :class="getClass" :style="getWrapperStyle">
    <img
      v-show="isReady"
      ref="imgElRef"
      :alt="alt"
      :src="src"
      :style="getImageStyle"
    />
  </div>
</template>

<style lang="scss" scoped>
.vben-cropper-image {
  &--circled {
    :deep(.cropper-container) {
      .cropper-view-box,
      .cropper-face {
        border-radius: 50%;
      }
    }
  }
}
</style>
