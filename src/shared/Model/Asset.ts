import { UsdAmount } from '../Currency/UsdAmount';
import { Chain } from './Chain';

/**
 * key: unix timestamp
 * value: Asset -> USDC exchange rate, in decimal representation
 */
export type HistoricalExchangeRates = Map<number, UsdAmount>;

export interface Asset {
  id: string;
  symbol: string;
  address: string;
  name: string;
  displayName: string;
  decimals: number;
  precision: bigint;
  imageUrl: string;
  chain: Chain;
  priceUsd: UsdAmount;
}
