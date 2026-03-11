/**
 * 格式化文件大小, 输出成带单位的字符串
 * @method formatSize
 * @grammar formatSize( size ) => String
 * @grammar formatSize( size, pointLength ) => String
 * @grammar formatSize( size, pointLength, units ) => String
 * @param size 文件大小
 * @param pointLength 精确到的小数点数。
 * @example
 * console.log( formatSize( 100 ) );    // => 100B
 * console.log( formatSize( 1024 ) );    // => 1.00K
 * console.log( formatSize( 1024, 0 ) );    // => 1K
 * console.log( formatSize( 1024 * 1024 ) );    // => 1.00M
 * console.log( formatSize( 1024 * 1024 * 1024 ) );    // => 1.00G
 * console.log( formatSize( 1024 * 1024 * 1024, 0, ['B', 'KB', 'MB'] ) );    // => 1024MB
 */
export function formatSize(size: number, pointLength = 2): string {
  let unit: string | undefined;

  const units = ['B', 'K', 'M', 'G', 'TB'];

  // eslint-disable-next-line no-cond-assign
  while ((unit = units.shift()) && size >= 1024) {
    size = size / 1024;
  }

  return (
    (unit === 'B' ? size : size.toFixed(pointLength || 2)) + (unit as string)
  );
}
