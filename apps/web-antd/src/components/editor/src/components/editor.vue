<script setup lang="ts">
import type { EditorProps } from '#/components/editor/src/props';

import {
  computed,
  nextTick,
  onBeforeUnmount,
  onDeactivated,
  onMounted,
  ref,
  unref,
} from 'vue';

import { useAccessStore } from '@vben/stores';

import { AiEditor } from 'aieditor';
import { message } from 'ant-design-vue';

import { toolbarKeys } from '#/components/editor/src/components/config';
import { isNumber } from '#/util/is';

import 'aieditor/dist/style.css';

const props = withDefaults(defineProps<EditorProps>(), {
  toolbarKeys,
  // 是否可以通过在右下角拖动调整编辑器的大小。
  draggable: false,
  height: 450,
  width: '100%',
  textSelectionBubbleMenu: {
    enable: true,
    items: ['Bold', 'Italic', 'Underline', 'Strike', 'code', 'comment'],
  },
  showImageUpload: false,
});

const emit = defineEmits(['update:value', 'change']);

const accessStore = useAccessStore();

const elementRef = ref<HTMLElement>(null);
let aiEditor: AiEditor | null = null;

const containerWidth = computed(() => {
  const width = props.width;
  if (isNumber(width)) {
    return `${width}px`;
  }
  return width;
});

const containerHeight = computed(() => {
  const height = props.height;
  if (isNumber(height)) {
    return `${height}px`;
  }
  return height;
});

const skinName = computed(() => {
  return 'light';
});

// const langName = computed(() => {
// const lang = useLocale().getLocale.value;
// return ['zh_CN', 'en'].includes(lang) ? lang : 'zh_CN';
//   return 'zh_CN';
// });

const initOptions = computed(() => {
  const { textSelectionBubbleMenu, draggable, toolbarKeys, value } = props;

  return {
    // language: langName.value,
    element: unref(elementRef) as Element,
    placeholder: '点击输入内容...',
    theme: skinName.value,
    textSelectionBubbleMenu,
    draggable,
    toolbarKeys,
    content: value,
    image: getUploadConfig('image', 'default-image'),
    video: getUploadConfig('video', 'default-video'),
    attachment: getUploadConfig('attachment', 'default-attachment'),
    onChange: (editor) => {
      const content = editor.getHtml();
      emit('update:value', content);
      emit('change', content);
    },
  };
});

function getUploadConfig(type: string, uploadRuleKey?: string) {
  const commonConfig = {
    uploadUrl: `${import.meta.env.VITE_GLOB_API_URL}/auth/file/upload/${uploadRuleKey}`,
    uploadFormName: 'file',
    uploadHeaders: {
      Authorization: accessStore.accessToken,
    },
  };
  switch (type) {
    case 'attachment': {
      return {
        ...commonConfig,
        uploaderEvent: {
          onError: (file, error) => handleUploadError(file, error),
          onSuccess: (file, response) => {
            const { url, originalFilename } = response.data;
            return {
              errorCode: 0,
              data: {
                href: url,
                fileName: originalFilename,
                // class: 'editor-media editor-attachment',
              },
            };
          },
        },
      };
    }
    case 'image': {
      return {
        ...commonConfig,
        defaultSize: 350,
        uploaderEvent: {
          onError: (file, error) => handleUploadError(file, error),
          onSuccess: (file, response) => {
            const { url, originalFilename } = response.data;
            return {
              errorCode: 0,
              data: {
                src: url,
                alt: originalFilename,
                align: 'center',
                class: 'editor-media editor-image',
              },
            };
          },
        },
        bubbleMenuItems: ['AlignLeft', 'AlignCenter', 'AlignRight', 'delete'],
      };
    }
    case 'video': {
      return {
        ...commonConfig,
        uploaderEvent: {
          onError: (file, error) => handleUploadError(file, error),
          onSuccess: (file, response) => {
            const { url } = response.data;
            return {
              errorCode: 0,
              data: {
                src: url,
                // poster: '封面',
                // class: 'editor-media editor-video',
                width: '100%',
                controls: 'true',
              },
            };
          },
        },
      };
    }
  }
}

function handleUploadError(file, error) {
  message.error(`${file.name}上传失败，${error}`);
}

// onActivated(() => {
//   init();
// });

onMounted(() => {
  init();
});

function init() {
  nextTick(() => {
    setTimeout(() => {
      initEditor();
    }, 30);
  });
}

onBeforeUnmount(() => {
  destroy();
});

onDeactivated(() => {
  destroy();
});

function destroy() {
  aiEditor && aiEditor.destroy();
}

function initEditor() {
  aiEditor = new AiEditor(unref(initOptions));
}
</script>

<template>
  <div :style="{ width: containerWidth }" class="editor-wrapper">
    <div ref="elementRef" :style="{ height: containerHeight }"></div>
  </div>
</template>

<style scoped></style>
