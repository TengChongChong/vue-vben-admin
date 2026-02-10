<script lang="ts" setup>
import type {
  HostInfo,
  JavaInfo,
  JavaRuntimeInfo,
  JavaSpecInfo,
  JvmInfo,
  JvmSpecInfo,
  OsInfo,
  RuntimeInfo,
  UserInfo,
} from '#/api';

import { onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Card, Descriptions, DescriptionsItem } from 'ant-design-vue';

import {
  getHostInfoApi,
  getJavaInfoApi,
  getJavaRuntimeInfoApi,
  getJavaSpecInfoApi,
  getJvmInfoApi,
  getJvmSpecInfoApi,
  getOsInfoApi,
  getRuntimeInfoApi,
  getSysStatusUserInfoApi,
} from '#/api';
import { formatSize } from '#/util/format';

const jvmSpecInfo = ref<JvmSpecInfo>();
const jvmInfo = ref<JvmInfo>();
const javaSpecInfo = ref<JavaSpecInfo>();
const javaInfo = ref<JavaInfo>();
const javaRuntimeInfo = ref<JavaRuntimeInfo>();
const osInfo = ref<OsInfo>();
const userInfo = ref<UserInfo>();
const hostInfo = ref<HostInfo>();
const runtimeInfo = ref<RuntimeInfo>();

onMounted(() => {
  loadData();
});

setInterval(async () => {
  runtimeInfo.value = await getRuntimeInfoApi();
}, 1000 * 10);

async function loadData() {
  jvmSpecInfo.value = await getJvmSpecInfoApi();
  jvmInfo.value = await getJvmInfoApi();
  javaSpecInfo.value = await getJavaSpecInfoApi();
  javaInfo.value = await getJavaInfoApi();
  javaRuntimeInfo.value = await getJavaRuntimeInfoApi();
  osInfo.value = await getOsInfoApi();
  userInfo.value = await getSysStatusUserInfoApi();
  hostInfo.value = await getHostInfoApi();
  runtimeInfo.value = await getRuntimeInfoApi();
}
</script>

<template>
  <Page>
    <Card :bordered="false" class="!mb-4" title="内存">
      <Descriptions :column="4" :label-style="{ width: `160px` }" bordered>
        <DescriptionsItem label="Max Memory">
          {{ formatSize(runtimeInfo?.maxMemory, 1) }}
        </DescriptionsItem>
        <DescriptionsItem label="Total Memory">
          {{ formatSize(runtimeInfo?.totalMemory) }}
        </DescriptionsItem>
        <DescriptionsItem label="Free Memory">
          {{ formatSize(runtimeInfo?.freeMemory) }}
        </DescriptionsItem>
        <DescriptionsItem label="Usable Memory">
          <span>
            {{ formatSize(runtimeInfo?.usableMemory) }}
          </span>
        </DescriptionsItem>
      </Descriptions>
    </Card>

    <Card :bordered="false" class="!mb-4" title="JAVA">
      <Descriptions :column="2" :label-style="{ width: `290px` }" bordered>
        <DescriptionsItem label="Java Virtual Machine Specification">
          {{ jvmSpecInfo?.name }} {{ jvmSpecInfo?.version }}
          {{ jvmSpecInfo?.vendor }}
        </DescriptionsItem>

        <DescriptionsItem label="Java Virtual Machine Implementation">
          {{ jvmInfo?.name }} {{ jvmInfo?.version }} {{ jvmInfo?.vendor }}
          {{ jvmInfo?.info }}
        </DescriptionsItem>

        <DescriptionsItem label="Java Specification">
          {{ javaSpecInfo?.name }} {{ javaSpecInfo?.version }}
          {{ javaSpecInfo?.vendor }}
        </DescriptionsItem>

        <DescriptionsItem label="Java Implementation">
          <a :href="javaInfo?.vendorURL" target="_blank">
            {{ javaInfo?.vendor }} {{ javaInfo?.version }}
          </a>
        </DescriptionsItem>

        <DescriptionsItem :span="2" label="Java Runtime">
          Java Runtime Name: {{ javaRuntimeInfo?.name }} <br />
          Java Runtime Version: {{ javaRuntimeInfo?.version }} <br />
          Java Home Dir: {{ javaRuntimeInfo?.homeDir }} <br />
          Java Endorsed Dirs: {{ javaRuntimeInfo?.endorsedDirs }} <br />
          Java Class Version: {{ javaRuntimeInfo?.classVersion }} <br />
        </DescriptionsItem>
      </Descriptions>
    </Card>
    <Card :bordered="false" title="系统信息">
      <Descriptions :column="2" :label-style="{ width: `160px` }" bordered>
        <DescriptionsItem label="OS">
          {{ osInfo?.name }} {{ osInfo?.arch }} {{ osInfo?.version }}
        </DescriptionsItem>
        <DescriptionsItem label="User Name">
          {{ userInfo?.name }}
        </DescriptionsItem>
        <DescriptionsItem label="User Current Dir">
          {{ userInfo?.currentDir }}
        </DescriptionsItem>
        <DescriptionsItem label="Host Address">
          {{ hostInfo?.address }}
        </DescriptionsItem>
      </Descriptions>
    </Card>
  </Page>
</template>
