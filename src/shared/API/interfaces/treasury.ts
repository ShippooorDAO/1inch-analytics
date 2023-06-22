export interface GetTreasuryResponse {
  treasury: {
    address: string;
    chainId: number;
    balances: {
      token: {
        address: string;
        chainId: number;
        decimals: number;
        imageUrl: string;
        name: string;
        symbol: string;
        priceUsd: number;
      };
      balance: number;
      value: number;
    }[];
  }[];
}
