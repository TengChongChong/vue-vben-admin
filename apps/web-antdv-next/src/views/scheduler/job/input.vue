<script lang="ts" setup>
import type {
  SchedulerJob,
  SchedulerJobMethodOption,
  SelectModel,
} from '#/api';

import { computed, ref } from 'vue';

import { useAccess } from '@vben/access';
import { useVbenDrawer, z } from '@vben/common-ui';

import {
  AutoComplete,
  Button,
  Dropdown,
  Input,
  Menu,
  MenuDivider,
  MenuItem,
  message,
  Select,
  Space,
} from 'antdv-next';

import { useVbenForm } from '#/adapter/form';
import {
  addSchedulerJobApi,
  saveSchedulerJobApi,
  selectSchedulerJobBeansApi,
  selectSchedulerJobMethodsApi,
} from '#/api';
import { ButtonClose, ButtonSave } from '#/components/button';
import { LucideChevronDown } from '#/components/icons';
import { RoleEnum } from '#/enums/roleEnum';

import { validateSchedulerJobParams } from './job-params';
import JobParamsEditor from './job-params-editor.vue';

const emit = defineEmits(['success']);

const saveBtnLoading = ref(false);
const beanOptions = ref<SelectModel[]>([]);
const methodOptions = ref<SchedulerJobMethodOption[]>([]);
const currentBean = ref('');
const beanSearchTimer = ref<null | ReturnType<typeof setTimeout>>(null);
const methodRequestId = ref(0);

const { hasAccessByRoles } = useAccess();

const beanAutoCompleteOptions = computed(() =>
  beanOptions.value.map((item) => ({
    value: item.value,
    label: item.label ?? item.value,
  })),
);

const methodAutoCompleteOptions = computed(() =>
  methodOptions.value.map((item) => ({
    value: item.signature,
    label: item.signature,
  })),
);

function filterMethodOption(input: string, option: { value: string }) {
  return option.value.toLowerCase().includes(input.toLowerCase());
}

async function loadBeanOptions(keyword = '') {
  beanOptions.value = await selectSchedulerJobBeansApi(keyword);
}

function handleBeanSearch(value: string) {
  const keyword = value?.trim() ?? '';
  if (beanSearchTimer.value) {
    clearTimeout(beanSearchTimer.value);
  }
  beanSearchTimer.value = setTimeout(() => {
    if (keyword.length > 0 && keyword.length < 2) {
      beanOptions.value = [];
      return;
    }
    loadBeanOptions(keyword);
  }, 200);
}

async function loadMethodOptions(bean: string) {
  const requestId = ++methodRequestId.value;
  if (!bean?.trim()) {
    if (requestId === methodRequestId.value) {
      methodOptions.value = [];
    }
    return;
  }
  const data = await selectSchedulerJobMethodsApi(bean);
  if (requestId === methodRequestId.value) {
    methodOptions.value = data;
  }
}

async function handleBeanChange(value: unknown) {
  const beanValue = value == null || Array.isArray(value) ? '' : String(value);
  if (beanValue === currentBean.value) {
    return;
  }
  currentBean.value = beanValue;
  await baseFormApi.setValues({
    bean: beanValue,
    method: '',
    params: '',
  });
  await loadMethodOptions(beanValue);
}

async function handleMethodSelect(value: unknown) {
  const signatureValue =
    value == null || Array.isArray(value) ? '' : String(value);
  const option = methodOptions.value.find(
    (item) => item.signature === signatureValue,
  );
  if (!option) {
    return;
  }
  const updates: Partial<SchedulerJob> = {
    method: option.method,
    params: option.params.length > 0 ? JSON.stringify(option.params) : '',
  };
  await baseFormApi.setValues(updates);
}

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
      label: '代码',
      component: 'Input',
      rules: z
        .string()
        .min(1, { message: '请输入代码' })
        .max(32, { message: '代码最多输入32个字符' }),
      description: '任务唯一标识',
    },
    {
      fieldName: 'cron',
      label: 'Cron',
      component: 'Input',
      rules: z
        .string()
        .min(1, { message: '请输入cron' })
        .max(64, { message: 'cron最多输入64个字符' }),
    },
    {
      fieldName: 'bean',
      label: '类（Bean）',
      component: 'Input',
      rules: z
        .string()
        .min(1, { message: '请输入类' })
        .max(64, { message: '类最多输入64个字符' }),
      description: 'Spring Bean Id',
    },
    {
      fieldName: 'method',
      label: '方法',
      component: 'Input',
      rules: z
        .string()
        .min(1, { message: '请输入方法' })
        .max(32, { message: '方法最多输入32个字符' }),
      description: '类（Bean）中定义的方法',
    },
    {
      fieldName: 'params',
      label: '方法参数',
      component: 'Input',
      description:
        '按顺序配置方法参数，无参方法可留空。JSON 类型用于传入对象或数组结构。',
      rules: z
        .string()
        .optional()
        .refine((value) => validateSchedulerJobParams(value), {
          message: '参数格式错误，请检查类型与 JSON 内容',
        }),
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
      fieldName: 'sys',
      label: '是否系统',
      rules: 'selectRequired',
      component: 'DictRadio',
      componentProps: {
        dictType: 'whether',
      },
      formItemClass: hasAccessByRoles([RoleEnum.SYS_ADMIN]) ? '' : 'hidden',
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

async function handleSubmit(callback: (res: SchedulerJob) => any) {
  try {
    saveBtnLoading.value = true;
    const { valid } = await baseFormApi.validate();
    if (!valid) {
      return;
    }
    const values: SchedulerJob = await baseFormApi.getValues();
    if (!values.params || values.params.trim() === '[]') {
      values.params = undefined;
    }
    const res = await saveSchedulerJobApi(values);
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
    currentBean.value = '';
    methodOptions.value = [];
    addSchedulerJobApi().then((res) => {
      baseFormApi.setValues(res);
    });
  });
}

const [Drawer, drawerApi] = useVbenDrawer({
  onOpenChange: async (isOpen: boolean) => {
    if (isOpen) {
      const data = drawerApi.getData<Record<string, any>>();
      await baseFormApi.resetForm();
      await loadBeanOptions();
      currentBean.value = data?.bean ?? '';
      await baseFormApi.setValues({
        ...data,
      });
      if (data?.bean) {
        await loadMethodOptions(data.bean);
      } else {
        methodOptions.value = [];
      }
    }
  },
});

function handleSetCron({ key }: { key: number | string }) {
  baseFormApi.setValues({ cron: String(key) });
}
</script>
<template>
  <Drawer class="w-[600px]" title="定时任务">
    <BaseForm>
      <template #bean="slotProps">
        <AutoComplete
          v-bind="slotProps"
          allow-clear
          class="w-full"
          :filter-option="false"
          :options="beanAutoCompleteOptions"
          @change="handleBeanChange"
          @search="handleBeanSearch"
        />
      </template>
      <template #method="slotProps">
        <Select
          v-bind="slotProps"
          allow-clear
          class="w-full"
          show-search
          :filter-option="filterMethodOption"
          :options="methodAutoCompleteOptions"
          @change="handleMethodSelect"
        />
      </template>
      <template #params="slotProps">
        <JobParamsEditor v-bind="slotProps" />
      </template>
      <template #cron="slotProps">
        <Input v-bind="slotProps">
          <template #addonAfter>
            <Dropdown>
              <Button size="small" type="text">
                常用Corn表达式
                <LucideChevronDown />
              </Button>
              <Menu @click="handleSetCron">
                <MenuItem key="*/5 * * * * ?">每隔5秒执行一次</MenuItem>
                <MenuItem key="0 */1 * * * ?">每隔1分钟执行一次</MenuItem>
                <MenuItem key="0 15,30,45 * * * ?">
                  每小时的15分、30分、45分执行一次
                </MenuItem>
                <MenuDivider />
                <MenuItem key="0 0 1 * * ?">每天1:00执行一次</MenuItem>
                <MenuItem key="0 0 12 * * ?">每天12:00执行一次</MenuItem>
                <MenuItem key="0 0 23 * * ?">每天23:00执行一次</MenuItem>
                <MenuItem key="0 0 0,13,18,21 * * ?">
                  每天0:00、13:00、18:00、21:00执行一次
                </MenuItem>
                <MenuItem key="0 15 10 ? * *">每天10:15执行一次</MenuItem>
                <MenuItem key="0 * 14 * * ?">
                  每天从14:00~14:59分每分钟执行一次
                </MenuItem>
                <MenuItem key="0 0/5 14 * * ?">
                  每天从14:00~14:55分每5分钟执行一次
                </MenuItem>
                <MenuItem key="0 0/5 14,18 * * ?">
                  每天的14:00~14:55和18:00~18:55分两个时间段内每5分钟执行一次
                </MenuItem>
                <MenuItem key="0 0-5 14 * * ?">
                  每天14:00至14:05每分钟一次触发
                </MenuItem>
                <MenuDivider />
                <MenuItem key="0 0 1 ? * L">每周日1:00执行一次</MenuItem>
                <MenuItem key="0 0 1 1 * ?">每月1号1:00执行一次</MenuItem>
                <MenuItem key="0 0 23 L * ?">
                  每月最后一天23:00执行一次
                </MenuItem>
                <MenuItem key="0 15 10 ? * MON-FRI">
                  每周一、周二、周三、周四、周五的10:15执行一次
                </MenuItem>
              </Menu>
            </Dropdown>
          </template>
        </Input>
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
