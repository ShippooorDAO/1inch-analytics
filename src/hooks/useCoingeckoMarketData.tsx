import { useMemo, useState } from 'react';
import useSWR from 'swr';

import { DataPoint, TimeWindow } from '@/shared/Model/Timeseries';
import { getTimeseriesOptions } from '@/shared/Utils/Chart';

type GetTokenHistoricalMarketDataResponse = {
  prices: Array<number[]>;
  market_caps: Array<number[]>;
  total_volumes: Array<number[]>;
};

type GetTokenCurrentMarketDataResponse = {
  [key: string]: {
    usd?: number;
    usd_market_cap?: number;
    usd_24h_vol?: number;
    usd_24h_change?: number;
  };
};

type HistoricalMarketData = {
  prices: DataPoint[];
  marketCaps: DataPoint[];
};

type CurrentMarketData = {
  usd?: number;
  usdMarketCap?: number;
  usd24hVol?: number;
  usd24hChange?: number;
};

type MarketData = {
  historicalMarketData: HistoricalMarketData;
  currentMarketData: CurrentMarketData;
};

type CoingeckoMarketData = {
  loading: boolean;
  data?: MarketData;
  updateTimeWindow: (timeWindow: TimeWindow) => void;
};

const httpFetcher = (url: string) => fetch(url).then((res) => res.json());

function parseCoingeckoMarketDataResponses(
  currentMarketDataResponse: GetTokenCurrentMarketDataResponse,
  historicalMarketDataResponse: GetTokenHistoricalMarketDataResponse
): MarketData {
  if (
    !historicalMarketDataResponse.prices ||
    !historicalMarketDataResponse.market_caps
  ) {
    return {
      historicalMarketData: {
        prices: [],
        marketCaps: [],
      },
      currentMarketData: {
        usd: 0,
        usdMarketCap: 0,
        usd24hVol: 0,
        usd24hChange: 0,
      },
    };
  }

  const prices = historicalMarketDataResponse.prices.map((price) => {
    return {
      x: Math.floor(price[0] / 1000),
      y: price[1],
    };
  });

  const marketCaps = historicalMarketDataResponse.market_caps.map(
    (marketCap) => {
      return {
        x: Math.floor(marketCap[0] / 1000),
        y: marketCap[1],
      };
    }
  );

  const usd24hChange = currentMarketDataResponse['1inch'].usd_24h_change
    ? currentMarketDataResponse['1inch'].usd_24h_change / 100
    : 0;

  return {
    historicalMarketData: {
      prices,
      marketCaps,
    },
    currentMarketData: {
      usd: currentMarketDataResponse['1inch'].usd,
      usdMarketCap: currentMarketDataResponse['1inch'].usd_market_cap,
      usd24hVol: currentMarketDataResponse['1inch'].usd_24h_vol,
      usd24hChange,
    },
  };
}

export function useCoingeckoMarketData(
  priceTimeWindow: TimeWindow,
  symbol: string
): CoingeckoMarketData {
  const [timeWindow, setTimeWindow] = useState<TimeWindow>(priceTimeWindow);

  const currentMarketDataQueryUrl = useMemo(() => {
    if (!symbol) {
      return null;
    }

    return `https://api.coingecko.com/api/v3/simple/price?ids=${symbol}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true`;
  }, [symbol]);

  const historicalMarketPriceQueryURL = useMemo(() => {
    if (!symbol) {
      return null;
    }

    const options = getTimeseriesOptions(timeWindow);
    let urlParamsObj: Record<string, string> = {};

    if (options.startTimestamp) {
      urlParamsObj = {
        ...urlParamsObj,
        from: options.startTimestamp.toString(),
      };
    }
    if (options.endTimestamp) {
      urlParamsObj = {
        ...urlParamsObj,
        to: options.endTimestamp.toString(),
      };
    }

    const urlParams = new URLSearchParams(urlParamsObj);

    return `https://api.coingecko.com/api/v3/coins/${symbol}/market_chart/range?vs_currency=usd&${urlParams.toString()}`;
  }, [timeWindow, symbol]);

  const { data: historicalData, isLoading: historicalLoading } =
    useSWR<GetTokenHistoricalMarketDataResponse>(
      historicalMarketPriceQueryURL,
      httpFetcher
    );

  const { data: currentData, isLoading: currentLoading } =
    useSWR<GetTokenCurrentMarketDataResponse>(
      currentMarketDataQueryUrl,
      httpFetcher
    );

  const updateTimeWindow = (timeWindow: TimeWindow) => {
    if (timeWindow) {
      setTimeWindow(timeWindow);
    }
  };

  const marketData = useMemo(() => {
    if (!historicalData || !currentData) {
      return undefined;
    }

    return parseCoingeckoMarketDataResponses(currentData, historicalData);
  }, [historicalData, currentData]);

  return {
    loading: historicalLoading || currentLoading,
    data: marketData,
    updateTimeWindow,
  };
}
