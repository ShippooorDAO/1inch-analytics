import { AssetAmount } from '../Currency/AssetAmount';
import { UsdAmount } from '../Currency/UsdAmount';
import { Asset } from './Asset';

export interface TreasuryBalances {
  positions: {
    id: string;
    asset: Asset | undefined;
    amount: AssetAmount | null;
    amountUsd: UsdAmount | null;
    share: number;
  }[];
  totalValueUsd: UsdAmount | null;
}
