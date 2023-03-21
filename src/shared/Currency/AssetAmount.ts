import { ethers } from 'ethers';

import { format } from '@/shared/Utils/Format';

import { Asset } from '../Model/Asset';
import { CurrencyAmount } from './CurrencyAmount';
import { UsdAmount } from './UsdAmount';

export class AssetAmount implements CurrencyAmount {
  readonly n: bigint;

  readonly symbol = this.asset.symbol;

  constructor(
    readonly value: number | string | bigint,
    readonly asset: Asset,
    readonly priceUsd: UsdAmount,
    readonly isDebt?: boolean
  ) {
    if (typeof value === 'string') {
      this.n = BigInt(value);
    } else if (typeof value === 'number') {
      this.n = BigInt(Math.floor(value * 10 ** this.asset.decimals));
    } else {
      this.n = value;
    }
  }

  toExactString(): string {
    return ethers.utils.formatUnits(this.n, this.asset.decimals);
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
    let outputDecimals = decimals || 2;
    const num = this.toNumber();
    if (num < 1 / 10 ** outputDecimals) {
      outputDecimals *= 2;
    }
    includeSymbol = includeSymbol ?? true;
    return format(num, {
      symbol: includeSymbol ? this.symbol : undefined,
      decimals: outputDecimals,
      abbreviate,
    });
  }

  /**
   * Converts asset amount to USD amount.
   *
   * @returns Converted asset amount.
   */
  toUsd(): UsdAmount {
    return this.toUsdInternal(this.priceUsd);
  }

  /**
   * Converts a given USD amount to a given asset currency.
   *
   * @param assetAmount Asset to be converted
   * @param asset Asset currency to convert to
   * @returns Converted asset amount.
   */
  static fromUsd(usdAmount: UsdAmount, asset: Asset): AssetAmount {
    return AssetAmount.fromUsdInternal(usdAmount, asset, usdAmount);
  }

  /**
   * Converts a given asset amount to another asset currency, using USD exchange rates
   * of both currencies as a bridge.
   *
   * @param assetAmount Asset to be converted
   * @param asset Asset currency to convert to
   * @param timestamp Timestamp at which exchange rate is determined, present rate is used if not specified.
   * @returns Converted asset amount.
   */
  static fromAsset(assetAmount: AssetAmount, asset: Asset): AssetAmount {
    if (assetAmount.asset.symbol === asset.symbol) {
      return assetAmount;
    }

    const usdAmount = assetAmount.toUsd();
    return AssetAmount.fromUsd(usdAmount, asset);
  }

  /**
   * Converts asset amount to another asset currency, using USD exchange rates
   * of both currencies as a bridge.
   *
   * @param asset Asset currency to convert to
   * @returns Converted asset amount.
   */
  toAsset(asset: Asset): AssetAmount {
    return AssetAmount.fromAsset(this, asset);
  }

  static fromUsdInternal(
    usdAmount: UsdAmount,
    asset: Asset,
    exchangeRate: UsdAmount
  ) {
    return new AssetAmount(
      (((usdAmount.n * exchangeRate.precision) / exchangeRate.n) *
        asset.precision) /
        usdAmount.precision,
      asset,
      exchangeRate
    );
  }

  private toUsdInternal(exchangeRate: UsdAmount) {
    return new UsdAmount(
      (((this.n * exchangeRate.n) / exchangeRate.precision) *
        exchangeRate.precision) /
        this.asset.precision
    );
  }
}
