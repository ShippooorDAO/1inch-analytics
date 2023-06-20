import { Chain } from './Chain';

export interface FusionTrader {
  id: string;
  address: string;
  chain: Chain;
  transactionCount: number;
  volumeUsd: number;
}
