import { BigNumber, utils } from 'ethers';
import numberAbbreviate from 'number-abbreviate';

import { getTaggedAccount } from '../Model/TaggedAccounts';

type TBigInt = bigint | BigNumber;

function instanceOfBigInt(value: any): value is TBigInt {
  return typeof value === 'bigint' || value instanceof BigNumber;
}

function ltEq(a: TBigInt | number, b: TBigInt | number) {
  return a <= b;
}

function gtEq(a: TBigInt | number, b: TBigInt | number) {
  return a >= b;
}

const bigNumberDecimalPlaces = 18;

export function getTransactionHashShorthand(txHash: string) {
  return `${txHash.substring(0, 14)}...`;
}

export function getWalletDisplayName(address: string) {
  const taggedAccount = getTaggedAccount(address);
  return taggedAccount?.tag ?? getAddressShorthand(address);
}

export function getAddressShorthand(account: string) {
  return `${account.substring(0, 6)}...${account.substring(38, 42)}`;
}

function toExactString(n: TBigInt) {
  return utils.formatUnits(n, bigNumberDecimalPlaces);
}

function toUsdString(n: TBigInt) {
  return utils.formatUnits(n, 18);
}

function toDisplayString(n: TBigInt) {
  const exactString = toExactString(n);
  const displayString = parseFloat(exactString).toLocaleString('en-US', {
    minimumFractionDigits: bigNumberDecimalPlaces,
    maximumFractionDigits: bigNumberDecimalPlaces,
  });

  // If the return string is -0.00 or some variant, strip the negative
  if (displayString.match(/-0\.?[0]*/)) {
    return displayString.replace('-', '');
  }

  return displayString;
}

export function formatDelta(delta?: number, symbol?: string) {
  if (!delta) {
    return '-';
  }
  const plusOrMinus = delta > 0 ? '+' : '';
  return `${plusOrMinus}${format(delta, { symbol })}`;
}

type Options = {
  abbreviate?: boolean;
  symbol?: string;
  decimals?: number;
  delta?: boolean;
};

export function format(
  value?: number | string | TBigInt | null,
  { symbol, decimals, abbreviate, delta }: Options = { decimals: 2 }
): string {
  let formatDecimals = decimals;
  let formatValue = value;
  formatDecimals = formatDecimals ?? 2;

  if (formatValue === undefined || formatValue === null) {
    return '-';
  }

  if (typeof formatValue === 'string') {
    formatValue = Number(formatValue);
  }

  if ((ltEq(formatValue, 1000) || gtEq(formatValue, -1000)) && abbreviate) {
    formatDecimals = 0;
  }

  if (abbreviate && instanceOfBigInt(formatValue)) {
    formatValue = Number(toExactString(formatValue));
  }

  const prefix = delta ? (gtEq(formatValue, 0) ? '+' : '') : '';

  if (symbol === 'USD') {
    if (abbreviate && (gtEq(formatValue, 1000) || ltEq(formatValue, -1000))) {
      return `${prefix}$${numberAbbreviate(formatValue, formatDecimals)}`;
    }
    if (instanceOfBigInt(formatValue)) {
      return `${prefix}$${toDisplayString(formatValue)}`;
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
    if (abbreviate && (gtEq(formatValue, 1000) || ltEq(formatValue, -1000))) {
      return `${prefix}${numberAbbreviate(formatValue, formatDecimals)}%`;
    }
    if (instanceOfBigInt(formatValue)) {
      formatValue = Number(toExactString(formatValue));
    }
    return `${prefix}${(formatValue * 100).toFixed(formatDecimals)}%`;
  }

  let roundedLocalizedValue;
  if (abbreviate && gtEq(formatValue, 1000)) {
    roundedLocalizedValue = numberAbbreviate(value, formatDecimals);
  } else if (instanceOfBigInt(formatValue)) {
    roundedLocalizedValue = toDisplayString(formatValue);
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
