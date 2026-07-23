<script lang="ts" setup>
import type { SysTenantPackageOption, SysTenantSave } from '#/api';

import { computed, ref } from 'vue';

import { useVbenModal, z } from '@vben/common-ui';

import { Button, message, Space } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { listSysTenantPackageOptionsApi, saveSysTenantApi } from '#/api';
import { ButtonClose, ButtonSave } from '#/components/button';
import SyncMenuModal from '#/views/sys/tenant/package/sync-menu-modal.vue';

const emit = defineEmits(['success']);

const saveBtnLoading = ref(false);
const packageOptions = ref<SysTenantPackageOption[]>([]);
const maxUserCountTouched = ref(false);
const isEdit = ref(false);

const [SyncModal, syncModalApi] = useVbenModal({
  connectedComponent: SyncMenuModal,
});

async function handleSyncFromPackage() {
  const values = await baseFormApi.getValues<SysTenantSave>();
  if (!values.id) {
    return;
  }
  if (!values.packageId) {
    message.warning('请先为租户选择套餐');
    return;
  }
  syncModalApi.setData({ tenantId: values.id });
  syncModalApi.open();
}

const showAdminFields = computed(() => !isEdit.value);

async function loadPackageOptions() {
  packageOptions.value = await listSysTenantPackageOptionsApi();
}

function handlePackageChange(packageId?: string) {
  if (isEdit.value || maxUserCountTouched.value || !packageId) {
    return;
  }
  const selected = packageOptions.value.find((item) => item.id === packageId);
  if (selected?.maxUserCount && selected.maxUserCount > 0) {
    baseFormApi.setFieldValue('maxUserCount', selected.maxUserCount);
  } else {
    baseFormApi.setFieldValue('maxUserCount', undefined);
  }
}

const [BaseForm, baseFormApi] = useVbenForm({
  showDefaultActions: false,
  schema: [
    { fieldName: 'id', component: 'Input', formItemClass: 'hidden' },
    { fieldName: 'version', component: 'Input', formItemClass: 'hidden' },
    {
      fieldName: 'tenantCode',
      label: '租户编码',
      component: 'Input',
      rules: z
        .string()
        .min(2, { message: '租户编码至少2个字符' })
        .max(64, { message: '租户编码最多64个字符' })
        .regex(/^[a-z][a-z0-9_-]*$/, {
          message: '需以小写字母开头，仅含小写字母、数字、下划线或中划线',
        }),
      description: '创建后不建议修改，用于系统内部标识',
    },
    {
      fieldName: 'name',
      label: '租户名称',
      component: 'Input',
      rules: z
        .string()
        .min(1, { message: '请输入租户名称' })
        .max(128, { message: '租户名称最多128个字符' }),
    },
    {
      fieldName: 'packageId',
      label: '租户套餐',
      component: 'Select',
      componentProps: () => ({
        allowClear: true,
        options: packageOptions.value.map((item) => ({
          label: item.name,
          value: item.id,
        })),
        onChange: handlePackageChange,
        placeholder: '请选择套餐',
      }),
    },
    {
      fieldName: 'maxUserCount',
      label: '用户数上限',
      component: 'InputNumber',
      componentProps: {
        min: 0,
        class: 'w-full',
        placeholder: '0 或留空表示不限制',
        onChange: () => {
          maxUserCountTouched.value = true;
        },
      },
      description: '默认从套餐复制，可单独调高或调低',
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
      fieldName: 'contacts',
      label: '联系人',
      component: 'Input',
      rules: z.string().max(32, { message: '联系人最多32个字符' }).optional(),
    },
    {
      fieldName: 'phoneNumber',
      label: '手机号',
      component: 'Input',
      rules: z.string().max(32, { message: '手机号最多32个字符' }).optional(),
    },
    {
      fieldName: 'expireTime',
      label: '到期时间',
      component: 'DatePicker',
      componentProps: {
        showTime: true,
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        class: 'w-full',
      },
    },
    {
      fieldName: 'createAdmin',
      label: '创建管理员',
      component: 'Switch',
      componentProps: {
        checkedChildren: '是',
        unCheckedChildren: '否',
      },
      defaultValue: false,
      dependencies: {
        triggerFields: ['id'],
        show: () => showAdminFields.value,
      },
    },
    {
      fieldName: 'adminUsername',
      label: '管理员用户名',
      component: 'Input',
      dependencies: {
        triggerFields: ['createAdmin'],
        show: (values) => showAdminFields.value && values.createAdmin === true,
      },
    },
    {
      fieldName: 'adminNickname',
      label: '管理员昵称',
      component: 'Input',
      dependencies: {
        triggerFields: ['createAdmin'],
        show: (values) => showAdminFields.value && values.createAdmin === true,
      },
      rules: z.string().max(32, { message: '昵称最多32个字符' }).optional(),
    },
    {
      fieldName: 'adminPassword',
      label: '管理员密码',
      component: 'InputPassword',
      dependencies: {
        triggerFields: ['createAdmin'],
        show: (values) => showAdminFields.value && values.createAdmin === true,
      },
    },
    {
      fieldName: 'adminPhoneNumber',
      label: '管理员手机号',
      component: 'Input',
      dependencies: {
        triggerFields: ['createAdmin'],
        show: (values) => showAdminFields.value && values.createAdmin === true,
      },
      rules: z.string().max(32, { message: '手机号最多32个字符' }).optional(),
    },
    {
      fieldName: 'adminEmail',
      label: '管理员邮箱',
      component: 'Input',
      dependencies: {
        triggerFields: ['createAdmin'],
        show: (values) => showAdminFields.value && values.createAdmin === true,
      },
      rules: z
        .string()
        .email({ message: '邮箱格式不正确' })
        .optional()
        .or(z.literal('')),
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

async function handleSubmit(callback: (res: SysTenantSave) => any) {
  try {
    saveBtnLoading.value = true;
    const { valid } = await baseFormApi.validate();
    if (!valid) {
      return;
    }
    modalApi.lock();
    const values = await baseFormApi.getValues<SysTenantSave>();
    if (values.createAdmin && !values.id) {
      if (!values.adminUsername?.trim()) {
        message.error('请输入管理员用户名');
        modalApi.unlock();
        return;
      }
      if (!values.adminPassword || values.adminPassword.length < 6) {
        message.error('管理员密码至少6个字符');
        modalApi.unlock();
        return;
      }
      if (!values.packageId) {
        message.error('创建管理员需先选择租户套餐');
        modalApi.unlock();
        return;
      }
    }
    if (values.maxUserCount === 0) {
      values.maxUserCount = undefined;
    }
    const res = await saveSysTenantApi(values);
    message.success('保存成功');
    emit('success');
    await callback(res);
    modalApi.unlock();
  } catch (error) {
    modalApi.unlock();
    console.error('保存失败', error);
  } finally {
    saveBtnLoading.value = false;
  }
}

async function handleSave() {
  await handleSubmit(() => {
    modalApi.close();
  });
}

async function handleSaveAndAdd() {
  await handleSubmit(() => {
    baseFormApi.resetForm();
    baseFormApi.setValues({ status: '1', createAdmin: false });
    maxUserCountTouched.value = false;
    isEdit.value = false;
  });
}

const [Modal, modalApi] = useVbenModal({
  onOpenChange: async (isOpen: boolean) => {
    if (isOpen) {
      await loadPackageOptions();
      const data = modalApi.getData<Record<string, any>>();
      isEdit.value = !!data.id;
      maxUserCountTouched.value = !!data.id;
      await baseFormApi.resetForm();
      await baseFormApi.setValues({
        status: '1',
        createAdmin: false,
        ...data,
      });
      if (data.id) {
        baseFormApi.updateSchema([
          {
            fieldName: 'tenantCode',
            componentProps: { disabled: data.id === '1' },
          },
        ]);
      } else {
        baseFormApi.updateSchema([
          {
            fieldName: 'tenantCode',
            componentProps: { disabled: false },
          },
        ]);
      }
    }
  },
});
</script>
<template>
  <Modal class="w-[680px]" title="租户信息">
    <BaseForm />

    <template #footer>
      <Space>
        <Button
          v-if="isEdit"
          type="default"
          @click="handleSyncFromPackage">
          从套餐同步菜单
        </Button>
        <ButtonClose @click="modalApi.close()" />
        <ButtonSave :loading="saveBtnLoading" @click="handleSave" />
        <ButtonSave
          :loading="saveBtnLoading"
          text="保存并新增"
          @click="handleSaveAndAdd" />
      </Space>
    </template>
  </Modal>
  <SyncModal />
</template>
