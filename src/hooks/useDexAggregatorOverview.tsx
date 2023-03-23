import { gql, useQuery } from '@apollo/client';
import { useMemo } from 'react';

import { useFeatureFlags } from '@/shared/FeatureFlags/FeatureFlagsContextProvider';
import { ChainId } from '@/shared/Model/Chain';
import { ChainStore } from '@/shared/Model/Stores/ChainStore';
import { Timeseries } from '@/shared/Model/Timeseries';
import { useOneInchAnalyticsAPIContext } from '@/shared/OneInchAnalyticsAPI/OneInchAnalyticsAPIProvider';

import { createMockDexAggregatorOverviewResponse } from './mocks/DexAggregatorOverviewQueryResponse';

const DEX_AGGREGATOR_OVERVIEW_QUERY = gql`
  fragment WalletsAndTransactionsFields on Wallet {
    timestamp
    chain {
      chainIdentifier
    }
    transactionCount
    walletCount
  }
  fragment VolumeFields on Volume {
    timestamp
    chain {
      chainIdentifier
    }
    volumeUsd
  }
  query getDexAggregatorOverview($chainIds: [String!]!) {
    allTimeWalletsAndTransactionsCount: wallets(
      chainIds: $chainIds
      timespan: ALL
    ) {
      ...WalletsAndTransactionsFields
    }
    dailyWalletsAndTransactionsCount: wallets(
      chainIds: $chainIds
      timespan: DAY
    ) {
      ...WalletsAndTransactionsFields
    }
    weeklyWalletsAndTransactionsCount: wallets(
      chainIds: $chainIds
      timespan: WEEK
    ) {
      ...WalletsAndTransactionsFields
    }
    monthlyWalletsAndTransactionsCount: wallets(
      chainIds: $chainIds
      timespan: MONTH
    ) {
      ...WalletsAndTransactionsFields
    }
    allTimeVolume: volumes(chainIds: $chainIds, timespan: ALL) {
      ...VolumeFields
    }
    dailyVolume: volumes(chainIds: $chainIds, timespan: DAY) {
      ...VolumeFields
    }
    weeklyVolume: volumes(chainIds: $chainIds, timespan: WEEK) {
      ...VolumeFields
    }
    monthlyVolume: volumes(chainIds: $chainIds, timespan: MONTH) {
      ...VolumeFields
    }
  }
`;

interface DexAggregatorOverviewQueryVariables {
  chainIds: string[];
}

export interface DexAggregatorOverviewWalletsAndTransactionsQueryResponse {
  timestamp: number;
  chain: {
    chainIdentifier: string;
  };
  transactionCount: number;
  walletCount: number;
}

export interface DexAggregatorOverviewQueryVolumesQueryResponse {
  timestamp: number;
  chain: {
    chainIdentifier: string;
  };
  volumeUsd: number;
}

export interface DexAggregatorOverviewQueryResponse {
  allTimeWalletsAndTransactionsCount: DexAggregatorOverviewWalletsAndTransactionsQueryResponse[];
  dailyWalletsAndTransactionsCount: DexAggregatorOverviewWalletsAndTransactionsQueryResponse[];
  weeklyWalletsAndTransactionsCount: DexAggregatorOverviewWalletsAndTransactionsQueryResponse[];
  monthlyWalletsAndTransactionsCount: DexAggregatorOverviewWalletsAndTransactionsQueryResponse[];
  allTimeVolume: DexAggregatorOverviewQueryVolumesQueryResponse[];
  dailyVolume: DexAggregatorOverviewQueryVolumesQueryResponse[];
  weeklyVolume: DexAggregatorOverviewQueryVolumesQueryResponse[];
  monthlyVolume: DexAggregatorOverviewQueryVolumesQueryResponse[];
}

interface DexAggregatorOverviewDataset {
  allTimeTransactionsCount: number;
  allTimeWalletsCount: number;
  allTimeVolume: number;

  lastDayTransactionsCount: number;
  lastDayWalletsCount: number;
  lastDayVolume: number;

  lastWeekTransactionsCount: number;
  lastWeekWalletsCount: number;
  lastWeekVolume: number;

  lastMonthTransactionsCount: number;
  lastMonthWalletsCount: number;
  lastMonthVolume: number;

  lastDayTransactionsCountTrend: number;
  lastDayWalletsCountTrend: number;
  lastDayVolumeTrend: number;

  lastWeekTransactionsCountTrend: number;
  lastWeekWalletsCountTrend: number;
  lastWeekVolumeTrend: number;

  lastMonthTransactionsCountTrend: number;
  lastMonthWalletsCountTrend: number;
  lastMonthVolumeTrend: number;

  allTimeTransactionsCountTimeseries: Timeseries;
  allTimeWalletsCountTimeseries: Timeseries;
  allTimeVolumeTimeseries: Timeseries;

  dailyTransactionsCountTimeseries: Timeseries;
  dailyWalletsCountTimeseries: Timeseries;
  dailyVolumeTimeseries: Timeseries;

  weeklyTransactionsCountTimeseries: Timeseries;
  weeklyWalletsCountTimeseries: Timeseries;
  weeklyVolumeTimeseries: Timeseries;

  monthlyTransactionsCountTimeseries: Timeseries;
  monthlyWalletsCountTimeseries: Timeseries;
  monthlyVolumeTimeseries: Timeseries;
}

interface DexAggregatorOverview {
  data?: {
    byChain: Map<ChainId, DexAggregatorOverviewDataset>;
    allChains: DexAggregatorOverviewDataset;
    allSelectedChains: DexAggregatorOverviewDataset;
  };
  loading: boolean;
  error?: string;
}

function parseWalletsAndTransactionsTimeseriesResponse(
  walletsAndTransactions: DexAggregatorOverviewWalletsAndTransactionsQueryResponse[],
  chainStore: ChainStore
) {
  const transactionsTimeseriesMap = new Map<ChainId, Timeseries>();
  const walletsTimeseriesMap = new Map<ChainId, Timeseries>();

  for (const {
    timestamp,
    transactionCount,
    walletCount,
    chain: chainResponse,
  } of walletsAndTransactions) {
    const chain = chainStore.getById(chainResponse.chainIdentifier);
    if (!chain) {
      continue;
    }

    if (!transactionsTimeseriesMap.has(chain.chainId)) {
      transactionsTimeseriesMap.set(chain.chainId, {
        name: chain.displayName,
        imageUrl: chain?.imageUrl,
        color: chain.color,
        data: [],
      });
    }

    if (!walletsTimeseriesMap.has(chain.chainId)) {
      walletsTimeseriesMap.set(chain.chainId, {
        name: chain.displayName,
        imageUrl: chain?.imageUrl,
        color: chain.color,
        data: [],
      });
    }

    transactionsTimeseriesMap.get(chain.chainId)?.data.push({
      x: timestamp,
      y: transactionCount,
    });

    walletsTimeseriesMap.get(chain.chainId)?.data.push({
      x: timestamp,
      y: walletCount,
    });
  }

  return {
    transactionsCount: transactionsTimeseriesMap,
    walletsCount: walletsTimeseriesMap,
  };
}

function parseVolumeTimeseriesResponse(
  volumes: DexAggregatorOverviewQueryVolumesQueryResponse[],
  chainStore: ChainStore
) {
  const volumeTimeseriesMap = new Map<ChainId, Timeseries>();

  for (const { timestamp, volumeUsd, chain: chainResponse } of volumes) {
    const chain = chainStore.getById(chainResponse.chainIdentifier);
    if (!chain) {
      continue;
    }

    if (!volumeTimeseriesMap.has(chain.chainId)) {
      volumeTimeseriesMap.set(chain.chainId, {
        name: chain.displayName,
        imageUrl: chain?.imageUrl,
        color: chain.color,
        data: [],
      });
    }

    volumeTimeseriesMap.get(chain.chainId)?.data.push({
      x: timestamp,
      y: volumeUsd,
    });
  }

  return volumeTimeseriesMap;
}

function sumTimeseries(timeseriesList: Timeseries[]): Timeseries {
  const result: Timeseries = {
    name: 'All Chains',
    color: '#000000',
    data: [],
  };

  const timestamps = new Set<number>();
  for (const timeseries of timeseriesList) {
    for (const { x } of timeseries.data) {
      timestamps.add(x);
    }
  }

  for (const timestamp of timestamps) {
    let sum = 0;
    for (const timeseries of timeseriesList) {
      const value = timeseries.data.find((d) => d.x === timestamp)?.y;
      if (value) {
        sum += value;
      }
    }
    result.data.push({ x: timestamp, y: sum });
  }

  return result;
}

function getTimeseriesTrend(timeseries: Timeseries) {
  if (timeseries.data.length < 2) {
    return 0;
  }

  return (
    timeseries.data[timeseries.data.length - 1].y /
    timeseries.data[timeseries.data.length - 2].y
  );
}

function getLastPeriodValue(timeseries: Timeseries) {
  if (timeseries.data.length < 1) {
    return 0;
  }

  return timeseries.data[timeseries.data.length - 1].y;
}

function parseDexAggregatorOverviewQueryResponse(
  response: DexAggregatorOverviewQueryResponse,
  selectedChains: ChainId[],
  chainStore: ChainStore
): {
  byChain: Map<ChainId, DexAggregatorOverviewDataset>;
  allChains: DexAggregatorOverviewDataset;
  allSelectedChains: DexAggregatorOverviewDataset;
} {
  const {
    transactionsCount: allTimeTransactionsCountTimeseriesByChain,
    walletsCount: allTimeWalletsCountTimeseriesByChain,
  } = parseWalletsAndTransactionsTimeseriesResponse(
    response.allTimeWalletsAndTransactionsCount,
    chainStore
  );

  const {
    transactionsCount: dailyTransactionsCountTimeseriesByChain,
    walletsCount: dailyWalletsCountTimeseriesByChain,
  } = parseWalletsAndTransactionsTimeseriesResponse(
    response.dailyWalletsAndTransactionsCount,
    chainStore
  );

  const {
    transactionsCount: weeklyTransactionsCountTimeseriesByChain,
    walletsCount: weeklyWalletsCountTimeseriesByChain,
  } = parseWalletsAndTransactionsTimeseriesResponse(
    response.weeklyWalletsAndTransactionsCount,
    chainStore
  );

  const {
    transactionsCount: monthlyTransactionsCountTimeseriesByChain,
    walletsCount: monthlyWalletsCountTimeseriesByChain,
  } = parseWalletsAndTransactionsTimeseriesResponse(
    response.monthlyWalletsAndTransactionsCount,
    chainStore
  );

  const allTimeVolumeTimeseriesByChain = parseVolumeTimeseriesResponse(
    response.allTimeVolume,
    chainStore
  );

  const dailyVolumeTimeseriesByChain = parseVolumeTimeseriesResponse(
    response.dailyVolume,
    chainStore
  );

  const weeklyVolumeTimeseriesByChain = parseVolumeTimeseriesResponse(
    response.weeklyVolume,
    chainStore
  );

  const monthlyVolumeTimeseriesByChain = parseVolumeTimeseriesResponse(
    response.monthlyVolume,
    chainStore
  );

  const allTimeTransactionsCountTimeseries = sumTimeseries(
    Array.from(allTimeTransactionsCountTimeseriesByChain.values())
  );
  const allTimeWalletsCountTimeseries = sumTimeseries(
    Array.from(allTimeWalletsCountTimeseriesByChain.values())
  );
  const allTimeVolumeTimeseries = sumTimeseries(
    Array.from(allTimeVolumeTimeseriesByChain.values())
  );

  const monthlyTransactionsCountTimeseries = sumTimeseries(
    Array.from(monthlyTransactionsCountTimeseriesByChain.values())
  );
  const monthlyWalletsCountTimeseries = sumTimeseries(
    Array.from(monthlyWalletsCountTimeseriesByChain.values())
  );
  const monthlyVolumeTimeseries = sumTimeseries(
    Array.from(monthlyVolumeTimeseriesByChain.values())
  );

  const weeklyTransactionsCountTimeseries = sumTimeseries(
    Array.from(weeklyTransactionsCountTimeseriesByChain.values())
  );
  const weeklyWalletsCountTimeseries = sumTimeseries(
    Array.from(weeklyWalletsCountTimeseriesByChain.values())
  );
  const weeklyVolumeTimeseries = sumTimeseries(
    Array.from(weeklyVolumeTimeseriesByChain.values())
  );

  const dailyTransactionsCountTimeseries = sumTimeseries(
    Array.from(dailyTransactionsCountTimeseriesByChain.values())
  );
  const dailyWalletsCountTimeseries = sumTimeseries(
    Array.from(dailyWalletsCountTimeseriesByChain.values())
  );
  const dailyVolumeTimeseries = sumTimeseries(
    Array.from(dailyVolumeTimeseriesByChain.values())
  );

  const sumOfSelectedTimeseries = (ByChain: Map<ChainId, Timeseries>) => {
    return sumTimeseries(
      Array.from(ByChain.entries())
        .filter(([chainId]) => selectedChains.includes(chainId))
        .map(([, timeseries]) => timeseries)
    );
  };

  return {
    allChains: {
      allTimeTransactionsCount: getLastPeriodValue(
        allTimeTransactionsCountTimeseries
      ),
      allTimeWalletsCount: getLastPeriodValue(allTimeWalletsCountTimeseries),
      allTimeVolume: getLastPeriodValue(allTimeVolumeTimeseries),

      lastDayTransactionsCount: getLastPeriodValue(
        dailyTransactionsCountTimeseries
      ),
      lastDayWalletsCount: getLastPeriodValue(dailyWalletsCountTimeseries),
      lastDayVolume: getLastPeriodValue(dailyVolumeTimeseries),

      lastWeekTransactionsCount: getLastPeriodValue(
        weeklyTransactionsCountTimeseries
      ),
      lastWeekWalletsCount: getLastPeriodValue(weeklyWalletsCountTimeseries),
      lastWeekVolume: getLastPeriodValue(weeklyVolumeTimeseries),

      lastDayTransactionsCountTrend: getTimeseriesTrend(
        dailyTransactionsCountTimeseries
      ),
      lastDayWalletsCountTrend: getTimeseriesTrend(dailyWalletsCountTimeseries),
      lastDayVolumeTrend: getTimeseriesTrend(dailyVolumeTimeseries),

      lastWeekTransactionsCountTrend: getTimeseriesTrend(
        weeklyTransactionsCountTimeseries
      ),
      lastWeekWalletsCountTrend: getTimeseriesTrend(
        weeklyWalletsCountTimeseries
      ),
      lastWeekVolumeTrend: getTimeseriesTrend(weeklyVolumeTimeseries),

      lastMonthTransactionsCountTrend: getTimeseriesTrend(
        monthlyTransactionsCountTimeseries
      ),
      lastMonthWalletsCountTrend: getTimeseriesTrend(
        monthlyWalletsCountTimeseries
      ),
      lastMonthVolumeTrend: getTimeseriesTrend(monthlyVolumeTimeseries),

      lastMonthTransactionsCount: getLastPeriodValue(
        monthlyTransactionsCountTimeseries
      ),
      lastMonthWalletsCount: getLastPeriodValue(monthlyWalletsCountTimeseries),
      lastMonthVolume: getLastPeriodValue(monthlyVolumeTimeseries),

      allTimeTransactionsCountTimeseries,
      allTimeWalletsCountTimeseries,
      allTimeVolumeTimeseries,

      monthlyTransactionsCountTimeseries,
      monthlyWalletsCountTimeseries,
      monthlyVolumeTimeseries,

      weeklyTransactionsCountTimeseries,
      weeklyWalletsCountTimeseries,
      weeklyVolumeTimeseries,

      dailyTransactionsCountTimeseries,
      dailyWalletsCountTimeseries,
      dailyVolumeTimeseries,
    },
    byChain: new Map(
      chainStore.getAll().map((chain) => {
        return [
          chain.chainId,
          {
            allTimeTransactionsCount: getLastPeriodValue(
              allTimeTransactionsCountTimeseriesByChain.get(chain.chainId)!
            ),
            allTimeWalletsCount: getLastPeriodValue(
              allTimeWalletsCountTimeseriesByChain.get(chain.chainId)!
            ),
            allTimeVolume: getLastPeriodValue(
              allTimeVolumeTimeseriesByChain.get(chain.chainId)!
            ),

            lastDayTransactionsCountTrend: getTimeseriesTrend(
              dailyTransactionsCountTimeseriesByChain.get(chain.chainId)!
            ),
            lastDayWalletsCountTrend: getTimeseriesTrend(
              dailyWalletsCountTimeseriesByChain.get(chain.chainId)!
            ),
            lastDayVolumeTrend: getTimeseriesTrend(
              dailyVolumeTimeseriesByChain.get(chain.chainId)!
            ),

            lastWeekTransactionsCount: getLastPeriodValue(
              weeklyTransactionsCountTimeseriesByChain.get(chain.chainId)!
            ),
            lastWeekWalletsCount: getLastPeriodValue(
              weeklyWalletsCountTimeseriesByChain.get(chain.chainId)!
            ),
            lastWeekVolume: getLastPeriodValue(
              weeklyVolumeTimeseriesByChain.get(chain.chainId)!
            ),

            lastMonthTransactionsCount: getLastPeriodValue(
              monthlyTransactionsCountTimeseriesByChain.get(chain.chainId)!
            ),
            lastMonthWalletsCount: getLastPeriodValue(
              monthlyWalletsCountTimeseriesByChain.get(chain.chainId)!
            ),
            lastMonthVolume: getLastPeriodValue(
              monthlyVolumeTimeseriesByChain.get(chain.chainId)!
            ),

            lastDayTransactionsCount: getLastPeriodValue(
              dailyTransactionsCountTimeseriesByChain.get(chain.chainId)!
            ),
            lastDayWalletsCount: getLastPeriodValue(
              dailyWalletsCountTimeseriesByChain.get(chain.chainId)!
            ),
            lastDayVolume: getLastPeriodValue(
              dailyVolumeTimeseriesByChain.get(chain.chainId)!
            ),

            lastWeekTransactionsCountTrend: getTimeseriesTrend(
              weeklyTransactionsCountTimeseriesByChain.get(chain.chainId)!
            ),
            lastWeekWalletsCountTrend: getTimeseriesTrend(
              weeklyWalletsCountTimeseriesByChain.get(chain.chainId)!
            ),
            lastWeekVolumeTrend: getTimeseriesTrend(
              weeklyVolumeTimeseriesByChain.get(chain.chainId)!
            ),

            lastMonthTransactionsCountTrend: getTimeseriesTrend(
              monthlyTransactionsCountTimeseriesByChain.get(chain.chainId)!
            ),
            lastMonthWalletsCountTrend: getTimeseriesTrend(
              monthlyWalletsCountTimeseriesByChain.get(chain.chainId)!
            ),
            lastMonthVolumeTrend: getTimeseriesTrend(
              monthlyVolumeTimeseriesByChain.get(chain.chainId)!
            ),

            allTimeTransactionsCountTimeseries:
              allTimeTransactionsCountTimeseriesByChain.get(chain.chainId)!,
            allTimeWalletsCountTimeseries:
              allTimeWalletsCountTimeseriesByChain.get(chain.chainId)!,
            allTimeVolumeTimeseries: allTimeVolumeTimeseriesByChain.get(
              chain.chainId
            )!,

            weeklyTransactionsCountTimeseries:
              weeklyTransactionsCountTimeseriesByChain.get(chain.chainId)!,
            weeklyWalletsCountTimeseries:
              weeklyWalletsCountTimeseriesByChain.get(chain.chainId)!,
            weeklyVolumeTimeseries: weeklyVolumeTimeseriesByChain.get(
              chain.chainId
            )!,

            monthlyTransactionsCountTimeseries:
              monthlyTransactionsCountTimeseriesByChain.get(chain.chainId)!,
            monthlyWalletsCountTimeseries:
              monthlyWalletsCountTimeseriesByChain.get(chain.chainId)!,
            monthlyVolumeTimeseries: monthlyVolumeTimeseriesByChain.get(
              chain.chainId
            )!,

            dailyTransactionsCountTimeseries:
              dailyTransactionsCountTimeseriesByChain.get(chain.chainId)!,
            dailyWalletsCountTimeseries: dailyWalletsCountTimeseriesByChain.get(
              chain.chainId
            )!,
            dailyVolumeTimeseries: dailyVolumeTimeseriesByChain.get(
              chain.chainId
            )!,
          },
        ];
      })
    ),
    allSelectedChains: {
      allTimeTransactionsCount: getLastPeriodValue(
        sumOfSelectedTimeseries(allTimeTransactionsCountTimeseriesByChain)
      ),
      allTimeWalletsCount: getLastPeriodValue(
        sumOfSelectedTimeseries(allTimeWalletsCountTimeseriesByChain)
      ),
      allTimeVolume: getLastPeriodValue(
        sumOfSelectedTimeseries(allTimeVolumeTimeseriesByChain)
      ),

      lastDayTransactionsCount: getLastPeriodValue(
        sumOfSelectedTimeseries(dailyTransactionsCountTimeseriesByChain)
      ),
      lastDayWalletsCount: getLastPeriodValue(
        sumOfSelectedTimeseries(dailyWalletsCountTimeseriesByChain)
      ),
      lastDayVolume: getLastPeriodValue(
        sumOfSelectedTimeseries(dailyVolumeTimeseriesByChain)
      ),

      lastWeekTransactionsCount: getLastPeriodValue(
        sumOfSelectedTimeseries(weeklyTransactionsCountTimeseriesByChain)
      ),
      lastWeekWalletsCount: getLastPeriodValue(
        sumOfSelectedTimeseries(weeklyWalletsCountTimeseriesByChain)
      ),
      lastWeekVolume: getLastPeriodValue(
        sumOfSelectedTimeseries(weeklyVolumeTimeseriesByChain)
      ),

      lastMonthTransactionsCount: getLastPeriodValue(
        sumOfSelectedTimeseries(monthlyTransactionsCountTimeseriesByChain)
      ),
      lastMonthWalletsCount: getLastPeriodValue(
        sumOfSelectedTimeseries(monthlyWalletsCountTimeseriesByChain)
      ),
      lastMonthVolume: getLastPeriodValue(
        sumOfSelectedTimeseries(monthlyVolumeTimeseriesByChain)
      ),

      lastDayTransactionsCountTrend: getTimeseriesTrend(
        sumOfSelectedTimeseries(dailyTransactionsCountTimeseriesByChain)
      ),
      lastDayWalletsCountTrend: getTimeseriesTrend(
        sumOfSelectedTimeseries(dailyWalletsCountTimeseriesByChain)
      ),
      lastDayVolumeTrend: getTimeseriesTrend(
        sumOfSelectedTimeseries(dailyVolumeTimeseriesByChain)
      ),

      lastWeekTransactionsCountTrend: getTimeseriesTrend(
        sumOfSelectedTimeseries(weeklyTransactionsCountTimeseriesByChain)
      ),
      lastWeekWalletsCountTrend: getTimeseriesTrend(
        sumOfSelectedTimeseries(weeklyWalletsCountTimeseriesByChain)
      ),
      lastWeekVolumeTrend: getTimeseriesTrend(
        sumOfSelectedTimeseries(weeklyVolumeTimeseriesByChain)
      ),

      lastMonthTransactionsCountTrend: getTimeseriesTrend(
        sumOfSelectedTimeseries(monthlyTransactionsCountTimeseriesByChain)
      ),
      lastMonthWalletsCountTrend: getTimeseriesTrend(
        sumOfSelectedTimeseries(monthlyWalletsCountTimeseriesByChain)
      ),
      lastMonthVolumeTrend: getTimeseriesTrend(
        sumOfSelectedTimeseries(monthlyVolumeTimeseriesByChain)
      ),

      allTimeTransactionsCountTimeseries: sumOfSelectedTimeseries(
        allTimeTransactionsCountTimeseriesByChain
      ),
      allTimeWalletsCountTimeseries: sumOfSelectedTimeseries(
        allTimeWalletsCountTimeseriesByChain
      ),
      allTimeVolumeTimeseries: sumOfSelectedTimeseries(
        allTimeVolumeTimeseriesByChain
      ),

      weeklyTransactionsCountTimeseries: sumOfSelectedTimeseries(
        weeklyTransactionsCountTimeseriesByChain
      ),
      weeklyWalletsCountTimeseries: sumOfSelectedTimeseries(
        weeklyWalletsCountTimeseriesByChain
      ),
      weeklyVolumeTimeseries: sumOfSelectedTimeseries(
        weeklyVolumeTimeseriesByChain
      ),

      monthlyTransactionsCountTimeseries: sumOfSelectedTimeseries(
        monthlyTransactionsCountTimeseriesByChain
      ),
      monthlyWalletsCountTimeseries: sumOfSelectedTimeseries(
        monthlyWalletsCountTimeseriesByChain
      ),
      monthlyVolumeTimeseries: sumOfSelectedTimeseries(
        monthlyVolumeTimeseriesByChain
      ),

      dailyTransactionsCountTimeseries: sumOfSelectedTimeseries(
        dailyTransactionsCountTimeseriesByChain
      ),
      dailyWalletsCountTimeseries: sumOfSelectedTimeseries(
        dailyWalletsCountTimeseriesByChain
      ),
      dailyVolumeTimeseries: sumOfSelectedTimeseries(
        dailyVolumeTimeseriesByChain
      ),
    },
  };
}

export function useDexAggregatorOverview({
  chainIds,
}: {
  chainIds: ChainId[];
}): DexAggregatorOverview {
  const { chainStore } = useOneInchAnalyticsAPIContext();

  const featureFlags = useFeatureFlags();

  const { data, loading } = useQuery<
    DexAggregatorOverviewQueryResponse,
    DexAggregatorOverviewQueryVariables
  >(DEX_AGGREGATOR_OVERVIEW_QUERY, {
    variables: {
      chainIds: chainIds.map((chainId) => chainId.toString()),
    },
    skip: featureFlags.enableMockData,
  });

  const parsedData = useMemo(() => {
    if (!chainStore || featureFlags.enableMockData === undefined) {
      return undefined;
    }

    if (featureFlags.enableMockData) {
      const response = createMockDexAggregatorOverviewResponse();
      return parseDexAggregatorOverviewQueryResponse(
        response,
        chainIds,
        chainStore
      );
    }

    if (!data) {
      return undefined;
    }

    return parseDexAggregatorOverviewQueryResponse(data, chainIds, chainStore);
  }, [data, chainStore, chainIds, featureFlags.enableMockData]);

  return {
    data: parsedData,
    loading: !parsedData || loading,
  };
}
