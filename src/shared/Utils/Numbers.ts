import { BigNumber } from 'ethers';

export function parseBigDecimalToBigNumber(value: string, decimals: number) {
  const [intPart, decimalPart] = value.split('.');
  let str: string;

  if (!intPart && !decimalPart) {
    return null;
  }
  if (!decimalPart) {
    const padding = [];
    for (let i = 0; i < decimals; i += 1) {
      padding.push('0');
    }
    str = `${intPart}${padding.join('')}`;
  } else if (!intPart || intPart.length === 0 || intPart === '0') {
    str = `${decimalPart.slice(0, decimals).padEnd(decimals, '0')}`;
  } else {
    str = `${intPart}${decimalPart.slice(0, decimals).padEnd(decimals, '0')}`;
  }
  if (str === '') {
    `wrong input: ${console.log(value)}`;
  }
  return BigNumber.from(str);
}
