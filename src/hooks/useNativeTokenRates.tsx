import { useEffect, useMemo, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import useSWR from 'swr';

type NativeTokenRatesResponse = {
  [key: string]: {
    USD: number;
  };
};

type StringResults = {
  fast?: string;
  instant?: string;
  standard?: string;
};

type GasObjectResult = {
  maxPriorityFeePerGas: string;
  maxFeePerGas: string;
};

type ObjectResults = {
  baseFee?: string;
  low?: GasObjectResult;
  medium?: GasObjectResult;
  high?: GasObjectResult;
  instant?: GasObjectResult;
};

type GasPriceChainMessage = {
  id?: string;
  method?: string;
  event?: string;
  result: StringResults | ObjectResults;
};

type GasPrice = {
  displayText: string;
  gwei: number;
};

export type ChainGasPrice = {
  chainId: number;
  gasTokenPriceUsd: number;
  gasPrices: GasPrice[];
};

function buildGasPrices(gasPriceMessage: GasPriceChainMessage): GasPrice[] {
  return Object.entries(gasPriceMessage.result)
    .filter(([key, _value]) => key !== 'baseFee')
    .map(([key, value]) => {
      if (typeof value === 'string') {
        return {
          displayText: key,
          gwei: parseInt(value, 10) / 1e9,
        };
      }

      const gwei = parseInt(value.maxFeePerGas, 10) / 1e9;

      return {
        displayText: key,
        gwei,
      };
    });
}

function parseRatesResponse(
  nativeTokenRatesResponse: NativeTokenRatesResponse,
  messageHistory: GasPriceChainMessage[]
): ChainGasPrice[] {
  return Object.entries(nativeTokenRatesResponse).map(
    ([chainId, tokenPrice]) => {
      const chain = parseInt(chainId, 10);

      const matchingGasMessage = messageHistory.find((message) =>
        message.id?.includes(`updateGasPriceChain${chainId}`)
      );

      if (!matchingGasMessage) {
        return {
          chainId: chain,
          gasTokenPriceUsd: tokenPrice.USD,
          gasPrices: [],
        };
      }

      const gasPrices = buildGasPrices(matchingGasMessage);

      return {
        chainId: chain,
        gasTokenPriceUsd: tokenPrice.USD,
        gasPrices,
      };
    }
  );
}

function httpFetcher(url: string) {
  return fetch(url).then((res) => res.json());
}

interface UseNativeTokenRatesProps {
  chainId?: number;
}

export function useNativeTokenRates({ chainId }: UseNativeTokenRatesProps) {
  const [messageHistory, setMessageHistory] = useState<GasPriceChainMessage[]>(
    []
  );

  const nativeTokenRatesQueryContext = useSWR<NativeTokenRatesResponse>(
    'https://token-rates-aggregator.1inch.io/v1.0/native-token-rate?vs=USD',
    httpFetcher
  );

  const { sendMessage, lastMessage } = useWebSocket(
    chainId ? `wss://gas-price-api.1inch.io/ws/${chainId}` : null
  );

  useEffect(() => {
    setMessageHistory([]);
  }, [chainId]);

  useEffect(() => {
    if (lastMessage?.data) {
      const newMessage: GasPriceChainMessage = JSON.parse(lastMessage?.data);
      let newMessages: GasPriceChainMessage[] = [];
      const newMessageId = newMessage.method
        ? newMessage.method
        : newMessage.event;

      if (
        messageHistory.findIndex((message) => message.id === newMessageId) >= 0
      ) {
        newMessages = messageHistory.map((message) => {
          if (message.event === newMessage.event) {
            return {
              ...newMessage,
              id: newMessageId,
            };
          }

          return message;
        });
      } else if (newMessageId?.includes('getGasPriceChain')) {
        newMessages = messageHistory.concat({
          ...newMessage,
          id: newMessageId.replace('getGasPriceChain', 'updateGasPriceChain'),
        });
      } else if (newMessageId?.includes('updateGasPriceChain')) {
        newMessages = messageHistory.concat({
          ...newMessage,
          id: newMessageId,
        });
      } else {
        newMessages = messageHistory;
      }

      setMessageHistory(newMessages);
    }
  }, [lastMessage]);

  const gasCost = useMemo(() => {
    if (!nativeTokenRatesQueryContext.data || messageHistory.length === 0) {
      return undefined;
    }

    return parseRatesResponse(
      nativeTokenRatesQueryContext.data,
      messageHistory
    );
  }, [nativeTokenRatesQueryContext.data, messageHistory]);

  return {
    data: gasCost,
    loading: nativeTokenRatesQueryContext.isLoading,
    sendMessage,
  };
}
