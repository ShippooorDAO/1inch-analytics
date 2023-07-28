import {
  ApolloClient,
  createHttpLink,
  gql,
  InMemoryCache,
  useLazyQuery,
} from '@apollo/client';
import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

export type TimedGasPrice = {
  timestamp: number;
  gasPrice: number;
};

export interface UniswapV3SubgraphProviderState {
  latestGasPrices?: TimedGasPrice[];
}

export interface GasPriceQueryResponse {
  transactions: {
    gasPrice: string;
    timestamp: string;
  }[];
}

export function processGasPriceResponse(response: GasPriceQueryResponse) {
  const transactions = response.transactions.slice();
  const gasPriceAverage =
    transactions.reduce(
      (acc, transaction) => Number(transaction.gasPrice) + acc,
      0
    ) / transactions.length;

  return response.transactions
    .reverse()
    .filter(
      (transaction) => Number(transaction.gasPrice) <= gasPriceAverage * 2
    )
    .filter((_transaction, index) => index % 25 === 0)
    .map((transaction) => {
      return {
        gasPrice: Number(transaction.gasPrice) / 1e9,
        timestamp: Number(transaction.timestamp),
      };
    });
}

const link = createHttpLink({
  uri: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3',
});

const apolloClient = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

const GAS_PRICE_QUERY = gql`
  {
    transactions(first: 1000, orderBy: timestamp, orderDirection: desc) {
      gasPrice
      timestamp
    }
  }
`;

const missingProviderError =
  'You forgot to wrap your code in a provider <UniswapV3SubgraphProvider>';

const UniswapV3SubgraphContext = createContext<UniswapV3SubgraphProviderState>({
  get latestGasPrices(): never {
    throw new Error(missingProviderError);
  },
});

interface UniswapV3SubgraphProviderProps {
  children?: ReactNode;
}

export const useUniswapV3SubgraphContext = () =>
  useContext<UniswapV3SubgraphProviderState>(UniswapV3SubgraphContext);

export const UniswapV3SubgraphProvider: FC<UniswapV3SubgraphProviderProps> = ({
  children,
}: UniswapV3SubgraphProviderProps) => {
  const [latestGasPrices, setLatestGasPrices] = useState<TimedGasPrice[]>([]);

  const [queryGasPrices, { data: gasPricesResponse, startPolling }] =
    useLazyQuery<GasPriceQueryResponse>(GAS_PRICE_QUERY, {
      fetchPolicy: 'network-only',
      client: apolloClient,
    });

  useEffect(() => {
    queryGasPrices();
    startPolling(30000);
  }, []);

  useEffect(() => {
    const response = gasPricesResponse;

    if (response === undefined) {
      return;
    }

    const gasPrices = processGasPriceResponse(response);
    setLatestGasPrices(gasPrices);
  }, [gasPricesResponse]);

  return (
    <UniswapV3SubgraphContext.Provider
      value={{
        latestGasPrices,
      }}
    >
      {children}
    </UniswapV3SubgraphContext.Provider>
  );
};
