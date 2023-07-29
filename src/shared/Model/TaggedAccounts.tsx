import {
  AGGREGATION_ROUTER_V4_ADDRESS,
  GOV_LEFTOVER_EXCHANGER_ADDRESS,
  GOV_STAKING_ADDRESS,
  TREASURY_ADDRESS_ARBITRUM,
  TREASURY_ADDRESS_ETHEREUM,
} from '../Constants';

const taggedAccounts: Readonly<Array<TaggedAccount>> = [
  {
    address: TREASURY_ADDRESS_ETHEREUM,
    tag: '1inch Treasury',
  },
  {
    address: TREASURY_ADDRESS_ARBITRUM,
    tag: '1inch Treasury',
  },
  {
    address: GOV_STAKING_ADDRESS,
    tag: '1inch Governance Staking',
  },
  {
    address: AGGREGATION_ROUTER_V4_ADDRESS,
    tag: '1inch v4 Aggregation Router',
  },
  {
    address: GOV_LEFTOVER_EXCHANGER_ADDRESS,
    tag: '1inch Gov Leftover Exchanger',
  },
  {
    address: '0x28c6c06298d514db089934071355e5743bf21d60',
    tag: 'Binance 14',
  },
  {
    address: '0x45e84e10e8E85c583C002A40007D10629EF80fAF'.toLowerCase(),
    tag: '1inch Governance Incentives',
  },
];

interface TaggedAccount {
  address: string;
  tag: string;
  image?: string;
}

export function getTaggedAccount(address: string): TaggedAccount | undefined {
  return taggedAccounts.find((account) => account.address === address);
}
