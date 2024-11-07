<script lang="ts" setup>
import type { SchedulerJob } from '#/api/scheduler/model/scheduler-job-model';

import { ref } from 'vue';

import { useAccess } from '@vben/access';
import { useVbenDrawer, z } from '@vben/common-ui';

import {
  Button,
  Dropdown,
  Input,
  Menu,
  MenuDivider,
  MenuItem,
  message,
  Space,
} from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { addApi, saveApi } from '#/api/scheduler/scheduler-job';
import { ButtonClose, ButtonSave } from '#/components/button';
import { LucideChevronDown } from '#/components/icons';
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
        .max(32, { message: '类最多输入32个字符' }),
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
      ifShow: () => {
        return hasAccessByRoles([RoleEnum.SYS_ADMIN]);
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

async function handleSubmit(callback: (res: SchedulerJob) => any) {
  try {
    saveBtnLoading.value = true;
    const { valid } = await baseFormApi.validate();
    if (!valid) {
      return;
    }
    const values: SchedulerJob = await baseFormApi.getValues();
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

const [Drawer, drawerApi] = useVbenDrawer({
  onOpenChange: async (isOpen: boolean) => {
    if (isOpen) {
      // 打开时根据id获取详情
      const data = drawerApi.getData<Record<string, any>>();
      await baseFormApi.setValues({
        ...data,
      });
    }
  },
});

function handleSetCron({ key }) {
  baseFormApi.setValues({ cron: key });
}
</script>
<template>
  <Drawer class="w-[600px]" title="文件上传策略">
    <BaseForm>
      <template #cron="slotProps">
        <Input v-bind="slotProps">
          <template #addonAfter>
            <Dropdown>
              <Button size="small" type="text">
                常用Corn表达式
                <LucideChevronDown />
              </Button>
              <template #overlay>
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
              </template>
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
