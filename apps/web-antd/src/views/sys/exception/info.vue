<script lang="ts" setup>
import type { SysException } from '#/api/sys/model/sys-exception-model';

import { onMounted, ref, unref } from 'vue';
import { useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';

import { Descriptions, DescriptionsItem, TypographyText } from 'ant-design-vue';
import dayjs from 'dayjs';

import { getApi } from '#/api/sys/sys-exception';

const { currentRoute } = useRouter();
const { id } = unref(currentRoute).params;
const exceptionInfo = ref<SysException>();

const trace = ref<string[]>([]);

onMounted(() => {
  getInfo();
});

const getInfo = () => {
  getApi(id as string).then((res) => {
    // 设置标题
    // setTitle(`详情 > ${res.url}`);

    exceptionInfo.value = res;
    trace.value = [];
    // 栈转为数组
    res.trace.split('\n\t').forEach((item) => {
      trace.value.push(item);
    });
  });
};
</script>

<template>
  <Page>
    <div class="bg-background">
      <Descriptions
        :column="2"
        :label-style="{ width: `140px` }"
        bordered
        class="p-4"
      >
        <DescriptionsItem :span="2" label="错误ID">
          {{ exceptionInfo?.id }}
        </DescriptionsItem>
        <DescriptionsItem label="异常类型">
          {{ exceptionInfo?.type }}
        </DescriptionsItem>
        <DescriptionsItem label="Http Status">
          {{ exceptionInfo?.code }}
        </DescriptionsItem>
        <DescriptionsItem :span="2" label="url">
          {{ exceptionInfo?.url }}
        </DescriptionsItem>
        <DescriptionsItem label="触发用户">
          {{ exceptionInfo?.nickname }}
        </DescriptionsItem>
        <DescriptionsItem label="触发时间">
          {{ dayjs(exceptionInfo?.triggerTime).format('YYYY-MM-DD HH:mm') }}
        </DescriptionsItem>
        <DescriptionsItem :span="2" label="错误信息">
          {{ exceptionInfo?.message }}
        </DescriptionsItem>
        <DescriptionsItem :span="2" label="调用栈">
          <div v-for="(item, index) in trace" :key="index">
            <TypographyText
              :type="item.startsWith('com.easy.admin') ? 'danger' : ''"
            >
              {{ item }}
            </TypographyText>
          </div>
        </DescriptionsItem>
      </Descriptions>
    </div>
  </Page>
</template>
