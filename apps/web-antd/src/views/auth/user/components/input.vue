<script lang="ts" setup>
import type { SysUserVO } from '#/api/auth/model/sys-user-model';

import { ref } from 'vue';

import { useVbenDrawer, z } from '@vben/common-ui';

import { message, Space } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { addApi, saveApi } from '#/api/auth/sys-user';
import { ButtonClose, ButtonSave } from '#/components/button';

const emit = defineEmits(['success']);

const saveBtnLoading = ref(false);

const [BaseForm, baseFormApi] = useVbenForm({
  showDefaultActions: false,
  schema: [
    { fieldName: 'id', component: 'Input', formItemClass: 'hidden' },
    { fieldName: 'deptId', component: 'Input', formItemClass: 'hidden' },
    { fieldName: 'version', component: 'Input', formItemClass: 'hidden' },
    {
      fieldName: 'nickname',
      label: '昵称',
      component: 'Input',
      rules: z
        .string()
        .min(1, { message: '请输入昵称' })
        .max(32, { message: '昵称最多输入32个字符' }),
    },
    {
      fieldName: 'username',
      label: '用户名',
      component: 'Input',
      rules: z
        .string()
        .min(1, { message: '请输入用户名' })
        .max(32, { message: '用户名最多输入32个字符' }),
    },
    {
      fieldName: 'password',
      label: '密码',
      component: 'InputPassword',
      componentProps: {
        autocomplete: 'new-password',
      },
      rules: z
        .string()
        .min(1, { message: '请输入密码' })
        .max(32, { message: '密码最多输入32个字符' }),
    },
    {
      fieldName: 'roleIdList',
      label: '角色',
      component: 'RoleSelect',
      componentProps: {
        mode: 'multiple',
        type: 'deptId',
      },
      rules: 'selectRequired',
    },
    {
      fieldName: 'sex',
      label: '性别',
      rules: 'selectRequired',
      component: 'DictRadio',
      componentProps: {
        dictType: 'sex',
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
      fieldName: 'phoneNumber',
      label: '手机号',
      component: 'Input',
      rules: z
        .string()
        .max(32, { message: '手机号最多输入32个字符' })
        .optional(),
    },
    {
      fieldName: 'email',
      label: '邮箱',
      component: 'Input',
      rules: z.string().max(32, { message: '邮箱最多输入32个字符' }).optional(),
    },
    {
      fieldName: 'birthday',
      label: '生日',
      component: 'DatePicker',
    },
    {
      fieldName: 'source',
      label: '来源',
      component: 'Input',
      rules: z.string().max(32, { message: '来源最多输入32个字符' }).optional(),
    },
  ],
});

async function handleSubmit(callback: (res: SysUserVO) => any) {
  try {
    saveBtnLoading.value = true;
    const { valid } = await baseFormApi.validate();
    if (!valid) {
      return;
    }
    const res = await saveApi(await baseFormApi.getValues());
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
  await handleSubmit((res) => {
    baseFormApi.resetForm();
    const { deptId } = res;
    addApi(deptId).then((res) => {
      baseFormApi.setValues(res);
    });
  });
}

const [Drawer, drawerApi] = useVbenDrawer({
  onOpenChange: async (isOpen: boolean) => {
    if (isOpen) {
      // 打开时根据id获取详情
      const data = drawerApi.getData<Record<string, any>>();
      await baseFormApi.resetForm();
      await baseFormApi.setValues(data);
      baseFormApi.updateSchema([
        {
          fieldName: 'roleIdList',
          componentProps: {
            deptId: data.deptId,
          },
        },
        {
          fieldName: 'password',
          // 密码只允许在新增时设置
          formItemClass: data.id ? 'hidden' : '',
        },
      ]);
    }
  },
});
</script>
<template>
  <Drawer class="w-[600px]" title="用户信息">
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
