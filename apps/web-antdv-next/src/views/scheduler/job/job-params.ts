import type { SchedulerJobParam } from '#/api';

/**
 * 校验定时任务参数 JSON 字符串
 */
export function validateSchedulerJobParams(value?: string): boolean {
  if (!value || value.trim() === '' || value.trim() === '[]') {
    return true;
  }
  try {
    const parsed = JSON.parse(value) as SchedulerJobParam[];
    if (!Array.isArray(parsed)) {
      return false;
    }
    return parsed.every((item) => {
      if (!item?.type) {
        return false;
      }
      if (item.value === undefined || item.value === null) {
        return false;
      }
      if (item.type === 'JSON' && item.value.trim()) {
        try {
          JSON.parse(item.value);
        } catch {
          return false;
        }
      }
      return true;
    });
  } catch {
    return false;
  }
}

/**
 * 格式化参数列展示
 */
export function formatSchedulerJobParams(
  value?: string,
  maxLength = 40,
): string {
  if (!value || value.trim() === '' || value.trim() === '[]') {
    return '-';
  }
  try {
    const parsed = JSON.parse(value) as SchedulerJobParam[];
    if (!Array.isArray(parsed) || !parsed.length) {
      return '-';
    }
    const summary = parsed
      .map((item) => {
        let displayValue = item.value ?? '';
        if (item.type === 'JSON') {
          displayValue = displayValue.replace(/\s+/g, '');
        }
        if (displayValue.length > 12) {
          displayValue = `${displayValue.slice(0, 12)}...`;
        }
        return `${item.type}:${displayValue}`;
      })
      .join(', ');
    if (summary.length > maxLength) {
      return `${summary.slice(0, maxLength)}...`;
    }
    return summary;
  } catch {
    return value;
  }
}
