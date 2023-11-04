import { gql, useQuery } from '@apollo/client';
import { useMemo } from 'react';

import { TokenHolding, TokenHoldingsQuery } from '@/gql/graphql';

const TOKEN_HOLDINGS_QUERY = gql`
  query TokenHoldings {
    tokenHoldings {
      id
      affiliation
      balance
      walletCount
    }
  }
`;

function convertResponseToModel(response: TokenHoldingsQuery): TokenHolding[] {
  return response.tokenHoldings as TokenHolding[];
}

export function useTokenHoldings() {
  const { data, loading, error } =
    useQuery<TokenHoldingsQuery>(TOKEN_HOLDINGS_QUERY);

  const tokenHoldings = useMemo(() => {
    if (!data) {
      return null;
    }

    return convertResponseToModel(data);
  }, [data]);

  return {
    tokenHoldings: tokenHoldings as TokenHolding[],
    loading,
    error,
  };
}
