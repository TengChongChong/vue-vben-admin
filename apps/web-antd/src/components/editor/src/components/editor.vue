<script setup lang="ts">
import type { TinymceProps } from '#/components/editor/src/props';

import {
  computed,
  nextTick,
  onBeforeUnmount,
  onDeactivated,
  onMounted,
  ref,
  unref,
  watch,
} from 'vue';

import { Editor, type RawEditorSettings } from 'tinymce';
import tinymce from 'tinymce/tinymce';

import { plugins, toolbar } from '#/components/editor/src/components/tinymce';
import { isNumber } from '#/util/is';
import { buildShortUUID } from '#/util/uuid';

import 'tinymce/themes/silver';
import 'tinymce/icons/default/icons';
// 高级列表
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/lists';
// 自动链接
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/hr';
import 'tinymce/plugins/link';
import 'tinymce/plugins/paste';
// 查找替换
import 'tinymce/plugins/searchreplace';
// tab切入切出
import 'tinymce/plugins/tabfocus';
import 'tinymce/plugins/table';
// 快速排版
import 'tinymce/plugins/textpattern';
import 'tinymce/plugins/wordcount';

const props = withDefaults(defineProps<TinymceProps>(), {
  toolbar,
  plugins,
  height: 400,
  width: '100%',
  showImageUpload: false,
});

const emit = defineEmits(['inited', 'initError', 'update:value', 'change']);

const editorRef = ref<Editor>(null);
const tinymceId = ref<string>(buildShortUUID('tiny-vue'));
const elRef = ref<HTMLElement>(null);

const containerWidth = computed(() => {
  const width = props.width;
  if (isNumber(width)) {
    return `${width}px`;
  }
  return width;
});

const skinName = computed(() => {
  // return appStore.getDarkMode === 'light' ? 'oxide' : 'oxide-dark';
  return 'oxide';
});

const langName = computed(() => {
  // const lang = useLocale().getLocale.value;
  // return ['zh_CN', 'en'].includes(lang) ? lang : 'zh_CN';
  return 'zh_CN';
});

const initOptions = computed((): RawEditorSettings => {
  const { height, options, toolbar, plugins } = props;
  const publicPath = '/static/';
  return {
    selector: `#${unref(tinymceId)}`,
    height,
    toolbar,
    menubar: '',
    plugins,
    language_url: `${publicPath}tinymce/langs/${langName.value}.js`,
    language: langName.value,
    branding: false,
    default_link_target: '_blank',
    link_title: false,
    object_resizing: false,
    auto_focus: true,
    skin: skinName.value,
    skin_url: `${publicPath}tinymce/skins/ui/${skinName.value}`,
    content_css: `${publicPath}tinymce/skins/ui/${skinName.value}/content.min.css`,
    ...options,
    setup: (editor: Editor) => {
      editorRef.value = editor;
      editor.on('init', (e) => initSetup(e));
    },
  };
});

// todo: bug 暂时未找到解决方案
// tinymce.PluginManager.add('insertImage', (editor) => {
//   editor.ui.registry.addButton('insertImage', {
//     icon: 'image',
//     tooltip: '添加图片',
//     onAction() {
//       // openInsertImageModal(true);
//     },
//   });
// });

onMounted(() => {
  if (!initOptions.value.inline) {
    tinymceId.value = buildShortUUID('tiny-vue');
  }
  nextTick(() => {
    setTimeout(() => {
      initEditor();
    }, 30);
  });
});

onBeforeUnmount(() => {
  destroy();
});

onDeactivated(() => {
  destroy();
});

function destroy() {
  if (tinymce !== null) {
    tinymce?.remove?.(unref(initOptions).selector!);
  }
}

function initEditor() {
  const el = unref(elRef);
  if (el) {
    el.style.visibility = '';
  }
  tinymce
    .init(unref(initOptions))
    .then((editor) => {
      emit('inited', editor);
    })
    .catch((error) => {
      emit('initError', error);
    });
}

function initSetup() {
  const editor = unref(editorRef);
  if (!editor) {
  }
  const value = props.value || '';
  //
  editor.setContent(value);
  bindModelHandlers(editor);
}

function setValue(editor, val: string, prevVal?: string) {
  if (editor && val !== prevVal && val !== editor.getContent()) {
    editor.setContent(val);
  }
}

function bindModelHandlers(editor: any) {
  watch(
    () => props.value,
    (val: string, prevVal: string) => {
      setValue(editor, val, prevVal);
    },
    {
      immediate: true,
    },
  );

  editor.on('change keyup undo redo', () => {
    const content = editor.getContent();
    emit('update:value', content);
    emit('change', content);
  });
}

function handleUploading(name: string) {
  const editor = unref(editorRef);
  if (!editor) {
    return;
  }
  editor.execCommand('mceInsertContent', false, getUploadingName(name));
  const content = editor?.getContent() ?? '';
  setValue(editor, content);
}

function handleDone(name: string, html: string) {
  const editor = unref(editorRef);
  if (!editor) {
    return;
  }
  const content = editor?.getContent() ?? '';
  const val = content?.replace(getUploadingName(name), html) ?? '';
  setValue(editor, val);
}

function getUploadingName(name: string) {
  return `[uploading:${name}]`;
}
</script>

<template>
  <div :style="{ width: containerWidth }" class="editor-wrapper">
    <textarea
      v-if="!initOptions.inline"
      :id="tinymceId"
      ref="elRef"
      :style="{ visibility: 'hidden' }"
    >
    </textarea>
  </div>
</template>

<style scoped></style>
