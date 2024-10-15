<script lang="ts" setup>
import type { TreeNode } from '#/api/base/model/treeModel';
import type { SysConfig } from '#/api/sys/model/sysConfigModel';

import { ref } from 'vue';

import { useVbenDrawer, z } from '@vben/common-ui';
import { listToTree } from '@vben/utils';

import { Space } from 'ant-design-vue';

import { useVbenForm } from '#/adapter';
import { saveApi, selectAllApi } from '#/api/auth/sysPermission';
import { ButtonClose, ButtonSave } from '#/components/button';
import { MenuTypeEnum } from '#/views/auth/permission/data';

const emit = defineEmits(['success']);

const saveBtnLoading = ref(false);

const [BaseForm, baseFormApi] = useVbenForm({
  showDefaultActions: false,
  schema: [
    { fieldName: 'id', component: 'Input', formItemClass: 'hidden' },
    { fieldName: 'version', component: 'Input', formItemClass: 'hidden' },
    {
      fieldName: 'type',
      label: '类型',
      component: 'DictRadio',
      componentProps: {
        dictType: 'permissionType',
      },
      required: true,
    },
    {
      fieldName: 'parentId',
      label: '上级菜单',
      component: 'ApiTreeSelect',
      componentProps: {
        api: selectAllApi,
        afterFetch: (res) => {
          const treeNodes: TreeNode[] = [] as TreeNode[];
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
    },
    {
      fieldName: 'title',
      label: '标题',
      component: 'Input',
      required: true,
      rules: z
        .string()
        .min(1, { message: '请输入标题' })
        .max(32, { message: '标题不能超过32个字符' }),
    },
    {
      fieldName: 'code',
      label: '权限标识',
      component: 'Input',
      rules: z
        .string()
        .max(64, { message: '权限标识不能超过64个字符' })
        .optional(),
      dependencies: {
        triggerFields: ['externalLink'],
        show(values) {
          return values.externalLink !== '1';
        },
      },
      description: 'Controller中定义的权限标识',
    },
    {
      fieldName: 'icon',
      label: '图标',
      component: 'Input',
      dependencies: {
        triggerFields: ['type'],
        show(values) {
          return values.type !== MenuTypeEnum.BUTTON;
        },
      },
      description: 'https://icones.netlify.app 查找图标',
    },
    {
      fieldName: 'path',
      label: 'Path',
      component: 'Input',
      rules: z
        .string()
        .max(255, { message: 'Path不能超过255个字符' })
        .optional(),
      dependencies: {
        triggerFields: ['type'],
        show(values) {
          return values.type === MenuTypeEnum.MENU;
        },
      },
      description: '页面访问地址',
    },
    {
      fieldName: 'component',
      label: '组件路径',
      component: 'Input',
      componentProps: {
        prefix: '/views',
        suffix: '.vue',
      },
      rules: z
        .string()
        .max(255, { message: '组件路径不能超过255个字符' })
        .optional(),
      dependencies: {
        triggerFields: ['type', 'externalLink'],
        show(values) {
          return (
            values.type === MenuTypeEnum.MENU && values.externalLink !== '1'
          );
        },
      },
    },
    {
      fieldName: 'name',
      label: '组件Name',
      component: 'Input',
      rules: z
        .string()
        .min(1, { message: '请输入组件Name' })
        .max(64, { message: '组件Name不能超过64个字符' })
        .optional(),
      dependencies: {
        triggerFields: ['type', 'externalLink'],
        show(values) {
          return (
            values.type === MenuTypeEnum.MENU && values.externalLink === '1'
          );
        },
      },
      description: '如不填写将根据组件路径转为首字母大写驼峰规则自动生成',
    },
    {
      fieldName: 'orderNo',
      label: '排序值',
      component: 'InputNumber',
      required: true,
      rules: z
        .number()
        .min(0, { message: '排序值不能小于0' })
        .max(999, { message: '排序值不能大于999' }),
      description: '按升序排列，数字越小越靠前',
    },
    {
      fieldName: 'showInMenu',
      label: '在菜单中显示',
      required: true,
      component: 'DictRadio',
      componentProps: {
        dictType: 'whether',
      },
      dependencies: {
        triggerFields: ['type'],
        show(values) {
          return values.type !== MenuTypeEnum.BUTTON;
        },
      },
    },
    {
      fieldName: 'externalLink',
      label: '外部链接',
      required: true,
      component: 'DictRadio',
      componentProps: {
        dictType: 'whether',
      },
      dependencies: {
        triggerFields: ['type'],
        show(values) {
          return values.type === MenuTypeEnum.MENU;
        },
      },
      description: '外部链接菜单点击将打开Path中设置的地址',
    },
    {
      fieldName: 'openMode',
      label: '打开方式',
      required: true,
      component: 'DictRadio',
      componentProps: {
        dictType: 'openMode',
      },
      dependencies: {
        triggerFields: ['type', 'externalLink'],
        show(values) {
          return (
            values.type === MenuTypeEnum.MENU && values.externalLink === '1'
          );
        },
      },
    },
    {
      fieldName: 'status',
      label: '状态',
      required: true,
      component: 'DictRadio',
      componentProps: {
        dictType: 'commonStatus',
      },
    },
    {
      fieldName: 'remarks',
      label: '备注',
      component: 'Textarea',
      componentProps: {
        autoSize: {
          minRows: 2,
          maxRows: 7,
        },
      },
      rules: z
        .string()
        .max(900, { message: '备注最多输入900个字符' })
        .optional(),
    },
  ],
});

async function handleSubmit(callback: (res: SysConfig) => any) {
  try {
    saveBtnLoading.value = true;
    const { valid } = await baseFormApi.validate();
    if (!valid) {
      return;
    }
    const res = await saveApi(await baseFormApi.getValues());
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
  await handleSubmit((res) => {
    baseFormApi.resetForm();
    const { category, type, sys } = res;
    baseFormApi.setValues({ category, type, sys });
  });
}

const [Drawer, drawerApi] = useVbenDrawer({
  onOpenChange: async (isOpen: boolean) => {
    if (isOpen) {
      const data = drawerApi.getData<Record<string, any>>();
      await baseFormApi.setValues(data);
    }
  },
});
</script>
<template>
  <Drawer class="w-[600px]" title="菜单信息">
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
