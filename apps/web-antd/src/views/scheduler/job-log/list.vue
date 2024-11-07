<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { SchedulerJob } from '#/api/scheduler/model/scheduler-job-model';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { selectApi } from '#/api/scheduler/scheduler-job-log';

const props = defineProps<{ schedulerJobId: string }>();

const gridOptions: VxeGridProps<SchedulerJob> = {
  id: 'scheduler-job-log',
  columns: [
    {
      title: '执行时间',
      field: 'runDate',
      sortable: true,
      minWidth: 160,
      formatter: 'dateTime',
    },
    {
      title: '耗时',
      field: 'timeConsuming',
      sortable: true,
      minWidth: 150,
      slots: {
        default: ({ row }) => {
          return `${row.timeConsuming / 1000}s`;
        },
      },
    },
  ],
  size: 'mini',
  height: 644,
  toolbarConfig: {
    refresh: false,
    custom: false,
    zoom: false,
  },
  proxyConfig: {
    ajax: {
      query: async ({ page }) => {
        return await selectApi({ schedulerJobId: props.schedulerJobId }, page);
      },
    },
  },
};

const [Grid] = useVbenVxeGrid({
  gridOptions,
});
</script>

<template>
  <Grid />
</template>
