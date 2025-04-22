import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

import 'dayjs/locale/zh-cn';

dayjs.locale('zh-cn');
dayjs.extend(relativeTime);
dayjs.extend(duration);

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const DATE_FORMAT = 'YYYY-MM-DD';

export function formatToDateTime(
  date?: dayjs.ConfigType,
  format = DATE_TIME_FORMAT,
): string {
  if (!date) {
    return null;
  }
  return dayjs(date).format(format);
}

export function formatToDate(
  date?: dayjs.ConfigType,
  format = DATE_FORMAT,
): string {
  if (!date) {
    return null;
  }
  return dayjs(date).format(format);
}

export function formatToNow(
  date: Date | dayjs.Dayjs | undefined = undefined,
): string {
  if (isLongAgo(date)) {
    return dayjs(date).format('YYYY-MM-DD HH:mm');
  }
  return dayjs(date).fromNow();
}

/**
 * 时长
 *
 * @param duration 时长，单位：秒
 */
export function formatToDuration(duration: number) {
  if (duration < 60 * 60) {
    return dayjs.duration(duration * 1000).format('mm:ss');
  } else if (duration < 60 * 60 * 24) {
    return dayjs.duration(duration * 1000).format('HH:mm:ss');
  } else if (duration < 60 * 60 * 24 * 30) {
    return dayjs.duration(duration * 1000).format('D天HH:mm:ss');
  } else {
    return dayjs.duration(duration * 1000).format('M月D天');
  }
}

function isLongAgo(date: Date | dayjs.Dayjs | undefined = undefined) {
  return dayjs(new Date()).diff(date) > 60 * 60 * 24 * 30;
}
