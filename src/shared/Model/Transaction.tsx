import { SwapHoriz } from '@mui/icons-material';

export enum TransactionType {
  SWAP = 'swap',
}

const transactionTypes = [
  {
    id: TransactionType.SWAP,
    name: 'Swap',
    Icon: SwapHoriz,
  },
];

export function getTransactionTypeStaticDataById(id: string) {
  return transactionTypes.find((transactionType) => transactionType.id === id);
}

export function getAllTransactionTypes() {
  return transactionTypes.map((transactionType) => ({ ...transactionType }));
}

/**
 * TODO: Determine what structure we want for the transaction data
 * Ask for a Dune query that will provide this.
 */
export interface Transaction {
  id: string;
  transactionHash: string;
  timestamp: number;
  type: string;
  blockNumber: number;
  sender: string;
  amountIn: string;
  amountOut: string;
  gasPrice: string;
  gasUsed: string;
  gasPriceUsd: string;
}
