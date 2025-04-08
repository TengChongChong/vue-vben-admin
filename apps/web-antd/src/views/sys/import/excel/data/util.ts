const ENGLISH_LETTER_ARRAY = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
];

/**
 * 获取单元格索引
 *
 * @param index index
 */
export function getCellIndex(index: number): string {
  if (index < 26) {
    return ENGLISH_LETTER_ARRAY[index];
  }
  return `${getCellIndex(Math.floor(index / 26) - 1)}${getCellIndex(index % 26)}`;
}
