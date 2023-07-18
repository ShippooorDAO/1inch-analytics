const taggedAccounts: Readonly<Array<TaggedAccount>> = [
  {
    address: '0x7951c7ef839e26f63da87a42c9a87986507f1c07',
    tag: '1inch Treasury',
  },
  {
    address: '0x9a0c8ff858d273f57072d714bca7411d717501d7',
    tag: '1inch Governance Staking',
  },
  {
    address: '0x1111111254fb6c44bac0bed2854e76f90643097d',
    tag: '1inch v4 Aggregation Router',
  },
  {
    address: '0xdd9f24efc84d93deef3c8745c837ab63e80abd27',
    tag: '1inch Gov Leftover Exchanger',
  },
  {
    address: '0x28c6c06298d514db089934071355e5743bf21d60',
    tag: 'Binance 14',
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
