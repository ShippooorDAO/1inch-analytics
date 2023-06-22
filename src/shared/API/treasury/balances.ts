import { ChainId } from '@/shared/Model/Chain';

import { getMockBalances } from './mocks/balances';

/**
 * https://docs.1inch.io/docs/governance/dao-treasury/#1inch-dao-treasury-addresses
 */
const treasuryWallets = [
  {
    address: '0x7951c7ef839e26F63DA87a42C9a87986507f1c07',
    chainId: ChainId.ETHEREUM,
    description:
      'Primary DAO treasury. SafeSnap allows for trustless execution of spending proposals',
  },
  {
    address: '0x71890aC6209Fae61E9D66691c47B168B8300a7c5',
    chainId: ChainId.ARBITRUM,
    description: '1inch DAO operations fund. This is a 3-of-4 multisig.',
  },
  {
    address: '0x422B530b30210A1A4C77Bf1aDCd3352b0DfbCDc0',
    chainId: ChainId.GNOSIS,
  },
  {
    address: '0x0A777DCD3F7924AD769aB2026b2Bb377bD08F4CA',
    chainId: ChainId.POLYGON,
  },
  {
    address: '0x32865f542bE59b39dEAD7FAda7555734c3305786',
    chainId: ChainId.AURORA,
  },
  {
    address: '0x5ef96E97e25dB95B906d56A0A517a6c407FD4083',
    chainId: ChainId.AVALANCHE,
  },
  {
    address: '0xdCBc42C20B7296BfEA6E47b8D88AdD4f69a6DCCB',
    chainId: ChainId.OPTIMISM,
  },
  {
    address: '0xb946a9FD3935F3A6364F822e814a15E14b841e67',
    chainId: ChainId.BSC,
  },
];

export async function getOneInchTreasuryWalletsBalances() {
  if (process.env.NEXT_PUBLIC_ENABLE_MOCK_TREASURY_BALANCES === 'true') {
    return getMockBalances();
  }
  // TODO: Implement this.
  return [];
}
