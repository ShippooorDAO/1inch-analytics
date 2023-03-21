import { AssetAmount } from '@/shared/Currency/AssetAmount';

import { UsdAmount } from '../Currency/UsdAmount';
import { Asset } from './Asset';

export interface Oracle {
  id: string;
  assetA: Asset;
  assetB: Asset;
}

export interface TokenHolder {
  id: string;
  address: string;
  tag?: string;
  balance: AssetAmount;
  share: number;
}

export interface Pool {
  id: string;
  name: string;
  address: string;
  link: string;
  protocol: {
    name: string;
    imageUrl: string;
  };
  totalValueLockedUSD: UsdAmount;
  totalTokenLocked: AssetAmount;
  totalTokenLockedShare: number;
  balances: {
    symbol: string;
    balance: number;
  }[];
}

export interface TokenPools {
  pools: Pool[];
  totalValueLockedUsd: UsdAmount;
  totalTokenLocked?: AssetAmount;
  totalTokenLockedShare?: number;
}
