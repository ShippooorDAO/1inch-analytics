import { gql, useQuery } from '@apollo/client';
import { useMemo } from 'react';

import { TokenUnlock, TokenUnlocksQuery } from '@/gql/graphql';

const TOKEN_UNLOCKS_QUERY = gql`
  query TokenUnlocks {
    tokenUnlocks {
      id
      timestamp
      unlockAmount
      totalAmount
    }
  }
`;

function convertResponseToModel(response: TokenUnlocksQuery): TokenUnlock[] {
  return response.tokenUnlocks as TokenUnlock[];
}

export function useTokenUnlocks() {
  const { data, loading, error } =
    useQuery<TokenUnlocksQuery>(TOKEN_UNLOCKS_QUERY);

  const tokenUnlocks = useMemo(() => {
    if (!data) {
      return null;
    }

    return convertResponseToModel(data);
  }, [data]);

  return {
    tokenUnlocks: tokenUnlocks as TokenUnlock[],
    loading,
    error,
  };
}
