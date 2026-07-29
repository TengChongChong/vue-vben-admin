<script lang="ts" setup>
import type { TreeDataNode as TreeDataItem } from 'antdv-next';

import type { SysTenantPackage } from '#/api';

import { ref, unref } from 'vue';

import { useVbenDrawer, z } from '@vben/common-ui';
import { convertCheckedKeys, listToTree } from '@vben/utils';

import { message, Modal, Space } from 'antdv-next';
import { isArray, isEqual, sortBy } from 'lodash-es';

import { useVbenForm } from '#/adapter/form';
import { saveSysTenantPackageApi, selectAllSysMenuApi } from '#/api';
import { ButtonClose, ButtonSave } from '#/components/button';
import { BasicTree } from '#/components/tree';

const emit = defineEmits(['success', 'syncPrompt']);

const saveBtnLoading = ref(false);
const menuTreeData = ref<TreeDataItem[]>([]);
const initialMenuIds = ref<string[]>([]);

function normalizeMenuIds(menuIds: unknown) {
  if (!menuIds) {
    return [];
  }
  if (isArray(menuIds)) {
    return menuIds;
  }
  const { checked, halfChecked } = menuIds as {
    checked: string[];
    halfChecked: string[];
  };
  return [...checked, ...halfChecked];
}

async function loadMenuTree() {
  try {
    const menuList = await selectAllSysMenuApi();
    menuTreeData.value = listToTree(menuList);
  } catch {
    message.error('加载菜单数据失败，请稍后重试');
  }
}

const [BaseForm, baseFormApi] = useVbenForm({
  showDefaultActions: false,
  schema: [
    { fieldName: 'id', component: 'Input', formItemClass: 'hidden' },
    { fieldName: 'version', component: 'Input', formItemClass: 'hidden' },
    {
      fieldName: 'code',
      label: '套餐编码',
      component: 'Input',
      rules: z
        .string()
        .min(2, { message: '套餐编码至少2个字符' })
        .max(64, { message: '套餐编码最多64个字符' })
        .regex(/^[a-z][a-z0-9_-]*$/, {
          message: '需以小写字母开头，仅含小写字母、数字、下划线或中划线',
        }),
      description: '创建后不建议修改',
    },
    {
      fieldName: 'name',
      label: '套餐名称',
      component: 'Input',
      rules: z
        .string()
        .min(1, { message: '请输入套餐名称' })
        .max(128, { message: '套餐名称最多128个字符' }),
    },
    {
      fieldName: 'maxUserCount',
      label: '默认用户数上限',
      component: 'InputNumber',
      componentProps: {
        min: 0,
        class: 'w-full',
        placeholder: '0 或留空表示不限制',
      },
      description: '新建租户时默认复制此值，租户可单独覆盖',
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'DictRadio',
      componentProps: {
        dictType: 'commonStatus',
      },
      defaultValue: '1',
      rules: 'selectRequired',
    },
    {
      fieldName: 'menuIds',
      label: '菜单权限',
      component: 'Input',
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

async function handleSubmit(
  callback: (res: SysTenantPackage, menuChanged?: boolean) => any,
) {
  try {
    saveBtnLoading.value = true;
    const { valid } = await baseFormApi.validate();
    if (!valid) {
      return;
    }
    drawerApi.lock();
    const values: SysTenantPackage = { ...(await baseFormApi.getValues()) };
    values.menuIds = normalizeMenuIds(values.menuIds);
    if (values.maxUserCount === 0) {
      values.maxUserCount = undefined;
    }
    const menuChanged =
      !!values.id &&
      !isEqual(sortBy(initialMenuIds.value), sortBy(values.menuIds ?? []));
    const res = await saveSysTenantPackageApi(values);
    message.success('保存成功');
    emit('success');
    await callback(res, menuChanged);
    drawerApi.unlock();
  } catch {
    drawerApi.unlock();
    message.error('保存失败，请稍后重试');
  } finally {
    saveBtnLoading.value = false;
  }
}

async function handleSave() {
  await handleSubmit((res, menuChanged) => {
    drawerApi.close();
    if (menuChanged && res.id) {
      Modal.confirm({
        title: '是否同步到已绑定租户？',
        content: '套餐菜单已变更，可将最新菜单同步到已绑定租户的角色权限。',
        okText: '立即同步',
        cancelText: '稍后处理',
        onOk: () => {
          emit('syncPrompt', {
            id: res.id,
            menuChanged: true,
            name: res.name,
          });
        },
      });
    }
  });
}

async function handleSaveAndAdd() {
  await handleSubmit((res, menuChanged) => {
    baseFormApi.resetForm();
    baseFormApi.setValues({ status: '1' });
    initialMenuIds.value = [];
    if (menuChanged && res.id) {
      Modal.confirm({
        title: '是否同步到已绑定租户？',
        content: '套餐菜单已变更，可将最新菜单同步到已绑定租户的角色权限。',
        okText: '立即同步',
        cancelText: '稍后处理',
        onOk: () => {
          emit('syncPrompt', {
            id: res.id,
            menuChanged: true,
            name: res.name,
          });
        },
      });
    }
  });
}

const [Drawer, drawerApi] = useVbenDrawer({
  onOpenChange: async (isOpen: boolean) => {
    if (isOpen) {
      await loadMenuTree();
      const data = drawerApi.getData<Record<string, any>>();
      await baseFormApi.resetForm();
      await baseFormApi.setValues({
        status: '1',
        ...data,
        menuIds: convertCheckedKeys(unref(menuTreeData), data.menuIds ?? []),
      });
      initialMenuIds.value = normalizeMenuIds(data.menuIds ?? []);
      if (data.id) {
        baseFormApi.updateSchema([
          {
            fieldName: 'code',
            componentProps: { disabled: true },
          },
        ]);
      } else {
        baseFormApi.updateSchema([
          {
            fieldName: 'code',
            componentProps: { disabled: false },
          },
        ]);
      }
    } else {
      menuTreeData.value = [];
    }
  },
});
</script>
<template>
  <Drawer class="w-[680px]" title="租户套餐">
    <BaseForm>
      <template #menuIds="slotProps">
        <BasicTree
          :show-search="true"
          :show-toolbar="true"
          :tree-data="menuTreeData"
          checkable
          size="small"
          title="请勾选菜单与按钮权限"
          v-bind="slotProps" />
      </template>
    </BaseForm>

    <template #footer>
      <Space>
        <ButtonClose @click="drawerApi.close()" />
        <ButtonSave :loading="saveBtnLoading" @click="handleSave" />
        <ButtonSave
          :loading="saveBtnLoading"
          text="保存并新增"
          @click="handleSaveAndAdd" />
      </Space>
    </template>
  </Drawer>
</template>
