const taggedAccounts: Readonly<Array<TaggedAccount>> = [];

interface TaggedAccount {
  address: string;
  tag: string;
  image: string;
}

export function getTaggedAccount(address: string): TaggedAccount | undefined {
  return taggedAccounts.find((account) => account.address === address);
}
