import type {
  BaseFormComponentType,
  VbenFormSchema as FormSchema,
  VbenFormProps,
} from '@vben/common-ui';

import { h } from 'vue';

import { setupVbenForm, useVbenForm as useForm, z } from '@vben/common-ui';
import { $t } from '@vben/locales';

import {
  AutoComplete,
  Button,
  Checkbox,
  CheckboxGroup,
  DatePicker,
  Divider,
  Input,
  InputNumber,
  InputPassword,
  Mentions,
  Radio,
  RadioGroup,
  RangePicker,
  Rate,
  Select,
  Space,
  Switch,
  Textarea,
  TimePicker,
  TreeSelect,
  Upload,
} from 'ant-design-vue';

import { Cropper } from '#/components/cropper';
import { DeptSelect } from '#/components/dept';
import {
  DictCascader,
  DictCheckbox,
  DictRadio,
  DictSelect,
  DictTreeSelect,
} from '#/components/dict';
import { RoleSelect } from '#/components/role';
import { UserSelect } from '#/components/user';

// 业务表单组件适配

// 这里需要自行根据业务组件库进行适配，需要用到的组件都需要在这里类型说明
export type FormComponentType =
  | 'AutoComplete'
  | 'Checkbox'
  | 'CheckboxGroup'
  | 'Cropper'
  | 'DatePicker'
  | 'DeptSelect'
  | 'DictCascader'
  | 'DictCheckbox'
  | 'DictRadio'
  | 'DictSelect'
  | 'DictTreeSelect'
  | 'Divider'
  | 'Input'
  | 'InputNumber'
  | 'InputPassword'
  | 'Mentions'
  | 'Radio'
  | 'RadioGroup'
  | 'RangePicker'
  | 'Rate'
  | 'RoleSelect'
  | 'Select'
  | 'Space'
  | 'Switch'
  | 'Textarea'
  | 'TimePicker'
  | 'TreeSelect'
  | 'Upload'
  | 'UserSelect'
  | BaseFormComponentType;

// 初始化表单组件，并注册到form组件内部
setupVbenForm<FormComponentType>({
  components: {
    AutoComplete,
    Checkbox,
    CheckboxGroup,
    Cropper,
    DatePicker,
    // 自定义默认的重置按钮
    DefaultResetActionButton: (props, { attrs, slots }) => {
      return h(Button, { ...props, attrs, type: 'default' }, slots);
    },
    // 自定义默认的提交按钮
    DefaultSubmitActionButton: (props, { attrs, slots }) => {
      return h(Button, { ...props, attrs, type: 'primary' }, slots);
    },
    DictCascader,
    DictCheckbox,
    DictRadio,
    DictSelect,
    DictTreeSelect,
    Divider,
    DeptSelect,
    Input,
    InputNumber,
    InputPassword,
    Mentions,
    Radio,
    RadioGroup,
    RangePicker,
    Rate,
    RoleSelect,
    Select,
    Space,
    Switch,
    TimePicker,
    TreeSelect,
    Textarea,
    Upload,
    UserSelect,
  },
  config: {
    // ant design vue组件库默认都是 v-model:value
    baseModelPropName: 'value',

    // 一些组件是 v-model:checked 或者 v-model:fileList
    modelPropNameMap: {
      Checkbox: 'checked',
      Radio: 'checked',
      Switch: 'checked',
      Upload: 'fileList',
    },
  },
  defineRules: {
    // 输入项目必填国际化适配
    required: (value, _params, ctx) => {
      if (value === undefined || value === null || value.length === 0) {
        return $t('formRules.required', [ctx.label]);
      }
      return true;
    },
    // 选择项目必填国际化适配
    selectRequired: (value, _params, ctx) => {
      if (value === undefined || value === null) {
        return $t('formRules.selectRequired', [ctx.label]);
      }
      return true;
    },
  },
});

const useVbenForm = useForm<FormComponentType>;

export { useVbenForm, z };

export type VbenFormSchema = FormSchema<FormComponentType>;
export type { VbenFormProps };
