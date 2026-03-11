import { h } from 'vue';

import { DictTag } from '#/components/dict';

export function renderDictTag(dictType: string, code: string) {
  return h(DictTag, {
    dictType,
    code,
  });
}
