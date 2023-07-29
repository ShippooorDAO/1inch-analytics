import { BigNumber, utils } from 'ethers';
import numberAbbreviate from 'number-abbreviate';

import { getTaggedAccount } from '../Model/TaggedAccounts';

export function getAddressShorthand(account: string) {
  return `${account.substring(0, 6)}...${account.substring(38, 42)}`;
}

export function getWalletDisplayName(address: string) {
  const taggedAccount = getTaggedAccount(address);
  return taggedAccount?.tag ?? getAddressShorthand(address);
}

export function getTransactionUniqueIdentifier(id: string) {
  const index = id.lastIndexOf('-');

  return id.substring(index + 1);
}

const bigNumberDecimalPlaces = 18;

function toNumber(n: BigNumber | bigint | string | number) {
  if (typeof n === 'number') {
    return n;
  }
  if (typeof n === 'string') {
    return Number(n);
  }
  return Number(utils.formatUnits(n, bigNumberDecimalPlaces));
}

type Options = {
  abbreviate?: boolean;
  symbol?: string;
  decimals?: number;
  delta?: boolean;
};

function isWithinAbbreviationRange(value: number) {
  return value >= 1000 || value <= -1000;
}

export function format(
  value?: number | string | BigNumber | bigint | null,
  { symbol, decimals, abbreviate: abbreviateParam, delta }: Options = {
    decimals: 2,
  }
): string {
  let formatDecimals = decimals;
  formatDecimals = formatDecimals ?? 2;

  if (value === undefined || value === null) {
    return '-';
  }

  let formatValue = toNumber(value);
  const abbreviate = abbreviateParam && isWithinAbbreviationRange(formatValue);

  const prefix = delta ? (formatValue > 0 ? '+' : '') : '';

  if (symbol === 'USD') {
    if (abbreviate) {
      return `${prefix}$${numberAbbreviate(formatValue, formatDecimals)}`;
    }
    return `${prefix}${formatValue.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: formatDecimals,
    })}`;
  }

  if (symbol === '%') {
    if (formatValue === Number.POSITIVE_INFINITY) {
      return `${prefix}∞%`;
    }
    if (formatValue === Number.NEGATIVE_INFINITY) {
      return `${prefix}-∞%`;
    }
    if (abbreviate) {
      return `${prefix}${numberAbbreviate(formatValue, formatDecimals)}%`;
    }
    return `${prefix}${(formatValue * 100).toFixed(formatDecimals)}%`;
  }

  let roundedLocalizedValue;
  if (abbreviate) {
    roundedLocalizedValue = numberAbbreviate(value, formatDecimals);
  } else {
    roundedLocalizedValue = formatValue.toLocaleString(undefined, {
      minimumFractionDigits: formatDecimals,
      maximumFractionDigits: formatDecimals,
    });
  }

  if (symbol) {
    return `${prefix}${roundedLocalizedValue} ${symbol}`;
  }
  return `${prefix}${roundedLocalizedValue}`;
}

export function formatDelta(delta?: number, symbol?: string) {
  if (!delta) {
    return '-';
  }
  const plusOrMinus = delta > 0 ? '+' : '';
  return `${plusOrMinus}${format(delta, { symbol })}`;
}
