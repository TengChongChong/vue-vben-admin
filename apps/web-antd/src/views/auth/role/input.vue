<script lang="ts" setup>
import type { SysConfig } from '#/api/sys/model/sysConfigModel';

import { ref } from 'vue';

import { useAccess } from '@vben/access';
import { useVbenDrawer, z } from '@vben/common-ui';

import { message, Space } from 'ant-design-vue';

import { useVbenForm } from '#/adapter';
import { saveApi } from '#/api/sys/sysConfig';
import { ButtonClose, ButtonSave } from '#/components/button';
import { RoleEnum } from '#/enums/roleEnum';

const emit = defineEmits(['success']);

const saveBtnLoading = ref(false);

const { hasAccessByRoles } = useAccess();

const [BaseForm, baseFormApi] = useVbenForm({
  showDefaultActions: false,
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
      fieldName: 'permissionIds',
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

async function handleSubmit(callback: (res: SysConfig) => any) {
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
    const { category, type, sys } = res;
    baseFormApi.setValues({ category, type, sys });
  });
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
