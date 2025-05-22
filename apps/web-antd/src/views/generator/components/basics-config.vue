<script setup lang="ts">
import type { SelectModel } from '#/api/base/model/select-model';
import type { TreeNode, TreeNodeModel } from '#/api/base/model/tree-model';
import type {
  BasicsConfigModel,
  TableInfo,
} from '#/api/generator/model/generatorModel';

import { onMounted, ref, unref } from 'vue';

import { useUserStore } from '@vben/stores';
import { listToTree } from '@vben/utils';

import { Affix, Button, Divider, Input, Select } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { selectAllApi } from '#/api/auth/sys-menu';
import {
  getTableInfoApi,
  selectModulesApi,
  selectTableApi,
} from '#/api/generator/generator';
import { selectOptionsApi } from '#/api/sys/sys-data-source';
import { LucideArrowRight } from '#/components/icons';
import { isArray, isBlank } from '#/util/is';

import {
  FormGeneratorTemplate,
  GeneratorTemplate,
  GenFile,
  ListGeneratorTemplate,
  TEMPLATE,
} from '../types/generator.data';
import {
  getApiFileName,
  getControllerMapping,
  getFrontEndApiPath,
  getPermissionCode,
} from '../util/util';
import ChoseButtonGroup from './form/chose-button-group.vue';

const emit = defineEmits(['next', 'prev', 'updateConfig']);
const [BaseForm, baseFormApi] = useVbenForm({
  commonConfig: {
    labelWidth: 140,
  },
  showDefaultActions: false,
  schema: [
    // {
    //   fieldName: 'dividerTemplate',
    //   component: 'Divider',
    //   hideLabel: true,
    //   componentProps: { text: '模版' },
    //   formItemClass: 'xl:col-span-2 2xl:col-span-4',
    // },
    {
      fieldName: 'generatorTemplate',
      label: '模版',
      component: 'Input',
      componentProps: {
        options: [
          {
            name: '主表',
            label: '适用于单表的增、删、改、查、导入、导出等操作',
            value: 'main-table',
          },
          {
            name: '子表',
            label: '适用于一对多的子表，如：订单-订单项，订单-订单明细等',
            value: 'sub-table',
          },
        ],
        onChange: (value: string) => {
          handleGeneratorTemplateChange(value);
        },
      },
      // dependencies: {
      //   triggerFields: ['generatorTemplate'],
      //   trigger(values) {
      //     handleGeneratorTemplateChange(values.generatorTemplate);
      //   },
      // },
      rules: 'selectRequired',
      formItemClass: 'xl:col-span-2 2xl:col-span-4',
    },
    {
      fieldName: 'genMethod',
      label: '生成方法',
      component: 'DictCheckbox',
      componentProps: {
        dictType: 'genMethod',
      },
      rules: 'selectRequired',
      description: '需要生成的方法',
      formItemClass: 'xl:col-span-2 2xl:col-span-4',
    },
    {
      fieldName: 'genFile',
      label: '生成文件',
      component: 'DictCheckbox',
      componentProps: {
        dictType: 'genFile',
      },
      rules: 'selectRequired',
      description: '需要生成的文件',
      formItemClass: 'xl:col-span-2 2xl:col-span-4',
    },
    {
      fieldName: 'listGeneratorTemplate',
      label: '列表模板',
      component: 'Input',
      componentProps: {
        options: [
          { name: '表格 - Table', label: '展示行列数据', value: 'table' },
          {
            // todo: show: model.generatorTemplate === 'main-table',
            name: '树表格 - TreeTable',
            label: '树形数据展示，可拖动调整排序或结构',
            value: 'tree-table',
            tips: '默认使用id作为主键，parent_id作为父id，order_no作为排序值，如需修改请生成后调整',
          },
        ],
      },
      rules: 'selectRequired',
      dependencies: {
        triggerFields: ['genFile'],
        show(values) {
          return needShow(values.genFile, [GenFile.LIST_VUE]);
        },
      },
      formItemClass: 'xl:col-span-2 2xl:col-span-4',
    },
    {
      fieldName: 'formGeneratorTemplate',
      label: '表单模板',
      component: 'Input',
      componentProps: {
        options: [
          {
            name: '对话框 - Modal',
            label: '适用于简单表单，1 ~ 8 个字段',
            value: 'modal',
          },
          {
            name: '抽屉 - Drawer',
            label: '适用于复杂表单，6个及以上字段',
            value: 'drawer',
          },
        ],
      },
      rules: 'selectRequired',
      dependencies: {
        triggerFields: ['genFile'],
        show(values) {
          return needShow(values.genFile, [GenFile.INPUT_VUE]);
        },
      },
      formItemClass: 'xl:col-span-2 2xl:col-span-4',
    },
    // {
    //   fieldName: 'dividerDB',
    //   component: 'Divider',
    //   hideLabel: true,
    //   componentProps: { text: '基础信息' },
    //   formItemClass: 'xl:col-span-2 2xl:col-span-4',
    // },
    {
      fieldName: 'dataSource',
      label: '数据源',
      component: 'ApiSelect',
      componentProps: {
        api: selectOptionsApi,
        onChange: (value: string) => {
          handleDataSourceChange(value);
        },
      },
      rules: 'selectRequired',
    },
    {
      fieldName: 'table',
      label: '表',
      component: 'ApiSelect',
      componentProps: {
        showSearch: true,
        api: selectTableApi,
        afterFetch: (result: SelectModel[]) => {
          result.forEach((item) => {
            item.label = `${item.value} - ${item.label}`;
          });
          return result;
        },
        onChange: (value: string) => {
          handleTableChange(value);
        },
      },
      description: '数据库表',
      rules: 'selectRequired',
    },
    {
      fieldName: 'mainTableProperty',
      label: '与主表关联Property',
      component: 'Input',
      formItemClass: 'hidden',
    },
    {
      fieldName: 'mainTableField',
      label: '与主表关联字段',
      component: 'Input',
      componentProps: {
        onChange: (value: string) => handleMainTableFieldChange(value),
      },
      rules: 'selectRequired',
      dependencies: {
        triggerFields: ['generatorTemplate', 'table'],
        show(values) {
          return values.generatorTemplate === 'sub-table' && values.table;
        },
      },
    },
    {
      fieldName: 'modelName',
      label: 'Model 名称',
      component: 'Input',
      description: '用于前 / 后端Model命名',
      rules: 'required',
    },
    {
      fieldName: 'businessName',
      label: '业务名称',
      component: 'Input',
      description: '用于controller/entity/dao/service/ts文件注释',
      rules: 'required',
    },
    {
      fieldName: 'controllerMapping',
      label: 'Api Url前缀',
      description: '用于Controller中@RequestMapping与Api.ts中BASE_URL',
      component: 'Input',
      rules: 'required',
    },
    {
      fieldName: 'dividerBackend',
      component: 'Divider',
      hideLabel: true,
      componentProps: { text: '后端' },
      formItemClass: 'xl:col-span-2 2xl:col-span-4',
      dependencies: {
        triggerFields: ['genFile'],
        show(values) {
          return needShow(values.genFile, [
            GenFile.MODEL,
            GenFile.MAPPER,
            GenFile.SERVICE,
            GenFile.CONTROLLER,
          ]);
        },
      },
    },
    {
      fieldName: 'backEndPath',
      label: '后端项目路径',
      component: 'InputGroup',
      description: 'idea中的项目绝对路径，无需/结尾',
      rules: 'required',
      formItemClass: 'xl:col-span-2 2xl:col-span-4',
      dependencies: {
        triggerFields: ['genFile'],
        show(values) {
          return needShow(values.genFile, [
            GenFile.MODEL,
            GenFile.MAPPER,
            GenFile.SERVICE,
            GenFile.CONTROLLER,
          ]);
        },
      },
      // formItemClass: 'xl:col-span-1 2xl:col-span-2',
    },
    {
      fieldName: 'author',
      label: '作者',
      component: 'Input',
      description: '注释中的 @author',
      rules: 'required',
      dependencies: {
        triggerFields: ['genFile'],
        show(values) {
          return needShow(values.genFile, [
            GenFile.MODEL,
            GenFile.MAPPER,
            GenFile.SERVICE,
            GenFile.CONTROLLER,
          ]);
        },
      },
    },
    {
      fieldName: 'menuName',
      label: '菜单名称',
      description: '如填写会自动添加菜单及权限',
      component: 'Input',
      dependencies: {
        triggerFields: ['genFile'],
        show(values) {
          return needShow(values.genFile, [GenFile.CONTROLLER]);
        },
      },
    },
    {
      fieldName: 'menuParentId',
      label: '上级菜单',
      component: 'ApiTreeSelect',
      componentProps: {
        api: selectAllApi,
        afterFetch: (res: TreeNodeModel[]) => {
          const treeNodes: TreeNode[] = [];
          res.forEach((item) => {
            const { id, parentId, title } = item;
            treeNodes.push({
              id,
              parentId,
              label: title,
              value: id,
              key: id,
            });
          });
          return listToTree(treeNodes);
        },
      },
      dependencies: {
        triggerFields: ['genFile'],
        show(values) {
          return needShow(values.genFile, [GenFile.CONTROLLER]);
        },
      },
    },
    {
      fieldName: 'permissionCode',
      label: '权限标识',
      description: 'Controller方法中的@RequiresPermissions值前缀',
      component: 'Input',
      dependencies: {
        triggerFields: ['genFile'],
        show(values) {
          return needShow(values.genFile, [GenFile.CONTROLLER]);
        },
      },
    },
    {
      fieldName: 'packagePath',
      label: 'package',
      description: 'package 路径',
      component: 'Input',
      rules: 'required',
      dependencies: {
        triggerFields: ['genFile'],
        show(values) {
          return needShow(values.genFile, [
            GenFile.MODEL,
            GenFile.MAPPER,
            GenFile.SERVICE,
            GenFile.CONTROLLER,
          ]);
        },
      },
    },
    {
      fieldName: 'dividerFrontEnd',
      component: 'Divider',
      hideLabel: true,
      componentProps: { text: '前端' },
      formItemClass: 'xl:col-span-2 2xl:col-span-4',
      dependencies: {
        triggerFields: ['genFile'],
        show(values) {
          return needShow(values.genFile, [
            GenFile.LIST_VUE,
            GenFile.INPUT_VUE,
            GenFile.API_TS,
          ]);
        },
      },
    },
    {
      fieldName: 'frontEndPath',
      label: '前端项目路径',
      description: 'idea中的项目绝对路径，无需/结尾',
      component: 'Input',
      rules: 'required',
      formItemClass: 'xl:col-span-2 2xl:col-span-4',
      dependencies: {
        triggerFields: ['genFile'],
        show(values) {
          return needShow(values.genFile, [
            GenFile.LIST_VUE,
            GenFile.INPUT_VUE,
            GenFile.API_TS,
          ]);
        },
      },
    },
    {
      fieldName: 'viewPath',
      label: '页面路径',
      description: '*.vue存放路径',
      component: 'Input',
      componentProps: {
        prefix: '前端项目路径+',
      },
      rules: 'required',
      formItemClass: 'xl:col-span-1 2xl:col-span-2',
      dependencies: {
        triggerFields: ['genFile'],
        show(values) {
          return needShow(values.genFile, [
            GenFile.LIST_VUE,
            GenFile.INPUT_VUE,
          ]);
        },
      },
    },
    {
      fieldName: 'apiPath',
      label: 'api路径',
      description: 'api.ts存放路径',
      component: 'Input',
      componentProps: {
        prefix: '前端项目路径+',
      },
      rules: 'required',
      formItemClass: 'xl:col-span-1 2xl:col-span-2',
      dependencies: {
        triggerFields: ['genFile'],
        show(values) {
          return needShow(values.genFile, [GenFile.API_TS]);
        },
      },
    },
  ],
  wrapperClass: 'grid-cols-1 xl:grid-cols-2 2xl:grid-cols-4',
});

const userStore = useUserStore();
// 表信息
const tableInfo = ref<TableInfo>();
// 默认设置
const defaultConfig: BasicsConfigModel = {
  generatorTemplate: GeneratorTemplate.MAIN_TABLE,
  listGeneratorTemplate: ListGeneratorTemplate.TABLE,
  formGeneratorTemplate: FormGeneratorTemplate.DRAWER,
  dataSource: 'master',
  author: userStore.userInfo?.nickname,
  frontEndPath: import.meta.env.VITE_PROJECT_PATH,
  // frontEndPath: '/Users/tengchong/Desktop/generator/test/front-end',
  genMethod: [],
  genFile: [],
  overwrite: false,
};

// 后端模块列表
const modules = ref<SelectModel[]>([]);
// 后端模块
const moduleValue = ref<number | string | undefined>();

onMounted(() => {
  selectModulesApi().then((res) => {
    modules.value = res;
  });

  baseFormApi.setValues({ ...defaultConfig });
  handleListGeneratorTemplateChange(defaultConfig.listGeneratorTemplate);
  handleDataSourceChange(defaultConfig.dataSource);
});

/**
 * 更改表
 *
 * @param table
 */
async function handleTableChange(table: string) {
  const values = (await baseFormApi.getValues()) as BasicsConfigModel;
  // @ts-ignore
  if (values.dataSource && table) {
    getTableInfoApi(values.dataSource, table).then((info) => {
      tableInfo.value = info;
      const { comment, entityName } = info;
      let packagePath = table;
      if (table.includes('_')) {
        packagePath = table.slice(0, Math.max(0, table.indexOf('_')));
      }
      // 设置一些默认值
      baseFormApi.setValues({
        businessName: comment,
        menuName: comment,
        modelName: entityName,
        permissionCode: getPermissionCode(table),
        packagePath: `com.easy.admin.${packagePath}`,
        controllerMapping: `/auth/${getControllerMapping(table)}`,
        viewPath: `/src/views/${getControllerMapping(table)}`,
        apiPath: `/src/api/${getFrontEndApiPath(table)}/${getApiFileName(table)}.ts`,
      });
      // 设置模块
      setModules(table);
    });
  }
}

function setModules(table: string) {
  if (!modules.value || modules.value.length === 0) {
    return;
  }
  let prefix = table.toLowerCase();
  if (table.toLowerCase().includes('_')) {
    prefix = table.toLowerCase().slice(0, Math.max(0, table.indexOf('_')));
  }
  // baseFormApi.setValues({
  //   backEndPath: '/Users/tengchong/Desktop/generator/test/back-end',
  // });
  for (let i = 0; i < modules.value.length; i++) {
    if (modules.value[i]?.label.includes(prefix)) {
      moduleValue.value = modules.value[i]?.value;
      baseFormApi.setValues({
        backEndPath: moduleValue.value,
      });
      return;
    }
  }
}

/**
 * 更改生成模板
 *
 * @param generatorTemplate 模板
 */
function handleGeneratorTemplateChange(generatorTemplate: string) {
  if (generatorTemplate === 'sub-table') {
    baseFormApi.setValues({
      listGeneratorTemplate: ListGeneratorTemplate.TABLE,
    });
    handleListGeneratorTemplateChange(ListGeneratorTemplate.TABLE);
  }
}

/**
 * 更改列表页生成模板
 *
 * @param generatorTemplate 模板
 */
function handleListGeneratorTemplateChange(generatorTemplate: string) {
  const config = TEMPLATE[generatorTemplate];
  if (config) {
    baseFormApi.setValues({
      genFile: config.file,
      genMethod: config.method,
    });
  }
}

function handleDataSourceChange(dataSource: string) {
  baseFormApi.updateSchema([
    {
      fieldName: 'table',
      component: dataSource ? 'ApiSelect' : 'Select',
      componentProps: {
        params: {
          dataSource,
        },
      },
    },
  ]);
}

/**
 * 更改后端模块
 *
 * @param path 模块路径
 */
function handleModuleChange(path: string) {
  baseFormApi.setValues({
    backEndPath: path,
  });
}

/**
 * 是否需要显示
 *
 * @param files 当前选中生成文件
 * @param file 需要显示的文件
 */
function needShow(files: string[], file: string | string[]): boolean {
  if (!files || files.length === 0) {
    return false;
  }
  if (isArray(file)) {
    for (const element of file) {
      if (files.includes(element)) {
        return true;
      }
    }
    return false;
  } else {
    return files.includes(file);
  }
}

function handleMainTableFieldChange(columnName: string) {
  if (!tableInfo.value) {
    return;
  }
  if (isBlank(columnName)) {
    baseFormApi.setValues({ mainTableProperty: '' });
  }
  for (let i = 0; i < tableInfo.value.fields.length; i++) {
    if (columnName === tableInfo.value.fields[i]?.columnName) {
      baseFormApi.setValues({
        mainTableProperty: tableInfo.value.fields[i]?.propertyName,
      });
    }
  }
}

async function handleStepNext() {
  try {
    const { valid } = await baseFormApi.validate();
    if (!valid) {
      return;
    }

    const values = (await baseFormApi.getValues()) as BasicsConfigModel;
    emit('updateConfig', 'tableInfo', unref(tableInfo));
    emit('updateConfig', 'basicsConfig', { ...values });
    emit('next');
  } catch (error) {
    console.error(error);
  }
}
</script>

<template>
  <div class="basics-config">
    <BaseForm>
      <template #generatorTemplate="slotProps">
        <ChoseButtonGroup v-bind="slotProps" />
      </template>
      <template #listGeneratorTemplate="slotProps">
        <ChoseButtonGroup v-bind="slotProps" />
      </template>
      <template #formGeneratorTemplate="slotProps">
        <ChoseButtonGroup v-bind="slotProps" />
      </template>
      <template #backEndPath="slotProps">
        <Input v-bind="slotProps">
          <template #addonBefore>
            <Select
              v-model:value="moduleValue"
              :options="modules"
              style="width: 260px"
              @change="handleModuleChange"
            />
          </template>
        </Input>
      </template>

      <template #mainTableField="slotProps">
        <Select
          v-if="tableInfo"
          v-bind="slotProps"
          :options="
            tableInfo.fields.map((item) => ({
              label: `${item.columnName} - ${item.comment}`,
              value: item.columnName,
            }))
          "
          class="w-full"
        />
      </template>
    </BaseForm>

    <Divider orientation="left">说明</Divider>
    <div class="mb-6">
      <p>
        1、建议在 字典管理 中设置好业务表的字典类型，便于后续生成代码时使用。
      </p>
    </div>

    <Affix :offset-bottom="0">
      <div class="footer-button bg-background">
        <Button type="primary" @click="handleStepNext">
          <template #icon>
            <LucideArrowRight />
          </template>
          下一步
        </Button>
      </div>
    </Affix>
  </div>
</template>

<style scoped></style>
