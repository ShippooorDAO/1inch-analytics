import { gql, useQuery } from '@apollo/client';
import { useMemo } from 'react';

import { useFeatureFlags } from '@/shared/FeatureFlags/FeatureFlagsContextProvider';
import { ChainId } from '@/shared/Model/Chain';
import {
  DexAggregatorOverviewMetrics,
  DexAggregatorOverviewMetricsDataset,
  getLastPeriodValue,
  getTimeseriesTrend,
  sumTimeseries,
} from '@/shared/Model/DexAggregator';
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

interface DexAggregatorOverview {
  data?: DexAggregatorOverviewMetrics;
  loading: boolean;
  error?: string;
}

function parseWalletsAndTransactionsTimeseriesResponse(
  response: DexAggregatorOverviewWalletsAndTransactionsQueryResponse[],
  chainStore: ChainStore
) {
  const transactionsTimeseriesMap = new Map<ChainId, Timeseries>();
  const walletsTimeseriesMap = new Map<ChainId, Timeseries>();

  for (const {
    timestamp,
    transactionCount,
    walletCount,
    chain: chainResponse,
  } of response) {
    const chain = chainStore.getByChainId(chainResponse.chainIdentifier);
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

  for (const chain of chainStore.getAll()) {
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
  }

  for (const timeseries of transactionsTimeseriesMap.values()) {
    timeseries.data.sort((a, b) => a.x - b.x);
  }

  for (const timeseries of walletsTimeseriesMap.values()) {
    timeseries.data.sort((a, b) => a.x - b.x);
  }

  return {
    transactionsCount: transactionsTimeseriesMap,
    walletsCount: walletsTimeseriesMap,
  };
}

function parseVolumeTimeseriesResponse(
  response: DexAggregatorOverviewQueryVolumesQueryResponse[],
  chainStore: ChainStore
) {
  const volumeTimeseriesMap = new Map<ChainId, Timeseries>();

  for (const { timestamp, volumeUsd, chain: chainResponse } of response) {
    const chain = chainStore.getByChainId(chainResponse.chainIdentifier);
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

  for (const chain of chainStore.getAll()) {
    if (!volumeTimeseriesMap.has(chain.chainId)) {
      volumeTimeseriesMap.set(chain.chainId, {
        name: chain.displayName,
        imageUrl: chain?.imageUrl,
        color: chain.color,
        data: [],
      });
    }
  }

  for (const timeseries of volumeTimeseriesMap.values()) {
    timeseries.data.sort((a, b) => a.x - b.x);
  }

  return volumeTimeseriesMap;
}

function parseDexAggregatorOverviewQueryResponse(
  response: DexAggregatorOverviewQueryResponse,
  selectedChains: ChainId[],
  chainStore: ChainStore
): {
  byChain: Map<ChainId, DexAggregatorOverviewMetricsDataset>;
  allChains: DexAggregatorOverviewMetricsDataset;
  allSelectedChains: DexAggregatorOverviewMetricsDataset;
} {
  const {
    transactionsCount: transactionsCountAllTimeTimeseriesByChain,
    walletsCount: walletsCountAllTimeTimeseriesByChain,
  } = parseWalletsAndTransactionsTimeseriesResponse(
    response.allTimeWalletsAndTransactionsCount,
    chainStore
  );

  const {
    transactionsCount: transactionsCountDailyTimeseriesByChain,
    walletsCount: walletsCountDailyTimeseriesByChain,
  } = parseWalletsAndTransactionsTimeseriesResponse(
    response.dailyWalletsAndTransactionsCount,
    chainStore
  );

  const {
    transactionsCount: transactionsCountWeeklyTimeseriesByChain,
    walletsCount: walletsCountWeeklyTimeseriesByChain,
  } = parseWalletsAndTransactionsTimeseriesResponse(
    response.weeklyWalletsAndTransactionsCount,
    chainStore
  );

  const {
    transactionsCount: transactionsCountMonthlyTimeseriesByChain,
    walletsCount: walletsCountMonthlyTimeseriesByChain,
  } = parseWalletsAndTransactionsTimeseriesResponse(
    response.monthlyWalletsAndTransactionsCount,
    chainStore
  );

  const volumeAllTimeTimeseriesByChain = parseVolumeTimeseriesResponse(
    response.allTimeVolume,
    chainStore
  );

  const volumeDailyTimeseriesByChain = parseVolumeTimeseriesResponse(
    response.dailyVolume,
    chainStore
  );

  const volumeWeeklyTimeseriesByChain = parseVolumeTimeseriesResponse(
    response.weeklyVolume,
    chainStore
  );

  const volumeMonthlyTimeseriesByChain = parseVolumeTimeseriesResponse(
    response.monthlyVolume,
    chainStore
  );

  const transactionsCountAllTimeTimeseries = sumTimeseries(
    Array.from(transactionsCountAllTimeTimeseriesByChain.values())
  );
  const walletsCountAllTimeTimeseries = sumTimeseries(
    Array.from(walletsCountAllTimeTimeseriesByChain.values())
  );
  const volumeAllTimeTimeseries = sumTimeseries(
    Array.from(volumeAllTimeTimeseriesByChain.values())
  );

  const transactionsCountMonthlyTimeseries = sumTimeseries(
    Array.from(transactionsCountMonthlyTimeseriesByChain.values())
  );
  const walletsCountMonthlyTimeseries = sumTimeseries(
    Array.from(walletsCountMonthlyTimeseriesByChain.values())
  );
  const volumeMonthlyTimeseries = sumTimeseries(
    Array.from(volumeMonthlyTimeseriesByChain.values())
  );

  const transactionsCountWeeklyTimeseries = sumTimeseries(
    Array.from(transactionsCountWeeklyTimeseriesByChain.values())
  );
  const walletsCountWeeklyTimeseries = sumTimeseries(
    Array.from(walletsCountWeeklyTimeseriesByChain.values())
  );
  const volumeWeeklyTimeseries = sumTimeseries(
    Array.from(volumeWeeklyTimeseriesByChain.values())
  );

  const transactionsCountDailyTimeseries = sumTimeseries(
    Array.from(transactionsCountDailyTimeseriesByChain.values())
  );
  const walletsCountDailyTimeseries = sumTimeseries(
    Array.from(walletsCountDailyTimeseriesByChain.values())
  );
  const volumeDailyTimeseries = sumTimeseries(
    Array.from(volumeDailyTimeseriesByChain.values())
  );

  const getSumOfSelectedTimeseries = (ByChain: Map<ChainId, Timeseries>) => {
    return sumTimeseries(
      Array.from(ByChain.entries())
        .filter(([chainId]) => selectedChains.includes(chainId))
        .map(([, timeseries]) => timeseries)
    );
  };

  return {
    allChains: {
      transactionsCountAllTime: getLastPeriodValue(
        transactionsCountAllTimeTimeseries
      ),
      walletsCountAllTime: getLastPeriodValue(walletsCountAllTimeTimeseries),
      volumeAllTime: getLastPeriodValue(volumeAllTimeTimeseries),

      transactionsCountLastDay: getLastPeriodValue(
        transactionsCountDailyTimeseries
      ),
      walletsCountLastDay: getLastPeriodValue(walletsCountDailyTimeseries),
      volumeLastDay: getLastPeriodValue(volumeDailyTimeseries),

      transactionsCountLastWeek: getLastPeriodValue(
        transactionsCountWeeklyTimeseries
      ),
      walletsCountLastWeek: getLastPeriodValue(walletsCountWeeklyTimeseries),
      volumeLastWeek: getLastPeriodValue(volumeWeeklyTimeseries),

      transactionsCountLastDayTrend: getTimeseriesTrend(
        transactionsCountDailyTimeseries
      ),
      walletsCountLastDayTrend: getTimeseriesTrend(walletsCountDailyTimeseries),
      volumeLastDayTrend: getTimeseriesTrend(volumeDailyTimeseries),

      transactionsCountLastWeekTrend: getTimeseriesTrend(
        transactionsCountWeeklyTimeseries
      ),
      walletsCountLastWeekTrend: getTimeseriesTrend(
        walletsCountWeeklyTimeseries
      ),
      volumeLastWeekTrend: getTimeseriesTrend(volumeWeeklyTimeseries),

      transactionsCountLastMonthTrend: getTimeseriesTrend(
        transactionsCountMonthlyTimeseries
      ),
      walletsCountLastMonthTrend: getTimeseriesTrend(
        walletsCountMonthlyTimeseries
      ),
      volumeLastMonthTrend: getTimeseriesTrend(volumeMonthlyTimeseries),

      transactionsCountLastMonth: getLastPeriodValue(
        transactionsCountMonthlyTimeseries
      ),
      walletsCountLastMonth: getLastPeriodValue(walletsCountMonthlyTimeseries),
      volumeLastMonth: getLastPeriodValue(volumeMonthlyTimeseries),

      transactionsCountAllTimeTimeseries,
      walletsCountAllTimeTimeseries,
      volumeAllTimeTimeseries,

      transactionsCountMonthlyTimeseries,
      walletsCountMonthlyTimeseries,
      volumeMonthlyTimeseries,

      transactionsCountWeeklyTimeseries,
      walletsCountWeeklyTimeseries,
      volumeWeeklyTimeseries,

      transactionsCountDailyTimeseries,
      walletsCountDailyTimeseries,
      volumeDailyTimeseries,
    },
    byChain: new Map(
      chainStore.getAll().map((chain) => {
        return [
          chain.chainId,
          {
            transactionsCountAllTime: getLastPeriodValue(
              transactionsCountAllTimeTimeseriesByChain.get(chain.chainId)!
            ),
            walletsCountAllTime: getLastPeriodValue(
              walletsCountAllTimeTimeseriesByChain.get(chain.chainId)!
            ),
            volumeAllTime: getLastPeriodValue(
              volumeAllTimeTimeseriesByChain.get(chain.chainId)!
            ),

            transactionsCountLastDayTrend: getTimeseriesTrend(
              transactionsCountDailyTimeseriesByChain.get(chain.chainId)!
            ),
            walletsCountLastDayTrend: getTimeseriesTrend(
              walletsCountDailyTimeseriesByChain.get(chain.chainId)!
            ),
            volumeLastDayTrend: getTimeseriesTrend(
              volumeDailyTimeseriesByChain.get(chain.chainId)!
            ),

            transactionsCountLastWeek: getLastPeriodValue(
              transactionsCountWeeklyTimeseriesByChain.get(chain.chainId)!
            ),
            walletsCountLastWeek: getLastPeriodValue(
              walletsCountWeeklyTimeseriesByChain.get(chain.chainId)!
            ),
            volumeLastWeek: getLastPeriodValue(
              volumeWeeklyTimeseriesByChain.get(chain.chainId)!
            ),

            transactionsCountLastMonth: getLastPeriodValue(
              transactionsCountMonthlyTimeseriesByChain.get(chain.chainId)!
            ),
            walletsCountLastMonth: getLastPeriodValue(
              walletsCountMonthlyTimeseriesByChain.get(chain.chainId)!
            ),
            volumeLastMonth: getLastPeriodValue(
              volumeMonthlyTimeseriesByChain.get(chain.chainId)!
            ),

            transactionsCountLastDay: getLastPeriodValue(
              transactionsCountDailyTimeseriesByChain.get(chain.chainId)!
            ),
            walletsCountLastDay: getLastPeriodValue(
              walletsCountDailyTimeseriesByChain.get(chain.chainId)!
            ),
            volumeLastDay: getLastPeriodValue(
              volumeDailyTimeseriesByChain.get(chain.chainId)!
            ),

            transactionsCountLastWeekTrend: getTimeseriesTrend(
              transactionsCountWeeklyTimeseriesByChain.get(chain.chainId)!
            ),
            walletsCountLastWeekTrend: getTimeseriesTrend(
              walletsCountWeeklyTimeseriesByChain.get(chain.chainId)!
            ),
            volumeLastWeekTrend: getTimeseriesTrend(
              volumeWeeklyTimeseriesByChain.get(chain.chainId)!
            ),

            transactionsCountLastMonthTrend: getTimeseriesTrend(
              transactionsCountMonthlyTimeseriesByChain.get(chain.chainId)!
            ),
            walletsCountLastMonthTrend: getTimeseriesTrend(
              walletsCountMonthlyTimeseriesByChain.get(chain.chainId)!
            ),
            volumeLastMonthTrend: getTimeseriesTrend(
              volumeMonthlyTimeseriesByChain.get(chain.chainId)!
            ),

            transactionsCountAllTimeTimeseries:
              transactionsCountAllTimeTimeseriesByChain.get(chain.chainId)!,
            walletsCountAllTimeTimeseries:
              walletsCountAllTimeTimeseriesByChain.get(chain.chainId)!,
            volumeAllTimeTimeseries: volumeAllTimeTimeseriesByChain.get(
              chain.chainId
            )!,

            transactionsCountWeeklyTimeseries:
              transactionsCountWeeklyTimeseriesByChain.get(chain.chainId)!,
            walletsCountWeeklyTimeseries:
              walletsCountWeeklyTimeseriesByChain.get(chain.chainId)!,
            volumeWeeklyTimeseries: volumeWeeklyTimeseriesByChain.get(
              chain.chainId
            )!,

            transactionsCountMonthlyTimeseries:
              transactionsCountMonthlyTimeseriesByChain.get(chain.chainId)!,
            walletsCountMonthlyTimeseries:
              walletsCountMonthlyTimeseriesByChain.get(chain.chainId)!,
            volumeMonthlyTimeseries: volumeMonthlyTimeseriesByChain.get(
              chain.chainId
            )!,

            transactionsCountDailyTimeseries:
              transactionsCountDailyTimeseriesByChain.get(chain.chainId)!,
            walletsCountDailyTimeseries: walletsCountDailyTimeseriesByChain.get(
              chain.chainId
            )!,
            volumeDailyTimeseries: volumeDailyTimeseriesByChain.get(
              chain.chainId
            )!,
          },
        ];
      })
    ),
    allSelectedChains: {
      transactionsCountAllTime: getLastPeriodValue(
        getSumOfSelectedTimeseries(transactionsCountAllTimeTimeseriesByChain)
      ),
      walletsCountAllTime: getLastPeriodValue(
        getSumOfSelectedTimeseries(walletsCountAllTimeTimeseriesByChain)
      ),
      volumeAllTime: getLastPeriodValue(
        getSumOfSelectedTimeseries(volumeAllTimeTimeseriesByChain)
      ),

      transactionsCountLastDay: getLastPeriodValue(
        getSumOfSelectedTimeseries(transactionsCountDailyTimeseriesByChain)
      ),
      walletsCountLastDay: getLastPeriodValue(
        getSumOfSelectedTimeseries(walletsCountDailyTimeseriesByChain)
      ),
      volumeLastDay: getLastPeriodValue(
        getSumOfSelectedTimeseries(volumeDailyTimeseriesByChain)
      ),

      transactionsCountLastWeek: getLastPeriodValue(
        getSumOfSelectedTimeseries(transactionsCountWeeklyTimeseriesByChain)
      ),
      walletsCountLastWeek: getLastPeriodValue(
        getSumOfSelectedTimeseries(walletsCountWeeklyTimeseriesByChain)
      ),
      volumeLastWeek: getLastPeriodValue(
        getSumOfSelectedTimeseries(volumeWeeklyTimeseriesByChain)
      ),

      transactionsCountLastMonth: getLastPeriodValue(
        getSumOfSelectedTimeseries(transactionsCountMonthlyTimeseriesByChain)
      ),
      walletsCountLastMonth: getLastPeriodValue(
        getSumOfSelectedTimeseries(walletsCountMonthlyTimeseriesByChain)
      ),
      volumeLastMonth: getLastPeriodValue(
        getSumOfSelectedTimeseries(volumeMonthlyTimeseriesByChain)
      ),

      transactionsCountLastDayTrend: getTimeseriesTrend(
        getSumOfSelectedTimeseries(transactionsCountDailyTimeseriesByChain)
      ),
      walletsCountLastDayTrend: getTimeseriesTrend(
        getSumOfSelectedTimeseries(walletsCountDailyTimeseriesByChain)
      ),
      volumeLastDayTrend: getTimeseriesTrend(
        getSumOfSelectedTimeseries(volumeDailyTimeseriesByChain)
      ),

      transactionsCountLastWeekTrend: getTimeseriesTrend(
        getSumOfSelectedTimeseries(transactionsCountWeeklyTimeseriesByChain)
      ),
      walletsCountLastWeekTrend: getTimeseriesTrend(
        getSumOfSelectedTimeseries(walletsCountWeeklyTimeseriesByChain)
      ),
      volumeLastWeekTrend: getTimeseriesTrend(
        getSumOfSelectedTimeseries(volumeWeeklyTimeseriesByChain)
      ),

      transactionsCountLastMonthTrend: getTimeseriesTrend(
        getSumOfSelectedTimeseries(transactionsCountMonthlyTimeseriesByChain)
      ),
      walletsCountLastMonthTrend: getTimeseriesTrend(
        getSumOfSelectedTimeseries(walletsCountMonthlyTimeseriesByChain)
      ),
      volumeLastMonthTrend: getTimeseriesTrend(
        getSumOfSelectedTimeseries(volumeMonthlyTimeseriesByChain)
      ),

      transactionsCountAllTimeTimeseries: getSumOfSelectedTimeseries(
        transactionsCountAllTimeTimeseriesByChain
      ),
      walletsCountAllTimeTimeseries: getSumOfSelectedTimeseries(
        walletsCountAllTimeTimeseriesByChain
      ),
      volumeAllTimeTimeseries: getSumOfSelectedTimeseries(
        volumeAllTimeTimeseriesByChain
      ),

      transactionsCountWeeklyTimeseries: getSumOfSelectedTimeseries(
        transactionsCountWeeklyTimeseriesByChain
      ),
      walletsCountWeeklyTimeseries: getSumOfSelectedTimeseries(
        walletsCountWeeklyTimeseriesByChain
      ),
      volumeWeeklyTimeseries: getSumOfSelectedTimeseries(
        volumeWeeklyTimeseriesByChain
      ),

      transactionsCountMonthlyTimeseries: getSumOfSelectedTimeseries(
        transactionsCountMonthlyTimeseriesByChain
      ),
      walletsCountMonthlyTimeseries: getSumOfSelectedTimeseries(
        walletsCountMonthlyTimeseriesByChain
      ),
      volumeMonthlyTimeseries: getSumOfSelectedTimeseries(
        volumeMonthlyTimeseriesByChain
      ),

      transactionsCountDailyTimeseries: getSumOfSelectedTimeseries(
        transactionsCountDailyTimeseriesByChain
      ),
      walletsCountDailyTimeseries: getSumOfSelectedTimeseries(
        walletsCountDailyTimeseriesByChain
      ),
      volumeDailyTimeseries: getSumOfSelectedTimeseries(
        volumeDailyTimeseriesByChain
      ),
    },
  };
}

export function useDexAggregatorOverview({
  chainIds,
}: {
  chainIds?: string[];
}): DexAggregatorOverview {
  const { chainStore } = useOneInchAnalyticsAPIContext();

  const featureFlags = useFeatureFlags();

  const { data, loading, variables } = useQuery<
    DexAggregatorOverviewQueryResponse,
    DexAggregatorOverviewQueryVariables
  >(DEX_AGGREGATOR_OVERVIEW_QUERY, {
    variables: {
      chainIds: chainIds?.map((chainId) => chainId.toString()) ?? [],
    },
    skip: !chainIds || featureFlags.enableMockData,
  });

  const parsedData = useMemo(() => {
    if (!chainStore || featureFlags.enableMockData === undefined || !chainIds) {
      return undefined;
    }

    if (featureFlags.enableMockData) {
      const response = createMockDexAggregatorOverviewResponse();
      return parseDexAggregatorOverviewQueryResponse(
        response,
        chainIds.map((id) => chainStore.getById(id)!.chainId),
        chainStore
      );
    }

    if (!data) {
      return undefined;
    }

    return parseDexAggregatorOverviewQueryResponse(
      data,
      chainIds.map((id) => chainStore.getById(id)!.chainId),
      chainStore
    );
  }, [data, chainStore, chainIds, featureFlags.enableMockData]);

  return {
    data: parsedData,
    loading: !parsedData || loading,
  };
}
