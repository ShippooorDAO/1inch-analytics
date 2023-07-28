import { UsdAmount } from '../Currency/UsdAmount';
import { Chain } from './Chain';

export interface Asset {
  id: string;
  symbol: string;
  address: string;
  name: string;
  displayName: string;
  decimals: number;
  precision: bigint;
  imageUrl?: string;
  chain: Chain;
  priceUsd: UsdAmount;
}
