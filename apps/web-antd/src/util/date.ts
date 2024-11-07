import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

import 'dayjs/locale/zh-cn';

dayjs.locale('zh-cn');
dayjs.extend(relativeTime);
dayjs.extend(duration);

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
