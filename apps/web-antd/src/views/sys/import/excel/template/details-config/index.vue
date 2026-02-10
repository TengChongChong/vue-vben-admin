<script lang="ts" setup>
import type {
  SelectModel,
  SysImportExcelTemplate,
  SysImportExcelTemplateDetail,
  TableInfo,
} from '#/api';

import { ref, unref } from 'vue';

import { useVbenDrawer, useVbenModal } from '@vben/common-ui';

import {
  Button,
  Checkbox,
  Descriptions,
  DescriptionsItem,
  Input,
  message,
  Popover,
  Select,
  Space,
  Table,
  TypographyLink,
} from 'ant-design-vue';

import {
  getTableInfoApi,
  saveDataApi,
  selectAllSysDictTypeApi,
  selectDetailsApi,
  selectTableApi,
} from '#/api';
import { ButtonClose, ButtonSave } from '#/components/button';
import { LucideSave } from '#/components/icons';
import { getDictType, toDictTypeArray } from '#/views/generator/util/util';
import TableFieldSelect from '#/views/sys/import/excel/template/components/table-field-select.vue';

import OrderModal from './order-modal.vue';

const saveBtnLoading = ref(false);

const sysImportExcelTemplate = ref<SysImportExcelTemplate>({});
const sysImportExcelTemplateDetailList = ref<SysImportExcelTemplateDetail[]>(
  [],
);
const tableArray = ref<SelectModel[]>([]);
const dictTypeArray = ref<SelectModel[]>([]);
let tableInfo: TableInfo = null;
let isLoad = false;

const columns = [
  {
    dataIndex: 'needImport',
    title: '导入',
    width: 50,
    align: 'center',
  },
  {
    title: '字段',
    children: [
      {
        dataIndex: 'fieldName',
        title: '列名',
        width: 150,
      },
      {
        dataIndex: 'title',
        title: '标题',
        width: 140,
      },
    ],
  },
  {
    title: '字段转换',
    children: [
      {
        dataIndex: 'replaceTable',
        title: '替换表',
        width: 160,
      },
      {
        dataIndex: 'replaceTableDictType',
        title: '字典类别',
        width: 200,
      },
      {
        dataIndex: 'replaceTableFieldName',
        title: '导入值',
        width: 160,
      },
      {
        dataIndex: 'replaceTableFieldValue',
        title: '替换值',
        width: 160,
      },
    ],
  },
  {
    dataIndex: 'dataRequired',
    title: '必填',
    width: 50,
    align: 'center',
  },
  {
    dataIndex: 'dataOnly',
    title: '唯一',
    width: 50,
    align: 'center',
  },
];

const [BaseOrderModal, baseOrderModalApi] = useVbenModal({
  connectedComponent: OrderModal,
});

async function loadInfo(data) {
  isLoad = false;
  sysImportExcelTemplate.value = data;
  sysImportExcelTemplateDetailList.value = [];
  await initCommonData();
  drawerApi.setLoading(true);
  await loadData(data);
  drawerApi.setLoading(false);
}

/**
 * 加载公共参数
 */
async function initCommonData() {
  if (isLoad) {
    return;
  }
  isLoad = true;
  await selectTableApi({ dataSource: 'master' }).then((res) => {
    res.forEach((item) => {
      item.label = `${item.value} - ${item.label}`;
    });
    tableArray.value = res;
  });

  dictTypeArray.value = await selectAllSysDictTypeApi();
  tableInfo = await getTableInfoApi(
    'master',
    sysImportExcelTemplate.value.importTable!,
  );
}

/**
 * 加载数据
 *
 * @param data
 */
async function loadData(data) {
  // 字典类型 array
  const dictTypeList = toDictTypeArray(unref(dictTypeArray));
  const setDetailList = await selectDetailsApi(data.id);

  const detailList: SysImportExcelTemplateDetail[] = [];
  const noSetDetailList: SysImportExcelTemplateDetail[] = [];

  // 已设置
  setDetailList.forEach((item) => {
    detailList.push({
      needImport: true,
      ...item,
    });
  });

  // 未设置
  tableInfo?.fields.forEach((item) => {
    const { name, propertyType, comment, metaInfo } = item;

    if (!inSet(setDetailList, name)) {
      const dictType = getDictType(tableInfo!, item, dictTypeList);
      noSetDetailList.push({
        fieldName: name.toLowerCase(),
        title: comment,
        fieldType: metaInfo.typeName.toLowerCase(),
        fieldLength: propertyType === 'String' ? metaInfo.length : undefined,
        needImport: false,
        needReplace: false,
        replaceTable: dictType ? 'sys_dict' : undefined,
        replaceTableDictType: dictType!,
        replaceTableFieldName: dictType ? 'name' : undefined,
        replaceTableFieldValue: dictType ? 'code' : undefined,
        dataRequired: false,
        dataOnly: false,
      });
    }
  });
  sysImportExcelTemplateDetailList.value = [...detailList, ...noSetDetailList];
}

function updateDetailList(detailList) {
  const noSetList = sysImportExcelTemplateDetailList.value.filter(
    (item) => !item.needImport,
  );
  sysImportExcelTemplateDetailList.value = [...detailList, ...noSetList];
}

function handleOrderField() {
  baseOrderModalApi.setData(
    sysImportExcelTemplateDetailList.value.filter((item) => item.needImport),
  );
  baseOrderModalApi.open();
}

function handleChangeReplaceTable(record) {
  if (record.replaceTable?.toLowerCase() === 'sys_dict') {
    record.replaceTableFieldName = 'name';
    record.replaceTableFieldValue = 'code';
  } else if (record.replaceTable?.toLowerCase() === 'sys_dept') {
    record.replaceTableFieldName = 'name';
    record.replaceTableFieldValue = 'id';
  } else {
    record.replaceTableFieldValue = 'id';
    record.replaceTableFieldName = null;
  }
}

/**
 * 是否已设置
 *
 * @param setDetailList
 * @param name
 * @return true/false
 */
function inSet(
  setDetailList: SysImportExcelTemplateDetail[],
  name: string,
): boolean {
  for (const element of setDetailList) {
    if (element.fieldName === name) {
      return true;
    }
  }
  return false;
}

async function handleSave() {
  try {
    saveBtnLoading.value = true;
    const list = sysImportExcelTemplateDetailList.value.filter(
      (item) => item.needImport,
    );
    await saveDataApi(sysImportExcelTemplate.value.id!, list);
    message.success('保存成功');
    drawerApi.close();
  } catch (error) {
    console.error('保存失败', error);
  } finally {
    saveBtnLoading.value = false;
  }
}

const [Drawer, drawerApi] = useVbenDrawer({
  onOpenChange: async (isOpen: boolean) => {
    if (isOpen) {
      // 打开时根据id获取详情
      const data = drawerApi.getData<Record<string, any>>();
      await loadInfo(data);
    }
  },
});
</script>
<template>
  <Drawer class="w-[1200px]" title="导入模版信息">
    <Descriptions bordered class="mb-4">
      <DescriptionsItem label="模版名称">
        {{ sysImportExcelTemplate.name }}
      </DescriptionsItem>
      <DescriptionsItem label="模版代码">
        {{ sysImportExcelTemplate.importCode }}
      </DescriptionsItem>
      <DescriptionsItem label="表">
        {{ sysImportExcelTemplate.importTable }}
      </DescriptionsItem>
    </Descriptions>
    <Table
      :columns="columns"
      :data-source="sysImportExcelTemplateDetailList"
      :pagination="false"
      bordered
      size="small"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'needImport'">
          <Checkbox v-model:checked="record.needImport" />
        </template>
        <template v-if="column.dataIndex === 'fieldName'">
          <Popover>
            <template #content>
              <div>
                类型：{{ record.fieldType }}
                {{ record.fieldLength ? `(${record.fieldLength})` : '' }}
              </div>
            </template>
            <TypographyLink>{{ record.fieldName }}</TypographyLink>
          </Popover>
        </template>
        <template v-if="column.dataIndex === 'title'">
          <Input v-model:value="record.title" :disabled="!record.needImport" />
        </template>
        <template v-if="column.dataIndex === 'replaceTable'">
          <Select
            v-model:value="record.replaceTable"
            :allow-clear="true"
            :disabled="!record.needImport"
            :options="tableArray"
            option-filter-prop="label"
            show-search
            style="width: 200px"
            @change="handleChangeReplaceTable(record)"
          />
        </template>
        <template v-if="column.dataIndex === 'replaceTableDictType'">
          <Select
            v-model:value="record.replaceTableDictType"
            :allow-clear="true"
            :disabled="
              !record.needImport ||
              record.replaceTable?.toLowerCase() !== 'sys_dict'
            "
            :options="dictTypeArray"
            option-filter-prop="label"
            show-search
            style="width: 200px"
          />
        </template>
        <template v-if="column.dataIndex === 'replaceTableFieldName'">
          <TableFieldSelect
            v-model="record.replaceTableFieldName"
            :allow-clear="true"
            :disabled="!record.needImport || !record.replaceTable"
            :table="record.replaceTable"
          />
        </template>
        <template v-if="column.dataIndex === 'replaceTableFieldValue'">
          <TableFieldSelect
            v-model="record.replaceTableFieldValue"
            :allow-clear="true"
            :disabled="!record.needImport || !record.replaceTable"
            :table="record.replaceTable"
          />
        </template>
        <template v-if="column.dataIndex === 'dataRequired'">
          <Checkbox
            v-model:checked="record.dataRequired"
            :disabled="!record.needImport"
          />
        </template>
        <template v-if="column.dataIndex === 'dataOnly'">
          <Checkbox
            v-model:checked="record.dataOnly"
            :disabled="!record.needImport"
          />
        </template>
      </template>
    </Table>

    <template #footer>
      <Space>
        <ButtonClose @click="drawerApi.close()" />
        <Button @click="handleOrderField">
          <template #icon>
            <LucideSave />
          </template>
          排序
        </Button>
        <ButtonSave :loading="saveBtnLoading" @click="handleSave" />
      </Space>
    </template>

    <BaseOrderModal @success="updateDetailList" />
  </Drawer>
</template>
