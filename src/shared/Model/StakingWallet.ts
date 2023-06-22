export interface StakingWallet {
  id: string;
  address: string;
  delegated: boolean;
  stakingBalance: number;
  version: string;
}

export enum StakingWalletVersion {
  All = 'ALL',
  One = 'ONE',
  Two = 'TWO',
}
