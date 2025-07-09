/**
 * 格式化数字，添加前导零
 * @example
 * addNumberLeadingZero(1)  // 01
 * addNumberLeadingZero(10) // 10
 */
export function addNumberLeadingZero(n: number | string): string {
  return Number(n) >= 10 ? `${n}` : `0${n}`;
}

/**
 * 格式化数字，添加千位分隔符
 * @example
 * formatNumber(1000000)    // 1,000,000
 * formatNumber(1000000000) // 1,000,000,000
 */
export function formatNumberWithCommas(n: number | string): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
