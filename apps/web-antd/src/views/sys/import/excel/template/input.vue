<script lang="ts" setup>
import type { SelectModel, SysImportExcelTemplate } from '#/api';

import { ref } from 'vue';

import { useVbenDrawer, z } from '@vben/common-ui';

import { message, Space } from 'ant-design-vue';
import { cloneDeep } from 'lodash-es';

import { useVbenForm } from '#/adapter/form';
import { saveSysImportExcelTemplateApi, selectTableApi } from '#/api';
import { ButtonClose, ButtonSave } from '#/components/button';

const emit = defineEmits(['success']);

const saveBtnLoading = ref(false);

let tableArray: SelectModel[] = [];

const [BaseForm, baseFormApi] = useVbenForm({
  showDefaultActions: false,
  schema: [
    { fieldName: 'id', component: 'Input', formItemClass: 'hidden' },
    { fieldName: 'version', component: 'Input', formItemClass: 'hidden' },
    {
      fieldName: 'importTable',
      label: '表',
      required: true,
      component: 'ApiSelect',
      componentProps: {
        api: selectTableApi,
        params: {
          dataSource: 'master',
        },
        afterFetch: (result) => {
          tableArray = cloneDeep(result);
          result.forEach((item) => {
            item.label = `${item.value} - ${item.label}`;
          });
          return result;
        },
        onChange: (value) => {
          handleTableChange(value);
        },
      },
      rules: 'selectRequired',
      description: '需要导入数据的表',
    },
    {
      fieldName: 'name',
      label: '模板名称',
      component: 'Input',
      rules: z
        .string()
        .min(1, { message: '请输入模板名称' })
        .max(64, { message: '模板名称最多输入64个字符' }),
    },
    {
      fieldName: 'startRow',
      label: '起始行',
      component: 'InputNumber',
      rules: z
        .number()
        .min(0, { message: '起始行不能小于0' })
        .max(99, { message: '起始行不能大于99' }),
      description: '系统将从“起始行”开始读取Excel数据',
    },
    {
      fieldName: 'callback',
      label: '回调Bean',
      component: 'Input',
      rules: z
        .string()
        .min(1, { message: '请输入回调Bean' })
        .max(255, { message: '回调Bean最多输入255个字符' }),
      description: 'Bean需要实现com.easy.admin.sys.service.ImportService接口',
    },
    {
      fieldName: 'importCode',
      label: '模板代码',
      component: 'Input',
      rules: z
        .string()
        .min(1, { message: '请输入模板代码' })
        .max(64, { message: '模板代码最多输入255个字符' }),
      description: '导入模板唯一标识',
    },
    {
      fieldName: 'permissionCode',
      label: '权限标识',
      component: 'Input',
      rules: z
        .string()
        .min(1, { message: '请输入权限标识' })
        .max(64, { message: '权限标识最多输入255个字符' })
        .optional(),
      description: '用于检查登录用户是否有权限使用此模板',
    },
  ],
});

function handleTableChange(table: string) {
  const tableInfo = tableArray.filter((item) => item.value === table);
  if (tableInfo && tableInfo.length > 0) {
    table = table.toLowerCase();
    const importCode = table.replaceAll('_', ':');

    baseFormApi.setValues({
      importCode,
      name: tableInfo && tableInfo.length > 0 ? tableInfo[0].label : '',
      callback: `${underlineToHump(table)}ServiceImpl`,
      permissionCode: `${importCode}:import:data`,
    });
  }
}

/**
 * 下换下转驼峰
 *
 * @param tableName {string} 表名
 * @return {string} 驼峰命名
 */
function underlineToHump(tableName: string) {
  const temp = tableName.split('_');
  let modelName;
  if (temp.length === 1) {
    modelName = tableName;
  } else {
    modelName = '';
    temp.forEach((item, index) => {
      modelName +=
        index === 0
          ? item
          : item.slice(0, 1).toLocaleUpperCase() + item.slice(1);
    });
  }
  return modelName;
}

async function handleSubmit(callback: (res: SysImportExcelTemplate) => any) {
  try {
    saveBtnLoading.value = true;
    const { valid } = await baseFormApi.validate();
    if (!valid) {
      return;
    }
    const values = await baseFormApi.getValues();
    const res = await saveSysImportExcelTemplateApi(values);
    message.success('保存成功');
    emit('success');
    callback(res);
  } catch (error) {
    console.error('保存失败', error);
  } finally {
    saveBtnLoading.value = false;
  }
}

async function handleSave() {
  await handleSubmit(() => {
    drawerApi.close();
  });
}

async function handleSaveAndAdd() {
  await handleSubmit(() => {
    baseFormApi.resetForm();
    baseFormApi.setValues({ startRow: 2 });
  });
}

const [Drawer, drawerApi] = useVbenDrawer({
  onOpenChange: async (isOpen: boolean) => {
    if (isOpen) {
      // 打开时根据id获取详情
      const data = drawerApi.getData<Record<string, any>>();
      await baseFormApi.resetForm();
      await baseFormApi.setValues(data);
    }
  },
});
</script>
<template>
  <Drawer class="w-[600px]" title="导入模版信息">
    <BaseForm />

    <template #footer>
      <Space>
        <ButtonClose @click="drawerApi.close()" />
        <ButtonSave :loading="saveBtnLoading" @click="handleSave" />
        <ButtonSave
          :loading="saveBtnLoading"
          text="保存并新增"
          @click="handleSaveAndAdd"
        />
      </Space>
    </template>
  </Drawer>
</template>
