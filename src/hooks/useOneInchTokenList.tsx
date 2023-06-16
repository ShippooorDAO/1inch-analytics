import useSWR from 'swr';

import { Asset } from '@/shared/Model/Asset';
import { ChainStore } from '@/shared/Model/Stores/ChainStore';

type OneInchTokenListResponse = {
  [key: string]: OneInchTokenResponse;
};

interface OneInchTokenResponse {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logoURI?: string;
  providers: string[];
  tags: string[];
  eip2612?: boolean;
  isFoT?: boolean;
}

function parseOneInchTokenListResponse(
  response: OneInchTokenListResponse,
  chainStore: ChainStore
): Asset[] {
  return [];
  // return Object.entries(response).map(([address, token]) => ({
  //   id: address,
  //   address,
  //   symbol: token.symbol,
  //   displayName: token.symbol,
  //   name: token.name,
  //   decimals: token.decimals,
  //   imageUrl: token.logoURI,
  // }));
}

export function useOneInchTokenList() {
  const { data, error, isLoading } = useSWR<OneInchTokenListResponse>(
    'https://tokens.1inch.io/v1.2/1'
  );
}
