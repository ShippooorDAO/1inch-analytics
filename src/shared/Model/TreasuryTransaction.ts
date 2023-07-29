import { AssetAmount } from '../Currency/AssetAmount';
import { UsdAmount } from '../Currency/UsdAmount';
import { Asset } from './Asset';
import { Chain } from './Chain';

export enum TreasuryTransactionType {
  SPREAD_SURPLUS,
  STAKING_FEES,
  SPENDING,
  GRANT_PAYMENT,
  COLD_WALLET,
  AAVE,
  DEPOSIT,
  WITHDRAW,
  OPERATIONS_FUND,
  OPERATIONS,
  OTHER_EXPENSE,
  OTHER,
}

export interface TreasuryTransaction {
  amount: AssetAmount;
  amountUsd: UsdAmount;
  chain: Chain;
  asset: Asset;
  from: string;
  fromLabel?: string | null;
  id: string;
  timestamp: number;
  to: string;
  toLabel?: string | null;
  transactionHash: string;
  type: TreasuryTransactionType;
}
