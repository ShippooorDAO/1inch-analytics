import { ChainId } from '@/shared/Model/Chain';

export function getMockBalances() {
  return [
    {
      address: '0x7951c7ef839e26F63DA87a42C9a87986507f1c07',
      chainId: ChainId.ETHEREUM,
      balances: [
        {
          token: {
            address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
            chainId: ChainId.ETHEREUM,
            decimals: 6,
            imageUrl:
              'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48/logo.png',
            name: 'USD Coin',
            symbol: 'USDC',
            priceUsd: 1.0,
          },
          balance: 12.9e6,
          value: 12.9e6,
        },
        {
          token: {
            address: '0x111111111117dc0aa78b770fa6a738034120c302',
            chainId: ChainId.ETHEREUM,
            decimals: 18,
            imageUrl:
              'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x111111111117dc0aa78b770fa6a738034120c302/logo.png',
            name: '1inch',
            symbol: '1INCH',
            priceUsd: 0.3,
          },
          balance: 2.76e6,
          value: 2.76e6 * 0.3,
        },
        {
          token: {
            address: '0x0000000000000000000000000000000000000000',
            chainId: ChainId.ETHEREUM,
            decimals: 18,
            imageUrl:
              'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x0000000000000000000000000000000000000000/logo.png',
            name: 'Ether',
            symbol: 'ETH',
            priceUsd: 1878.86,
          },
          balance: 257.5239,
          value: 1878.86 * 257.5239,
        },
        {
          token: {
            address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
            chainId: ChainId.ETHEREUM,
            decimals: 18,
            imageUrl:
              'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x0000000000000000000000000000000000000000/logo.png',
            name: 'Ether',
            symbol: 'ETH',
            priceUsd: 1878.86,
          },
          balance: 243.452,
          value: 457.5239 * 1878.86,
        },
        {
          token: {
            address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
            chainId: ChainId.ETHEREUM,
            decimals: 18,
            imageUrl:
              'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdac17f958d2ee523a2206206994597c13d831ec7/logo.png',
            name: 'Tether',
            symbol: 'USDT',
            priceUsd: 1.0,
          },
          balance: 301984.033,
          value: 301984.033,
        },
        {
          token: {
            address: '0x6b175474e89094c44da98b954eedeac495271d0f',
            chainId: ChainId.ETHEREUM,
            decimals: 18,
            imageUrl:
              'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdac17f958d2ee523a2206206994597c13d831ec7/logo.png',
            name: 'Dai',
            symbol: 'DAI',
            priceUsd: 1.0,
          },
          balance: 197520.5939,
          value: 197520.5939,
        },
        {
          token: {
            address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
            chainId: ChainId.ETHEREUM,
            decimals: 18,
            imageUrl:
              'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdac17f958d2ee523a2206206994597c13d831ec7/logo.png',
            name: 'Wrapped Bitcoin',
            symbol: 'WBTC',
            priceUsd: 29777.0,
          },
          balance: 1.9207,
          value: 29777.0 * 1.9207,
        },
      ],
    },
    {
      address: '0x7951c7ef839e26F63DA87a42C9a87986507f1c07',
      chainId: ChainId.ARBITRUM,
      balances: [
        {
          token: {
            address: '0x912ce59144191c1204e64559fe8253a0e49e6548',
            chainId: ChainId.ARBITRUM,
            decimals: 18,
            imageUrl:
              'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/arbitrum/assets/0x912ce59144191c1204e64559fe8253a0e49e6548/logo.png',
            name: 'Arbitrum (ARB)',
            symbol: 'ARB',
            priceUsd: 1.1,
          },
          balance: 2.58e6,
          value: 2.58e6 * 1.1,
        },
        {
          token: {
            address: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
            chainId: ChainId.ARBITRUM,
            decimals: 18,
            imageUrl:
              'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/arbitrum/assets/0xff970a61a04b1ca14834a43f5de4533ebddb5cc8/logo.png',
            name: '1inch',
            symbol: '1INCH',
            priceUsd: 1,
          },
          balance: 23125.3823,
          value: 23054.04,
        },
      ],
    },
  ];
}
