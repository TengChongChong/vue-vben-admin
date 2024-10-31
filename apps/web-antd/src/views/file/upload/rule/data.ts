// 表格列数据
import type { VxeGridPropTypes } from '@vben/plugins/vxe-table';

import { h } from 'vue';

import { message, Switch } from 'ant-design-vue';

import { setStatusApi } from '#/api/file/fileUploadRule.ts';
import { renderDictTag } from '#/components/dict';

export const initColumns = (): VxeGridPropTypes.Columns[] => {
  return [
    { type: 'checkbox', width: 50, fixed: 'left' },
    { title: '序号', type: 'seq', width: 50, fixed: 'left' },
    {
      title: '分类',
      field: 'category',
      sorter: true,
      width: 120,
      slots: {
        default: ({ row }) => {
          return renderDictTag('sysFileUploadRuleCategory', row.category);
        },
      },
    },
    {
      title: '名称',
      field: 'name',
      sorter: true,
      minWidth: 160,
    },
    {
      title: '别名',
      field: 'slug',
      sorter: true,
      minWidth: 180,
    },
    {
      title: '存储目录',
      field: 'directory',
      sorter: true,
      minWidth: 160,
    },
    {
      title: '允许上传的文件大小',
      field: 'upperLimit',
      sorter: true,
      width: 200,
      slots: { default: 'upperLimit' },
    },
    {
      title: '文件拓展名',
      field: 'suffix',
      sorter: true,
      minWidth: 160,
    },
    {
      title: '状态',
      field: 'status',
      width: 100,
      slots: {
        default: ({ row }) => {
          if (!Reflect.has(row, 'pendingStatus')) {
            row.pendingStatus = false;
          }
          return h(Switch, {
            checked: row.status === '1',
            checkedChildren: '已启用',
            unCheckedChildren: '已禁用',
            loading: row.pendingStatus,
            onChange(checked: boolean) {
              row.pendingStatus = true;
              const newStatus = checked ? '1' : '2';
              setStatusApi(row.id, newStatus, row.type)
                .then(() => {
                  row.status = newStatus;
                  message.success(`操作成功`);
                  if (
                    row.type === 'menu' && // 同时更新子级数据
                    row.children
                  ) {
                    row.children.forEach((item) => {
                      item.status = newStatus;
                    });
                  }
                })
                .finally(() => {
                  row.pendingStatus = false;
                });
            },
          });
        },
      },
    },
    {
      title: '编辑人',
      field: 'editUser',
      sortable: true,
      width: 120,
    },
    {
      title: '编辑时间',
      field: 'editDate',
      sortable: true,
      width: 160,
      formatter: 'dateTime',
    },
    {
      title: '操作',
      field: 'action',
      width: 160,
      fixed: 'right',
      slots: { default: 'action' },
    },
  ];
};
