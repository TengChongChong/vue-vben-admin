<script lang="ts" setup>
import type { SysMenu, TreeNode } from '#/api';

import { ref } from 'vue';

import { useVbenDrawer, z } from '@vben/common-ui';
import { listToTree } from '@vben/utils';

import { Space, TypographyText } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { addSysMenuApi, saveSysMenuApi, selectAllSysMenuApi } from '#/api';
import { ButtonClose, ButtonSave } from '#/components/button';
import { Divider } from '#/components/divider';
import { componentKeys } from '#/router/routes';

const emit = defineEmits(['success']);

const saveBtnLoading = ref(false);
const [BaseForm, baseFormApi] = useVbenForm({
  showDefaultActions: false,
  schema: [
    {
      component: 'Divider',
      componentProps: { text: '基础信息', showHr: false },
      dependencies: {
        show: (values) => {
          return !['button', 'link'].includes(values.type);
        },
        triggerFields: ['type'],
      },
      fieldName: 'baseConfig',
      formItemClass: 'col-span-6',
      hideLabel: true,
    },
    { fieldName: 'id', component: 'Input', formItemClass: 'hidden' },
    { fieldName: 'version', component: 'Input', formItemClass: 'hidden' },
    {
      fieldName: 'type',
      label: '类型',
      component: 'DictRadio',
      componentProps: {
        dictType: 'menuType',
      },
      rules: 'selectRequired',
      formItemClass: 'col-span-3',
    },
    {
      fieldName: 'parentId',
      label: '上级菜单',
      component: 'ApiTreeSelect',
      componentProps: {
        api: selectAllSysMenuApi,
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
      formItemClass: 'col-span-3',
    },
    {
      fieldName: 'title',
      label: '标题',
      component: 'Input',
      rules: z
        .string()
        .min(1, { message: '请输入标题' })
        .max(32, { message: '标题最多输入32个字符' }),
      formItemClass: 'col-span-3',
    },
    {
      fieldName: 'path',
      label: '路由地址',
      component: 'Input',
      dependencies: {
        show: (values) => {
          return ['catalog', 'embedded', 'menu'].includes(values.type);
        },
        triggerFields: ['type'],
      },
      rules: z
        .string()
        .min(2, { message: '路由地址最少输入2个字符' })
        .max(255, { message: '路由地址最多输入255个字符' })
        .refine((value: string) => {
          return value.startsWith('/');
        }, '路由地址必须以/开头'),
      // .refine(
      //   async (value: string) => {
      //     return !(await isMenuPathExists(value, formData.value?.id));
      //   },
      //   (value) => ({
      //     message: $t('ui.formRules.alreadyExists', [
      //       $t('system.menu.path'),
      //       value,
      //     ]),
      //   }),
      // ),
      formItemClass: 'col-span-3',
    },
    {
      fieldName: 'activePath',
      label: '激活路径',
      component: 'Input',
      dependencies: {
        show: (values) => {
          return ['embedded', 'menu'].includes(values.type);
        },
        triggerFields: ['type'],
      },
      rules: z
        .string()
        .max(255, { message: '激活路径最多输入255个字符' })
        .refine((value: string) => {
          return value.startsWith('/');
        }, '激活路径必须以/开头')
        // .refine(async (value: string) => {
        //   return await isMenuPathExists(value, formData.value?.id);
        // }, $t('system.menu.activePathMustExist'))
        .optional(),
      description:
        '跳转到当前路由时，需要激活的菜单路径。 当不在导航菜单中显示时，需要指定激活路径',
      formItemClass: 'col-span-3',
    },
    {
      fieldName: 'icon',
      label: '图标',
      component: 'IconPicker',
      dependencies: {
        show: (values) => {
          return ['catalog', 'embedded', 'link', 'menu'].includes(values.type);
        },
        triggerFields: ['type'],
      },
      formItemClass: 'col-span-3',
    },
    {
      fieldName: 'activeIcon',
      label: '激活图标',
      component: 'IconPicker',
      componentProps: {},
      dependencies: {
        show: (values) => {
          return ['catalog', 'embedded', 'menu'].includes(values.type);
        },
        triggerFields: ['type'],
      },
      description: '菜单选中时的图标',
      formItemClass: 'col-span-3',
    },
    {
      fieldName: 'component',
      label: '页面组件',
      component: 'AutoComplete',
      componentProps: {
        allowClear: true,
        class: 'w-full',
        filterOption(input: string, option: { value: string }) {
          return option.value.toLowerCase().includes(input.toLowerCase());
        },
        options: componentKeys.map((v) => ({ value: v })),
      },
      dependencies: {
        rules: (values) => {
          return values.type === 'menu' ? 'required' : null;
        },
        show: (values) => {
          return values.type === 'menu';
        },
        triggerFields: ['type'],
      },
      formItemClass: 'col-span-3',
    },
    {
      component: 'Input',
      fieldName: 'name',
      label: '组件Name',
      rules: z
        .string()
        .max(64, { message: '组件Name最多输入64个字符' })
        .optional(),
      dependencies: {
        show: (values) => {
          return ['catalog', 'embedded', 'menu'].includes(values.type);
        },
        triggerFields: ['type'],
      },
      // .refine(
      //   async (value: string) => {
      //     return !(await isMenuNameExists(value, formData.value?.id));
      //   },
      //   (value) => ({
      //     message: $t('ui.formRules.alreadyExists', [
      //       $t('system.menu.menuName'),
      //       value,
      //     ]),
      //   }),
      // ),
      description: '如不填写将根据页面组件自动生成（首字母大写&驼峰）',
      formItemClass: 'col-span-3',
    },
    {
      fieldName: 'linkSrc',
      label: '链接地址',
      component: 'Input',
      dependencies: {
        show: (values) => {
          return ['embedded', 'link'].includes(values.type);
        },
        triggerFields: ['type'],
      },
      rules: z
        .string()
        .url('链接地址无效')
        .max(255, { message: '链接地址最多输入255个字符' }),
      formItemClass: 'col-span-3',
    },
    {
      fieldName: 'authCode',
      label: '权限标识',
      component: 'Input',
      dependencies: {
        show: (values) => {
          return ['button', 'catalog', 'embedded', 'menu'].includes(
            values.type,
          );
        },
        triggerFields: ['type'],
      },
      rules: z
        .string()
        .max(64, { message: '权限标识最多输入64个字符' })
        .optional(),
      formItemClass: 'col-span-3',
    },
    {
      fieldName: 'query',
      label: '路由参数',
      component: 'Input',
      dependencies: {
        show: (values) => {
          return ['menu'].includes(values.type);
        },
        triggerFields: ['type'],
      },
      formItemClass: 'col-span-6',
      description:
        'JSON 格式，将用于 route.meta.query，如：{ "name": "张三", "sex": 1 }',
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'DictRadio',
      componentProps: {
        dictType: 'commonStatus',
      },
      formItemClass: 'col-span-3',
    },
    {
      component: 'Divider',
      componentProps: { text: '徽标设置' },
      dependencies: {
        show: (values) => {
          return values.type !== 'button';
        },
        triggerFields: ['type'],
      },
      fieldName: 'badgeConfig',
      formItemClass: 'col-span-6',
      hideLabel: true,
    },
    {
      fieldName: 'badgeType',
      label: '徽标类型',
      component: 'DictSelect',
      componentProps: {
        dictType: 'badgeType',
      },
      dependencies: {
        show: (values) => {
          return values.type !== 'button';
        },
        triggerFields: ['type'],
      },
      formItemClass: 'col-span-2',
    },
    {
      fieldName: 'badge',
      label: '徽标内容',
      component: 'Input',
      componentProps: (values) => {
        return {
          disabled: values.badgeType !== 'normal',
        };
      },
      dependencies: {
        show: (values) => {
          return values.type !== 'button';
        },
        triggerFields: ['type'],
      },
      formItemClass: 'col-span-2',
    },
    {
      fieldName: 'badgeVariants',
      label: '徽标样式',
      component: 'DictSelect',
      componentProps: {
        dictType: 'tagColor',
      },
      dependencies: {
        show: (values) => {
          return values.type !== 'button';
        },
        triggerFields: ['type'],
      },
      formItemClass: 'col-span-2',
    },
    {
      component: 'Divider',
      componentProps: { text: '其他设置' },
      dependencies: {
        show: (values) => {
          return !['button', 'link'].includes(values.type);
        },
        triggerFields: ['type'],
      },
      fieldName: 'divider1',
      formItemClass: 'col-span-6',
      hideLabel: true,
    },
    {
      component: 'Checkbox',
      dependencies: {
        show: (values) => {
          return ['menu'].includes(values.type);
        },
        triggerFields: ['type'],
      },
      fieldName: 'keepAlive',
      renderComponentContent: () => {
        return {
          default: () => '缓存标签页',
        };
      },
      formItemClass: 'col-span-2',
    },
    {
      component: 'Checkbox',
      dependencies: {
        show: (values) => {
          return ['embedded', 'menu'].includes(values.type);
        },
        triggerFields: ['type'],
      },
      fieldName: 'affixTab',
      renderComponentContent() {
        return {
          default: () => '固定在标签',
        };
      },
      formItemClass: 'col-span-2',
    },
    {
      component: 'Checkbox',
      dependencies: {
        show: (values) => {
          return !['button', 'link'].includes(values.type);
        },
        triggerFields: ['type'],
      },
      fieldName: 'hideInTab',
      renderComponentContent() {
        return {
          default: () => '在标签栏中隐藏',
        };
      },
      formItemClass: 'col-span-2',
    },
    {
      component: 'Checkbox',
      dependencies: {
        show: (values) => {
          return !['button', 'link'].includes(values.type);
        },
        triggerFields: ['type'],
      },
      fieldName: 'hideInMenu',
      renderComponentContent() {
        return {
          default: () => '隐藏菜单',
        };
      },
      formItemClass: 'col-span-2',
    },
    {
      component: 'Checkbox',
      dependencies: {
        show: (values) => {
          return ['catalog', 'menu'].includes(values.type);
        },
        triggerFields: ['type'],
      },
      fieldName: 'hideChildrenInMenu',
      renderComponentContent() {
        return {
          default: () => '隐藏子菜单',
        };
      },
      formItemClass: 'col-span-2',
    },
    {
      component: 'Checkbox',
      dependencies: {
        show: (values) => {
          return !['button', 'link'].includes(values.type);
        },
        triggerFields: ['type'],
      },
      fieldName: 'hideInBreadcrumb',
      renderComponentContent() {
        return {
          default: () => '在面包屑中隐藏',
        };
      },
      formItemClass: 'col-span-2',
    },
  ],
  wrapperClass: 'grid-cols-6',
});

async function handleSubmit(callback: (res: SysMenu) => any) {
  try {
    saveBtnLoading.value = true;
    const { valid } = await baseFormApi.validate();
    if (!valid) {
      return;
    }
    const values: SysMenu = await baseFormApi.getValues();
    const res = await saveSysMenuApi({
      ...values,
      keepAlive: values.keepAlive ? '1' : '0',
      affixTab: values.affixTab ? '1' : '0',
      hideInMenu: values.hideInMenu ? '1' : '0',
      hideChildrenInMenu: values.hideChildrenInMenu ? '1' : '0',
      hideInBreadcrumb: values.hideInBreadcrumb ? '1' : '0',
      hideInTab: values.hideInTab ? '1' : '0',
    });
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
    addSysMenuApi(res.parentId).then((data) => {
      baseFormApi.setValues(data);
    });
  });
}

const [Drawer, drawerApi] = useVbenDrawer({
  onOpenChange: async (isOpen: boolean) => {
    if (isOpen) {
      const data = drawerApi.getData<Record<string, any>>();
      await baseFormApi.resetForm();
      await baseFormApi.setValues({
        ...data,
        keepAlive: data.keepAlive === '1',
        affixTab: data.affixTab === '1',
        hideInMenu: data.hideInMenu === '1',
        hideChildrenInMenu: data.hideChildrenInMenu === '1',
        hideInBreadcrumb: data.hideInBreadcrumb === '1',
        hideInTab: data.hideInTab === '1',
      });
    }
  },
});
</script>
<template>
  <Drawer class="w-[1000px]" title="菜单信息">
    <BaseForm />

    <Divider>说明</Divider>
    <div class="mt-4">
      <TypographyText>
        <strong>1、缓存机制说明：</strong>
        当前会话菜单与角色菜单均存储于缓存中，因此修改菜单后不会立即生效。
        <br />
      </TypographyText>
      <TypographyText> <strong>2、生效操作指引</strong><br /> </TypographyText>
      <div class="pl-6">
        <TypographyText>
          <strong>方法一：</strong>
          前往<router-link to="/auth/role/list">“角色管理”</router-link>
          页面，找到需要更新授权/菜单的角色，进入编辑页面后直接点击保存，随后刷新当前页面。
          <br />
        </TypographyText>
        <TypographyText>
          <strong>方法二：</strong>
          前往<router-link to="/auth/role/list">“角色管理”</router-link>
          页面点击 “刷新缓存”按钮，操作完成后重新登录用户账号。
        </TypographyText>
      </div>
    </div>

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
