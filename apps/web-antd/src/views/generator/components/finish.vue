<script setup lang="ts">
import type { GeneratorConfig } from '#/api/generator/model/generatorModel';

import { ref, watch } from 'vue';

import {
  Button,
  Checkbox,
  Divider,
  List,
  ListItem,
  message,
  Space,
  TypographyText,
} from 'ant-design-vue';
import { cloneDeep } from 'lodash-es';

import { generateApi } from '#/api/generator/generator';
import { LucideArrowLeft, LucideCheck } from '#/components/icons';

import { GenFile } from '../types/generator.data';
import { getApiFileName, getFrontEndPath } from '../util/util';

const props = defineProps<{
  generatorConfig: GeneratorConfig;
}>();

const emit = defineEmits(['prev']);

const overwriteFile = ref<boolean>(false);

const generatorFileArray = ref<string[]>([]);

initGeneratorFileArray();

watch(
  () => props.generatorConfig,
  () => {
    initGeneratorFileArray();
  },
  { deep: true },
);

/**
 * 预览生成文件列表
 */
function initGeneratorFileArray() {
  generatorFileArray.value = [];
  const basicsConfig = props.generatorConfig?.basicsConfig;
  if (
    !basicsConfig ||
    !basicsConfig.genFile ||
    basicsConfig.genFile.length === 0
  ) {
    return null;
  }
  basicsConfig.genFile.forEach((item) => {
    const packagePath = basicsConfig.packagePath?.replace(/\./g, '/');
    const backEndPathBasePath = `${basicsConfig.backEndPath}/src/main/java/`;
    switch (item) {
      case GenFile.API_TS: {
        generatorFileArray.value.push(
          `${basicsConfig.frontEndPath}${basicsConfig.apiPath}`,
        );
        const modelName = `${getApiFileName(basicsConfig.table)}-model.ts`;
        generatorFileArray.value.push(
          `${basicsConfig.frontEndPath}/src/api/${getFrontEndPath(
            basicsConfig.table as string,
          )}/model/${modelName}`,
        );
        break;
      }
      case GenFile.CONTROLLER: {
        generatorFileArray.value.push(
          `${backEndPathBasePath}${packagePath}/controller/${basicsConfig.modelName}Controller.java`,
        );
        break;
      }
      case GenFile.INPUT_VUE: {
        generatorFileArray.value.push(
          `${basicsConfig.frontEndPath}${basicsConfig.viewPath}/input.vue`,
        );
        break;
      }
      case GenFile.LIST_VUE: {
        generatorFileArray.value.push(
          `${basicsConfig.frontEndPath}${basicsConfig.viewPath}/list.vue`,
        );
        break;
      }
      case GenFile.MAPPER: {
        generatorFileArray.value.push(
          `${backEndPathBasePath}${packagePath}/dao/${basicsConfig.modelName}Mapper.java`,
          `${backEndPathBasePath}${packagePath}/dao/mapping/${basicsConfig.modelName}Mapping.xml`,
        );
        break;
      }
      case GenFile.MODEL: {
        generatorFileArray.value.push(
          `${backEndPathBasePath}${packagePath}/model/${basicsConfig.modelName}.java`,
        );
        break;
      }
      case GenFile.SERVICE: {
        generatorFileArray.value.push(
          `${backEndPathBasePath}${packagePath}/service/${basicsConfig.modelName}Service.java`,
          `${backEndPathBasePath}${packagePath}/service/impl/${basicsConfig.modelName}ServiceImpl.java`,
        );
        break;
      }
    }
  });
}

function handleStepPrev() {
  emit('prev');
}

function generateCode() {
  const generatorConfig = cloneDeep(props.generatorConfig) as GeneratorConfig;
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

  generateApi(generatorConfig as GeneratorConfig).then(() => {
    message.success('生成成功');
  });
}
</script>

<template>
  <div class="generator-form">
    <h4>点击生成将生成以下文件</h4>
    <List :data-source="generatorFileArray" bordered size="small">
      <template #renderItem="{ item }">
        <ListItem>{{ item }}</ListItem>
      </template>
    </List>

    <Divider orientation="left">说明</Divider>
    <div class="mb-6">
      <TypographyText type="danger">
        警告：如勾选"覆盖已有文件"将会覆盖项目中已有文件，请谨慎操作
      </TypographyText>
    </div>

    <div class="footer-button bg-background">
      <Space>
        <Button @click="handleStepPrev">
          <template #icon>
            <LucideArrowLeft />
          </template>
          上一步
        </Button>
        <Button type="primary" @click="generateCode">
          <template #icon>
            <LucideCheck />
          </template>
          生成
        </Button>
        <Checkbox v-model:checked="overwriteFile">
          <TypographyText type="danger">警告：覆盖已有文件</TypographyText>
        </Checkbox>
      </Space>
    </div>
  </div>
</template>
