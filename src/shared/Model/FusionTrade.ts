import { Asset } from './Asset';
import { Chain } from './Chain';

export interface FusionTrade {
  id: string;
  chain: Chain;
  sourceAsset: Asset;
  destinationAsset: Asset;
  executorAddress: string;
  receiverAddress: string;
  destinationUsdAmount: number;
  sourceUsdAmount: number;
  slippage: number;
  timestamp: number;
  transactionHash: string;
}
