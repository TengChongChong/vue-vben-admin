<script setup lang="ts">
import type { GeneratorConfig, WizardGeneratorConfig } from '#/api';

import { computed, ref, toRef } from 'vue';
import { useRouter } from 'vue-router';

import { useClipboard } from '@vueuse/core';

import {
  Button,
  Checkbox,
  Collapse,
  CollapsePanel,
  List,
  ListItem,
  message,
  Popconfirm,
  Result,
  Space,
  TypographyText,
} from 'ant-design-vue';
import { cloneDeep } from 'lodash-es';

import { generateApi } from '#/api';
import { Divider } from '#/components/divider';
import { LucideArrowLeft, LucideCheck, LucideCopy } from '#/components/icons';

import { useGeneratorFilePreview } from '../composables/use-generator-file-preview';
import {
  extractApiErrorMessage,
  groupGeneratorFilePaths,
} from '../util/generator-helpers';
import { GeneratorTemplate } from '../types/generator.data';

const props = defineProps<{
  generatorConfig: WizardGeneratorConfig;
}>();

const emit = defineEmits(['prev', 'success']);

const router = useRouter();
const { copy } = useClipboard();

const overwriteFile = ref<boolean>(false);
const generating = ref<boolean>(false);
const generateSuccess = ref<boolean>(false);
const generateError = ref<string>('');

const { generatorFileArray } = useGeneratorFilePreview(
  toRef(props, 'generatorConfig'),
);

const groupedFiles = computed(() =>
  groupGeneratorFilePaths(generatorFileArray.value),
);

const fileGroups = computed(() =>
  [
    {
      key: 'backend',
      title: '后端 Java / XML',
      files: groupedFiles.value.backend,
    },
    {
      key: 'frontendVue',
      title: '前端 Vue',
      files: groupedFiles.value.frontendVue,
    },
    {
      key: 'frontendTs',
      title: '前端 TypeScript',
      files: groupedFiles.value.frontendTs,
    },
    { key: 'other', title: '其他', files: groupedFiles.value.other },
  ].filter((group) => group.files.length > 0),
);

function handleStepPrev() {
  emit('prev');
}

async function copyPath(path: string) {
  await copy(path);
  message.success('路径已复制');
}

function validateBeforeGenerate(config: GeneratorConfig): string | null {
  const basics = config.basicsConfig;
  if (!basics || !config.tableInfo) {
    return '配置不完整，请返回第一步完善基本信息';
  }
  if (
    basics.generatorTemplate === GeneratorTemplate.SUB_TABLE &&
    !basics.mainTableField
  ) {
    return '子表模式需选择「与主表关联字段」';
  }
  return null;
}

async function generateCode() {
  if (generating.value) {
    return;
  }
  generateSuccess.value = false;
  generateError.value = '';

  const generatorConfig = cloneDeep(props.generatorConfig) as GeneratorConfig;
  const validationError = validateBeforeGenerate(generatorConfig);
  if (validationError) {
    message.error(validationError);
    return;
  }

  if (generatorConfig.basicsConfig) {
    generatorConfig.basicsConfig.overwrite = overwriteFile.value;
  }
  generatorConfig.queryConfig = generatorConfig.queryConfig?.filter(
    (item) => item.isEnable,
  );
  generatorConfig.tableConfig = generatorConfig.tableConfig?.filter(
    (item) => item.isEnable,
  );
  generatorConfig.inputConfig = generatorConfig.inputConfig?.filter(
    (item) => item.isEnable,
  );
  generatorConfig.importConfig = generatorConfig.importConfig?.filter(
    (item) => item.isEnable,
  );
  generatorConfig.exportConfig = generatorConfig.exportConfig?.filter(
    (item) => item.isEnable,
  );

  generating.value = true;
  try {
    await generateApi(generatorConfig, {
      errorMessageMode: 'silent',
    });
    generateSuccess.value = true;
    message.success('生成成功');
    emit('success');
  } catch (error) {
    generateError.value = extractApiErrorMessage(error);
    message.error(generateError.value);
  } finally {
    generating.value = false;
  }
}

function goMenuManage() {
  router.push('/auth/menu/list');
}
</script>

<template>
  <div class="generator-form">
    <Result
      v-if="generateSuccess"
      class="mb-6"
      status="success"
      sub-title="代码已写入项目目录，如生成了菜单可前往菜单管理查看权限配置。"
      title="生成成功"
    >
      <template #extra>
        <Space>
          <Button
            v-if="generatorConfig.basicsConfig?.menuName"
            @click="goMenuManage"
          >
            前往菜单管理
          </Button>
          <Button type="primary" @click="generateSuccess = false">
            继续查看文件列表
          </Button>
        </Space>
      </template>
    </Result>

    <Result
      v-else-if="generateError"
      class="mb-6"
      status="error"
      sub-title="请根据错误信息调整后重试"
      :title="generateError"
    />

    <h4>点击生成将生成以下文件</h4>
    <Collapse
      v-if="fileGroups.length > 0"
      :default-active-key="fileGroups.map((group) => group.key)"
    >
      <CollapsePanel
        v-for="group in fileGroups"
        :key="group.key"
        :header="`${group.title} (${group.files.length})`"
      >
        <List :data-source="group.files" size="small">
          <template #renderItem="{ item }">
            <ListItem>
              <span class="break-all">{{ item }}</span>
              <template #actions>
                <Button size="small" type="link" @click="copyPath(item)">
                  <LucideCopy class="size-3.5" />
                  复制
                </Button>
              </template>
            </ListItem>
          </template>
        </List>
      </CollapsePanel>
    </Collapse>

    <Divider>说明</Divider>
    <div class="my-4">
      <TypographyText type="danger">
        警告：如勾选"覆盖已有文件"将会覆盖项目中已有文件，请谨慎操作
      </TypographyText>
    </div>

    <div class="mb-4">
      <Checkbox v-model:checked="overwriteFile">
        <TypographyText type="danger">覆盖已有文件</TypographyText>
      </Checkbox>
    </div>

    <div class="footer-button bg-background">
      <Space>
        <Button @click="handleStepPrev">
          <template #icon>
            <LucideArrowLeft />
          </template>
          上一步
        </Button>
        <Popconfirm
          cancel-text="取消"
          ok-text="确认生成"
          title="确认生成代码？覆盖模式下将直接覆盖已有文件。"
          @confirm="generateCode"
        >
          <Button :loading="generating" type="primary">
            <template #icon>
              <LucideCheck />
            </template>
            生成
          </Button>
        </Popconfirm>
      </Space>
    </div>
  </div>
</template>
