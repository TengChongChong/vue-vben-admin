import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import { h } from 'vue';

import { setupVbenVxeTable, useVbenVxeGrid } from '@vben/plugins/vxe-table';

import { Button, Image } from 'ant-design-vue';

import { DictTag } from '#/components/dict';
import { formatToDate, formatToDuration } from '#/util/date';

import { useVbenForm } from './form';

setupVbenVxeTable({
  configVxeTable: (vxeUI) => {
    vxeUI.setConfig({
      grid: {
        // 所有的列对齐方式
        align: 'center',
        // 所有的表头列的对齐方式
        headerAlign: 'center',
        // 是否带有边框
        border: false,
        // 表格的高度；支持铺满父容器或者固定高度，如果设置 auto 为铺满父容器（如果设置为 auto，则必须确保存在父节点且不允许存在相邻元素）
        height: 'auto',
        // 表格最小高度
        minHeight: 180,
        // 表格最大高度
        // maxHeight: 900,
        // 自动监听父元素的变化去重新计算表格
        // autoResize: true,
        // 是否带有斑马纹
        stripe: true,
        // 是否为圆角边框
        round: true,
        // 表格的尺寸 medium, small, mini
        size: 'medium',
        // 设置所有内容过长时显示为省略号 ellipsis（只显示省略号）,title（并且显示为原生 title）,tooltip（并且显示为 tooltip 提示）
        showOverflow: 'tooltip',
        // 保持原始值的状态，被某些功能所依赖，比如编辑状态、还原数据等（开启后影响性能，具体取决于数据量）
        keepSource: true,
        // 行配置信息
        rowConfig: {
          // 自定义行数据唯一主键的字段名（默认自动生成）
          keyField: 'id',
          // 当鼠标点击行时，是否要高亮当前行
          isCurrent: true,
          // 当鼠标移到行时，是否要高亮当前行
          isHover: true,
        },
        // 排序配置项
        sortConfig: {
          // 是否启用多列组合筛选
          // multiple: true,
          // 所有列是否使用服务端排序，如果设置为 true 则不会对数据进行处理
          remote: true,
          // 触发方式（注：当多种功能重叠时，会同时触发），default（点击按钮触发）, cell（点击表头触发），manual（手动方式）
          trigger: 'cell',
        },
        // 筛选配置项
        filterConfig: {
          // 所有列是否使用服务端筛选，如果设置为 true 则不会对数据进行处理
          remote: true,
        },
        // 工具栏配置
        toolbarConfig: {
          // 打印按钮配置
          // print: true,
          // 刷新按钮配置
          refresh: true,
          // 自定义列配置
          custom: true,
          // 是否允许最大化显示
          zoom: true,
        },
        pagerConfig: {
          // 每页大小
          pageSize: 15,
          // 每页大小选项列表
          pageSizes: [10, 15, 20, 30, 40, 50, 100, 200],
        },
        // 列配置信息
        columnConfig: {
          // 每一列是否启用列宽调整
          resizable: true,
        },
        // 个性化信息配置项
        customConfig: {
          // 是否启用 localStorage 本地保存，会将列操作状态保留在本地（需要有 id）
          storage: true,
        },
        // 单选框配置项
        radioConfig: {
          // 是否保留勾选状态，例如：数据被刷新或者分页之后还保留之前选中的状态（需要有 row-config.keyField）
          reserve: true,
          // 高亮勾选行
          highlight: true,
          trigger: 'row',
        },
        // 复选框配置项
        checkboxConfig: {
          // 是否保留勾选状态，对于某些场景可能会用到，比如数据被刷新之后还保留之前选中的状态（需要有 row-config.keyField）
          reserve: true,
          // 高亮勾选行
          highlight: true,
          // 绑定选中属性（行数据中必须存在该字段，否则无效）
          // checkField: 'id',
          // 开启复选框范围选择功能（启用后通过鼠标在复选框的列内滑动选中或取消指定行）
          range: true,
          // labelField: 'name',
        },
        // 数据代理配置项（基于 Promise API）
        formConfig: {
          // 全局禁用vxe-table的表单配置，使用formOptions
          enabled: false,
        },
        // 序号配置项
        // seqConfig: {
        //   // 自定义序号的方法，返回处理后的值
        //   seqMethod({ $grid, rowIndex }) {
        //     const { pageSize, currentPage } = $grid.reactData.tablePage;
        //     return (currentPage - 1) * pageSize + rowIndex + 1;
        //   },
        // },
        proxyConfig: {
          // 是否自动加载查询数据
          autoLoad: true,
          // 是否代理排序
          sort: true,
          // 是否代理筛选
          filter: true,
          // 获取响应的值配置
          response: {
            // 只对 pager-config 配置了有效，响应结果中获取数据列表的属性（分页场景）
            result: 'records',
            // 只对 pager-config 配置了有效，响应结果中获取分页的属性（分页场景）
            total: 'total',
            // 响应结果中获取数据列表的属性（不分页场景）
            // list: 'data',
          },
          // showActiveMsg: true,
          // showResponseMsg: false,
        },
      } as VxeTableGridOptions,
    });

    // 表格配置项可以用 cellRender: { name: 'CellImage' },
    vxeUI.renderer.add('CellImage', {
      renderTableDefault(renderOpts, params) {
        const { props } = renderOpts;
        const { column, row } = params;
        return h(Image, { src: row[column.field], ...props });
      },
    });

    // 表格配置项可以用 cellRender: { name: 'CellLink' },
    vxeUI.renderer.add('CellLink', {
      renderTableDefault(renderOpts) {
        const { props } = renderOpts;
        return h(
          Button,
          { size: 'small', type: 'link' },
          { default: () => props?.text },
        );
      },
    });

    // 表格配置项可以用 cellRender: { name: 'DictTag' },
    vxeUI.renderer.add('DictTag', {
      renderTableDefault(renderOpts, params) {
        const { column, row } = params;
        const { props } = renderOpts;
        return h(DictTag, { code: row[column.field], ...props });
      },
    });

    // 这里可以自行扩展 vxe-table 的全局配置，比如自定义格式化
    vxeUI.formats.add('date', {
      tableCellFormatMethod({ cellValue }) {
        return formatToDate(cellValue);
      },
    });

    vxeUI.formats.add('dateTime', {
      tableCellFormatMethod({ cellValue }) {
        return formatToDate(cellValue, 'YYYY-MM-DD HH:mm');
      },
    });

    vxeUI.formats.add('dateDuration', {
      tableCellFormatMethod({ cellValue }) {
        return formatToDuration(cellValue);
      },
    });
  },
  useVbenForm,
});

export { useVbenVxeGrid };

export type * from '@vben/plugins/vxe-table';
