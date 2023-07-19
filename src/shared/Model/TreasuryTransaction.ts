import { AssetAmount } from '../Currency/AssetAmount';
import { UsdAmount } from '../Currency/UsdAmount';
import { Asset } from './Asset';

export enum TreasuryTransactionType {
  UNKNOWN,
  DEPOSIT,
  WITHDRAW,
  TRANSFER,
  MINT,
  BURN,
}

export enum TreasuryTransactionSubType {
  UNKNOWN,
  STAKING_REVENUE,
  AGGREGATION_ROUTER_REVENUE,
  GRANT_PAYMENT,
  OTHER,
}

export interface TreasuryTransaction {
  amount: AssetAmount;
  amountUsd: UsdAmount;
  asset: Asset;
  from: string;
  id: string;
  timestamp: number;
  to: string;
  transactionHash: string;
  type: TreasuryTransactionType;
  subType: TreasuryTransactionSubType;
}
