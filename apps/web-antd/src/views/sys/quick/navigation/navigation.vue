<script setup lang="ts">
import type { SysQuickNavigation } from '#/api/sys/model/sys-quick-navigation-model';

import { useRouter } from 'vue-router';

import { EllipsisText } from '@vben/common-ui';
import { openWindow } from '@vben/utils';

import { Icon } from '#/components/icons';

withDefaults(
  defineProps<{
    quickNavigation: SysQuickNavigation;
    showName?: boolean;
    size?: 'large' | 'middle' | 'small';
  }>(),
  {
    showName: true,
    size: 'middle',
  },
);

const router = useRouter();

function navTo(quickNavigation: SysQuickNavigation) {
  if (quickNavigation.url?.startsWith('http')) {
    openWindow(quickNavigation.url);
    return;
  }
  if (quickNavigation.url?.startsWith('/')) {
    router.push(quickNavigation.url).catch((error) => {
      console.error('Navigation failed:', error);
    });
  } else {
    console.warn(
      `Unknown URL for navigation item: ${quickNavigation.title} -> ${quickNavigation.url}`,
    );
  }
}
</script>

<template>
  <div
    :class="`quick-navigation cursor-pointer quick-navigation--${quickNavigation.color} quick-navigation--${size}`"
    @click="navTo(quickNavigation)"
  >
    <div class="quick-navigation__icon mx-auto mb-1 flex items-center p-4">
      <Icon :icon="quickNavigation.icon!" />
    </div>
    <div class="quick-navigation__name" v-if="showName">
      <EllipsisText :line="1">{{ quickNavigation.name }}</EllipsisText>
    </div>
  </div>
</template>

<style scoped lang="scss">
$quickNavigation: quick-navigation;
.#{$quickNavigation} {
  text-align: center;

  &__icon {
    color: #fff;
    border-radius: var(--radius);

    .iconify {
      margin: 0 auto;
    }
  }

  &--large {
    .#{$quickNavigation}__icon {
      width: 6.4rem;
      height: 6.4rem;
      font-size: 3rem;
    }
  }

  &--middle {
    .#{$quickNavigation}__icon {
      width: 5rem;
      height: 5rem;
      font-size: 2.2rem;
    }
  }

  &--small {
    .#{$quickNavigation}__icon {
      width: 4rem;
      height: 4rem;
      font-size: 2rem;
    }
  }

  &--pink {
    .#{$quickNavigation}__icon {
      background: #eb2f96;
    }
  }

  &--red {
    .#{$quickNavigation}__icon {
      background: #f5222d;
    }
  }

  &--orange {
    .#{$quickNavigation}__icon {
      background: #fa8c16;
    }
  }

  &--green {
    .#{$quickNavigation}__icon {
      background: #52c41a;
    }
  }

  &--cyan {
    .#{$quickNavigation}__icon {
      background: #13c2c2;
    }
  }

  &--blue {
    .#{$quickNavigation}__icon {
      background: #1677ff;
    }
  }

  &--purple {
    .#{$quickNavigation}__icon {
      background: #722ed1;
    }
  }
}
</style>
