import { gql } from '@apollo/client';

export const GET_GLOBAL_SYSTEM = gql`
  {
    systemStatus {
      id
      message
    }
    chains {
      id
      name
      chainIdentifier
      nativeToken
    }
    assets {
      id
      address
      symbol
      chain {
        id
      }
      name
      decimals
      logoUrl
      priceUsd
      price
    }
  }
`;
