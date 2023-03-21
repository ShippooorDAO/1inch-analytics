import { AssetStore } from '../Model/Stores/AssetStore';
import { AssetAmount } from './AssetAmount';
import { UsdAmount } from './UsdAmount';

function numberIsValid(value: string | number | bigint): boolean {
  if (typeof value === 'string') {
    if (value === '') {
      return false;
    }
  }

  if (typeof value === 'number') {
    if (
      Number.isNaN(value) ||
      (value === Number.POSITIVE_INFINITY && value === Number.NEGATIVE_INFINITY)
    ) {
      return false;
    }
  }

  return true;
}

export class AssetService {
  constructor(readonly store: AssetStore) {}

  createUsdAmount(
    value: string | number | bigint | UsdAmount
  ): UsdAmount | null {
    if (value instanceof UsdAmount) {
      return value;
    }

    if (!numberIsValid(value)) {
      return null;
    }

    return new UsdAmount(value);
  }

  createAssetAmount(
    balance: string | number | bigint,
    assetIdOrSymbol: string,
    priceUsd?: string | number | bigint | UsdAmount
  ) {
    if (!numberIsValid(balance)) {
      return null;
    }

    const asset =
      this.store.getById(assetIdOrSymbol) ??
      this.store.getBySymbol(assetIdOrSymbol);

    if (!asset) {
      throw new Error('Invalid asset id or symbol.');
    }

    const priceUsd_ = this.createUsdAmount(priceUsd ?? 0);

    if (priceUsd_ === null) {
      throw new Error('Invalid price USD.');
    }

    return new AssetAmount(balance, asset, priceUsd_);
  }
}
