import { ethers } from 'ethers';

import { format } from '@/shared/Utils/Format';

import { CurrencyAmount } from './CurrencyAmount';

export class UsdAmount implements CurrencyAmount {
  readonly symbol = 'USD';

  readonly n: bigint;

  readonly decimals = 18;

  readonly precision = BigInt(1e18);

  constructor(value: number | string | bigint) {
    if (typeof value === 'string') {
      this.n = BigInt(value);
    } else if (typeof value === 'number') {
      this.n = BigInt(Math.floor(value * 1e18));
    } else {
      this.n = value;
    }
  }

  toExactString(): string {
    return ethers.utils.formatUnits(this.n, 18);
  }

  toNumber(): number {
    return Number(this.toExactString());
  }

  toDisplayString(
    {
      abbreviate,
      decimals,
      includeSymbol,
    }: { abbreviate?: boolean; decimals?: number; includeSymbol?: boolean } = {
      decimals: 2,
      abbreviate: false,
      includeSymbol: true,
    }
  ): string {
    includeSymbol = includeSymbol ?? true;

    return format(this.toNumber(), {
      symbol: includeSymbol ? 'USD' : undefined,
      decimals,
      abbreviate,
    });
  }
}
