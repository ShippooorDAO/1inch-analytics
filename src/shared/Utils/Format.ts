// @ts-ignore
import { BigNumber, utils } from 'ethers';
import numberAbbreviate from 'number-abbreviate';

const bigNumberDecimalPlaces = 18;

export function getAddressShorthand(account: string) {
  return `${account.substring(0, 6)}...${account.substring(38, 42)}`;
}

function toExactString(n: BigNumber | bigint) {
  return utils.formatUnits(n, bigNumberDecimalPlaces);
}

function toUsdString(n: BigNumber | bigint) {
  return utils.formatUnits(n, 18);
}

function toDisplayString(n: BigNumber | bigint) {
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

export function getTransactionUniqueIdentifier(id: string) {
  const index = id.lastIndexOf('-');

  return id.substring(index + 1);
}

type Options = {
  abbreviate?: boolean;
  symbol?: string;
  decimals?: number;
  delta?: boolean;
};

export function format(
  value?: number | string | BigNumber | bigint | null,
  { symbol, decimals, abbreviate, delta }: Options = { decimals: 2 }
): string {
  let formatDecimals = decimals;
  let formatValue = value;
  formatDecimals = formatDecimals ?? 2;

  if (formatValue === undefined || formatValue === null) {
    return '-';
  }
  if ((formatValue < 1000 || formatValue < -1000) && abbreviate) {
    formatDecimals = 0;
  }
  if (typeof formatValue === 'string') {
    formatValue = Number(formatValue);
  }

  if (
    (abbreviate && formatValue instanceof BigNumber) ||
    typeof formatValue === 'bigint'
  ) {
    formatValue = Number(toExactString(formatValue));
  }

  const prefix = delta ? (formatValue > 0 ? '+' : '') : '';

  if (symbol === 'USD') {
    if (abbreviate && (formatValue >= 1000 || formatValue <= -1000)) {
      return `${prefix}$${numberAbbreviate(formatValue, formatDecimals)}`;
    }
    if (formatValue instanceof BigNumber || typeof formatValue === 'bigint') {
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
    if (abbreviate && (formatValue >= 1000 || formatValue <= -1000)) {
      return `${prefix}${numberAbbreviate(formatValue, formatDecimals)}%`;
    }
    if (formatValue instanceof BigNumber || typeof formatValue === 'bigint') {
      formatValue = Number(toExactString(formatValue));
    }
    return `${prefix}${(formatValue * 100).toFixed(formatDecimals)}%`;
  }

  let roundedLocalizedValue;
  if (abbreviate && formatValue >= 1000) {
    roundedLocalizedValue = numberAbbreviate(value, formatDecimals);
  } else if (
    formatValue instanceof BigNumber ||
    typeof formatValue === 'bigint'
  ) {
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

export function formatDelta(delta?: number, symbol?: string) {
  if (!delta) {
    return '-';
  }
  const plusOrMinus = delta > 0 ? '+' : '';
  return `${plusOrMinus}${format(delta, { symbol })}`;
}
