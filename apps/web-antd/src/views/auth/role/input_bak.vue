<script lang="ts" setup>
import type { TreeDataItem } from 'ant-design-vue/es/tree/Tree';

import type { Recordable } from '@vben/types';

import type { SysRoleVO } from '#/api/auth/model/sys-role-model';

import { ref } from 'vue';

import { useAccess } from '@vben/access';
import { useVbenDrawer, VbenScrollbar, VbenTree, z } from '@vben/common-ui';
import { clearTreeEmptyChildren, listToTree } from '@vben/utils';

import { message, Space } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { selectAllApi as selectAllDeptApi } from '#/api/auth/sys-dept';
import { selectAllApi as selectAllMenuApi } from '#/api/auth/sys-menu';
import { addApi, saveApi } from '#/api/auth/sys-role';
import { ButtonClose, ButtonSave } from '#/components/button';
import { RoleEnum } from '#/enums/roleEnum';

const emit = defineEmits(['success']);

const saveBtnLoading = ref(false);

const { hasAccessByRoles } = useAccess();

const menuTreeData = ref<TreeDataItem[]>([]);
const deptTreeData = ref<TreeDataItem[]>([]);

function initData() {
  selectAllMenuApi().then((res) => {
    menuTreeData.value = clearTreeEmptyChildren(listToTree(res), 'children');
  });

  selectAllDeptApi().then((res) => {
    deptTreeData.value = clearTreeEmptyChildren(listToTree(res), 'children');
  });
}

initData();

const [BaseForm, baseFormApi] = useVbenForm({
  showDefaultActions: false,
  commonConfig: {
    labelWidth: 120,
  },
  schema: [
    { fieldName: 'id', component: 'Input', formItemClass: 'hidden' },
    { fieldName: 'version', component: 'Input', formItemClass: 'hidden' },
    {
      fieldName: 'name',
      label: '名称',
      component: 'Input',
      rules: z
        .string()
        .min(1, { message: '请输入名称' })
        .max(32, { message: '名称最多输入32个字符' }),
    },
    {
      fieldName: 'code',
      label: '标识',
      component: 'Input',
      rules: z
        .string()
        .min(1, { message: '请输入标识' })
        .max(64, { message: '标识最多输入32个字符' }),
      description:
        '建议使用字母与:组合，一般用于业务逻辑判断，例如：sys:admin、project:manager',
    },
    {
      fieldName: 'orderNo',
      label: '排序值',
      component: 'InputNumber',
      rules: z
        .number()
        .min(0, { message: '排序值不能小于0' })
        .max(999, { message: '排序值不能大于999' }),
      description: '按升序排列，数字越小越靠前',
    },
    {
      label: '菜单',
      fieldName: 'menuIds',
      component: 'Input',
    },
    {
      label: '数据权限',
      fieldName: 'dataPermission',
      component: 'DictRadio',
      componentProps: {
        dictType: 'dataPermission',
      },
      rules: 'required',
    },
    {
      label: '自定义数据权限',
      fieldName: 'dataPermissionDeptIds',
      component: 'Input',
      dependencies: {
        triggerFields: ['dataPermission'],
        show(values) {
          return values.dataPermission === 'custom';
        },
      },
      description: '请选择当前角色可以访问的部门数据',
    },
    {
      fieldName: 'sys',
      label: '是否系统',
      rules: 'selectRequired',
      component: 'DictRadio',
      componentProps: {
        dictType: 'whether',
      },
      ifShow: () => {
        return hasAccessByRoles([RoleEnum.SYS_ADMIN]);
      },
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'DictRadio',
      componentProps: {
        dictType: 'commonStatus',
      },
      rules: 'selectRequired',
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

async function handleSubmit(callback: (res: SysRoleVO) => any) {
  try {
    saveBtnLoading.value = true;
    const { valid } = await baseFormApi.validate();
    if (!valid) {
      return;
    }
    const values: SysRoleVO = { ...(await baseFormApi.getValues()) };
    const res = await saveApi(values);
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
    addApi().then((res) => {
      baseFormApi.setValues(res);
    });
  });
}

function getNodeClass(node: Recordable<any>) {
  const classes: string[] = [];
  if (node.value?.type === 'button') {
    classes.push('inline-flex');
    if (node.index % 3 >= 1) {
      classes.push('!pl-0');
    }
  }

  return classes.join(' ');
}

const [Drawer, drawerApi] = useVbenDrawer({
  onOpenChange: async (isOpen: boolean) => {
    if (isOpen) {
      // 打开时根据id获取详情
      const data = drawerApi.getData<Record<string, any>>();
      await baseFormApi.setValues(data);
    }
  },
});
</script>
<template>
  <Drawer class="w-[600px]" title="角色信息">
    <BaseForm>
      <template #menuIds="slotProps">
        <div class="relative max-h-[320px] flex-1 overflow-y-auto">
          <VbenScrollbar shadow shadow-border>
            <VbenTree
              :tree-data="menuTreeData"
              multiple
              v-bind="slotProps"
              :get-node-class="getNodeClass"
              value-field="id"
              label-field="title"
              icon-field="icon"
            />
          </VbenScrollbar>
        </div>
      </template>

      <template #dataPermissionDeptIds="slotProps">
        <div class="relative max-h-[320px] flex-1 overflow-y-auto">
          <VbenScrollbar shadow shadow-border>
            <VbenTree
              :tree-data="deptTreeData"
              multiple
              v-bind="slotProps"
              value-field="id"
              label-field="title"
              icon-field="icon"
            />
          </VbenScrollbar>
        </div>
      </template>
    </BaseForm>

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
