import { ChainId } from './Chain';

export interface FusionResolver {
  id: string;
  address: string;
  name: string;
  description?: string;
  imageUrl: string;
  color: string;
  isVerified?: boolean;
}

export const duneResolversMapping = [
  {
    duneResolver: '1inch Labs',
    address: '0xf63392356a985ead50b767a3e97a253ff870e91a',
    chainId: ChainId.ETHEREUM,
  },
  {
    duneResolver: 'Laertes',
    address: '0xb2153caa185484fd377f488d89143a7fd76695ce',
    chainId: ChainId.ETHEREUM,
  },
  {
    duneResolver: 'Arctic Bastion',
    address: '0xa260f8b7c8f37c2f1bc11b04c19902829de6ac8a',
    chainId: ChainId.ETHEREUM,
  },
  {
    duneResolver: 'The T Resolver',
    address: '0xd7f6f541d4210550ca56f7b4c4a549efd4cafb49',
    chainId: ChainId.ETHEREUM,
  },
  {
    duneResolver: 'Seawise',
    address: '0xe023f53f735c196e4a028233c2ee425957812a41',
    chainId: ChainId.ETHEREUM,
  },
  {
    duneResolver: 'The Open DAO resolver',
    address: '0xcfa62f77920d6383be12c91c71bd403599e1116f',
    chainId: ChainId.ETHEREUM,
  },
  {
    duneResolver: 'OTEX',
    address: '0xc975671642534f407ebdcaef2428d355ede16a2c',
    chainId: ChainId.ETHEREUM,
  },
  {
    duneResolver: 'Kinetex Labs Resolver',
    address: '0xee230dd7519bc5d0c9899e8704ffdc80560e8509',
    chainId: ChainId.ETHEREUM,
  },
  {
    duneResolver: 'Spider Labs',
    address: '0x21b7db78e76dcd100f717206ee655daab2de118c',
    chainId: ChainId.ETHEREUM,
  },
  {
    duneResolver: 'Alpha', // AlphaResolver
    address: '0x754bcbaf851f94ca0065d0d06d53b168daab17b8',
    chainId: ChainId.ETHEREUM,
  },
  {
    duneResolver: 'Rosato L.L.C',
    address: '0x12e5ceb5c14f3a1a9971da154f6530c1cf7274ac',
    chainId: ChainId.ETHEREUM,
  },
  {
    duneResolver: 'Resolver 0xaf38..d2af',
  },
  {
    duneResolver: 'Resolver 0xa621..b902',
  },
  {
    duneResolver: 'Other',
  },
];

export function getResolverAddressFromDuneResolverName(
  duneResolverName: string
): string | undefined {
  const resolver = duneResolversMapping.find(
    (resolver) => resolver.duneResolver === duneResolverName
  );
  return resolver?.address;
}

export function getDuneResolverNameFromResolverAddress(
  resolverAddress: string
): string | undefined {
  const resolver = duneResolversMapping.find(
    (resolver) =>
      resolver.address?.toLowerCase() === resolverAddress.toLowerCase()
  );
  return resolver?.duneResolver;
}
