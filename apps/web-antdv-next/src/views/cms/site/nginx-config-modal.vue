<script lang="ts" setup>
import type { CmsSite } from '#/api';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useClipboard } from '@vueuse/core';
import { Button, message, Space, Switch } from 'antdv-next';

import { ButtonClose } from '#/components/button';
import { LucideCopy } from '#/components/icons';

const { copy } = useClipboard();

const site = ref<CmsSite | null>(null);
const useHttps = ref(true);

const modalTitle = computed(() => {
  return `Nginx 配置 - ${site.value?.name || '站点'}`;
});

function resolveCertDirName(domainName: string) {
  return domainName.replace(/^www\./i, '') || 'example.com';
}

function buildStaticLocationBlocks() {
  return String.raw`    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?)$ {
        expires 30d;
        access_log off;
    }

    location ~* \.html$ {
        add_header Cache-Control "no-cache";
    }

    location / {
        try_files $uri $uri/ =404;
    }

    error_page 404 /404.html;`;
}

function buildNginxConfig(item: CmsSite, httpsEnabled = true) {
  const serverName = item.domainName?.trim() || 'www.example.com';
  const rootPath =
    item.deploymentPath?.trim() ||
    `/data/easy-vben/cms-sites/${item.id || '{siteId}'}`;
  const locations = buildStaticLocationBlocks();

  if (!httpsEnabled) {
    return `# CMS 站点独立域名静态托管示例（仅 HTTP）
# 复制为 cms-site.conf 并按站点修改 server_name、root。
#
# 站点：${item.name || '-'}
# 约定：cms_site.deployment_path = ${rootPath}
# 发布完成后目录结构：
#   index.html
#   404.html
#   page/
#   column/
#   article/
#   assets/          # 主题静态资源（releaseAssets 拷贝）

server {
    listen 80;
    server_name ${serverName};

    root ${rootPath};
    index index.html;

${locations}
}
`;
  }

  const certDir = resolveCertDirName(serverName);

  return `# CMS 站点独立域名静态托管示例（HTTPS）
# 复制为 cms-site.conf 并按站点修改 server_name、root、证书路径。
#
# 站点：${item.name || '-'}
# 约定：cms_site.deployment_path = ${rootPath}
# 发布完成后目录结构：
#   index.html
#   404.html
#   page/
#   column/
#   article/
#   assets/          # 主题静态资源（releaseAssets 拷贝）

server {
    listen 80;
    server_name ${serverName};
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name ${serverName};

    ssl_certificate     /path/to/nginx/cert/${certDir}.pem;
    ssl_certificate_key /path/to/nginx/cert/${certDir}.key;

    root ${rootPath};
    index index.html;

${locations}
}
`;
}

const configText = computed(() => {
  if (!site.value) {
    return '';
  }
  return buildNginxConfig(site.value, useHttps.value);
});

function handleHttpsChange(checked: boolean | number | string) {
  useHttps.value = Boolean(checked);
}

function handleCopy() {
  void copy(configText.value);
  message.success('复制成功');
}

const [Modal, modalApi] = useVbenModal({
  onOpenChange: async (isOpen: boolean) => {
    if (isOpen) {
      const data = modalApi.getData() as CmsSite;
      site.value = data;
      useHttps.value = true;
    }
  },
});
</script>

<template>
  <Modal class="w-[720px]" :title="modalTitle">
    <div class="mb-3 flex flex-wrap items-center justify-between gap-3">
      <p class="mb-0 text-sm text-gray-500">
        复制后保存为 cms-site.conf，并按实际路径修改后纳入 Nginx 配置即可。
      </p>
      <div class="flex shrink-0 items-center gap-2 text-sm">
        <span>启用 HTTPS</span>
        <Switch
          :checked="useHttps"
          checked-children="是"
          un-checked-children="否"
          @change="handleHttpsChange" />
      </div>
    </div>
    <div class="relative">
      <div class="absolute top-3 right-3 z-10">
        <Button size="small" type="primary" @click="handleCopy">
          <template #icon>
            <LucideCopy />
          </template>
          复制
        </Button>
      </div>
      <pre
        class="max-h-[60vh] overflow-auto rounded-lg bg-gray-900 p-4 pr-20 text-xs leading-5 text-gray-100">{{ configText }}</pre>
    </div>

    <template #footer>
      <Space>
        <ButtonClose @click="modalApi.close()" />
      </Space>
    </template>
  </Modal>
</template>
