import { AssetAmount } from '../Currency/AssetAmount';
import { UsdAmount } from '../Currency/UsdAmount';
import { Asset } from './Asset';

export interface TreasuryTransaction {
  amount: AssetAmount;
  amountUsd: UsdAmount;
  asset: Asset;
  from: string;
  id: string;
  timestamp: number;
  to: string;
  transactionHash: string;
}
