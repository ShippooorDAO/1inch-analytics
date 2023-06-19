import { gql, useQuery } from '@apollo/client';
import { useTheme } from '@mui/material';
import { useMemo } from 'react';

import { useFeatureFlags } from '@/shared/FeatureFlags/FeatureFlagsContextProvider';
import {
  getAllTimeTotal,
  getLastPeriodValue,
  getTimeseriesTrend,
  sumTimeseries,
} from '@/shared/Model/DexAggregator';
import {
  FusionResolver,
  getResolverAddressFromDuneResolverName,
} from '@/shared/Model/FusionResolver';
import { Timeseries } from '@/shared/Model/Timeseries';
import { useOneInchAnalyticsAPIContext } from '@/shared/OneInchAnalyticsAPI/OneInchAnalyticsAPIProvider';

import { createMockFusionResolversQueryResponse } from './mocks/FusionResolversQueryResponse';

const FUSION_RESOLVERS_QUERY = gql`
  query getFusionResolvers {
    weeklyFusionResolvers: fusionResolvers(timespan: WEEK) {
      id
      timespan
      timestamp
      resolver
      transactionCount
      walletCount
      totalVolumeUsd
    }
  }
`;

interface FusionResolverResponse {
  id: string;
  timestamp: number;
  resolver: string; // corresponds to 'name' field on Resolver model
  transactionCount: number;
  walletCount: number;
  totalVolumeUsd: number;
  timespan: string;
}

interface FusionResolversQueryResponse {
  weeklyFusionResolvers: FusionResolverResponse[];
}

interface FusionResolversQueryVariables {
  timespan: string;
}

export interface FusionResolverMetrics {
  transactionsCountAllTime: number;
  walletsCountAllTime: number;
  volumeAllTime: number;

  transactionsCountLastWeek: number;
  walletsCountLastWeek: number;
  volumeLastWeek: number;

  transactionsCountLastWeekTrend: number;
  walletsCountLastWeekTrend: number;
  volumeLastWeekTrend: number;

  transactionsCountWeeklyTimeseries: Timeseries;
  walletsCountWeeklyTimeseries: Timeseries;
  volumeWeeklyTimeseries: Timeseries;
}

export interface FusionResolversMetrics {
  byResolver: Map<string, FusionResolverMetrics>;
  allResolvers: FusionResolverMetrics;
}

function parseFusionResolverResponses(
  responses: FusionResolverResponse[],
  resolvers: FusionResolver[]
) {
  const transactionsCountTimeseriesByResolver = new Map<string, Timeseries>();
  const walletsCountTimeseriesByResolver = new Map<string, Timeseries>();
  const volumeTimeseriesByResolver = new Map<string, Timeseries>();
  const resolversSet = new Set<string>();

  for (const entry of responses) {
    const fusionResolverAddress = getResolverAddressFromDuneResolverName(
      entry.resolver
    );
    const fusionResolver = resolvers.find(
      (resolver) =>
        resolver.address.toLowerCase() === fusionResolverAddress?.toLowerCase()
    );

    const imageUrl = fusionResolver?.imageUrl ?? 'resolver-placeholder.webp';

    if (!transactionsCountTimeseriesByResolver.has(entry.resolver)) {
      transactionsCountTimeseriesByResolver.set(entry.resolver, {
        name: entry.resolver,
        color: fusionResolver?.color,
        imageUrl,
        data: [],
      });
    }

    if (!walletsCountTimeseriesByResolver.has(entry.resolver)) {
      walletsCountTimeseriesByResolver.set(entry.resolver, {
        name: entry.resolver,
        color: fusionResolver?.color,
        imageUrl,
        data: [],
      });
    }

    if (!volumeTimeseriesByResolver.has(entry.resolver)) {
      volumeTimeseriesByResolver.set(entry.resolver, {
        name: entry.resolver,
        color: fusionResolver?.color,
        imageUrl,
        data: [],
      });
    }

    transactionsCountTimeseriesByResolver.get(entry.resolver)?.data.push({
      x: entry.timestamp,
      y: entry.transactionCount,
    });

    walletsCountTimeseriesByResolver.get(entry.resolver)?.data.push({
      x: entry.timestamp,
      y: entry.walletCount,
    });

    volumeTimeseriesByResolver.get(entry.resolver)?.data.push({
      x: entry.timestamp,
      y: entry.totalVolumeUsd,
    });
    resolversSet.add(entry.resolver);
  }

  return {
    resolvers: Array.from(resolversSet),
    transactionsCountTimeseriesByResolver,
    walletsCountTimeseriesByResolver,
    volumeTimeseriesByResolver,
  };
}

function parseFusionResolversQueryResponse(
  response: FusionResolversQueryResponse,
  fusionResolvers: FusionResolver[]
): FusionResolversMetrics {
  const weeklyTimeseries = parseFusionResolverResponses(
    response.weeklyFusionResolvers,
    fusionResolvers
  );

  const { resolvers } = weeklyTimeseries;

  const transactionsCountWeeklyTimeseries = sumTimeseries(
    Array.from(weeklyTimeseries.transactionsCountTimeseriesByResolver.values())
  );
  const walletsCountWeeklyTimeseries = sumTimeseries(
    Array.from(weeklyTimeseries.walletsCountTimeseriesByResolver.values())
  );
  const volumeWeeklyTimeseries = sumTimeseries(
    Array.from(weeklyTimeseries.volumeTimeseriesByResolver.values())
  );

  return {
    byResolver: new Map(
      resolvers.map((resolver) => {
        const transactionsCountWeeklyTimeseries =
          weeklyTimeseries.transactionsCountTimeseriesByResolver.get(resolver);
        const walletsCountWeeklyTimeseries =
          weeklyTimeseries.walletsCountTimeseriesByResolver.get(resolver);
        const volumeWeeklyTimeseries =
          weeklyTimeseries.volumeTimeseriesByResolver.get(resolver);

        if (
          !transactionsCountWeeklyTimeseries ||
          !walletsCountWeeklyTimeseries ||
          !volumeWeeklyTimeseries
        ) {
          throw new Error(`Missing timeseries for resolver ${resolver}`);
        }

        return [
          resolver,
          {
            transactionsCountAllTime: getAllTimeTotal(
              transactionsCountWeeklyTimeseries
            ),
            walletsCountAllTime: getAllTimeTotal(walletsCountWeeklyTimeseries),
            volumeAllTime: getAllTimeTotal(volumeWeeklyTimeseries),

            transactionsCountLastWeek: getLastPeriodValue(
              transactionsCountWeeklyTimeseries
            ),
            walletsCountLastWeek: getLastPeriodValue(
              walletsCountWeeklyTimeseries
            ),
            volumeLastWeek: getLastPeriodValue(volumeWeeklyTimeseries),

            transactionsCountLastWeekTrend: getTimeseriesTrend(
              transactionsCountWeeklyTimeseries
            ),
            walletsCountLastWeekTrend: getTimeseriesTrend(
              walletsCountWeeklyTimeseries
            ),
            volumeLastWeekTrend: getTimeseriesTrend(volumeWeeklyTimeseries),

            transactionsCountWeeklyTimeseries,
            walletsCountWeeklyTimeseries,
            volumeWeeklyTimeseries,
          },
        ];
      })
    ),
    allResolvers: {
      transactionsCountAllTime: getAllTimeTotal(
        transactionsCountWeeklyTimeseries
      ),
      walletsCountAllTime: getAllTimeTotal(walletsCountWeeklyTimeseries),
      volumeAllTime: getAllTimeTotal(volumeWeeklyTimeseries),

      transactionsCountLastWeek: getLastPeriodValue(
        transactionsCountWeeklyTimeseries
      ),
      walletsCountLastWeek: getLastPeriodValue(walletsCountWeeklyTimeseries),
      volumeLastWeek: getLastPeriodValue(volumeWeeklyTimeseries),

      transactionsCountLastWeekTrend: getTimeseriesTrend(
        transactionsCountWeeklyTimeseries
      ),
      walletsCountLastWeekTrend: getTimeseriesTrend(
        walletsCountWeeklyTimeseries
      ),
      volumeLastWeekTrend: getTimeseriesTrend(volumeWeeklyTimeseries),

      transactionsCountWeeklyTimeseries,
      walletsCountWeeklyTimeseries,
      volumeWeeklyTimeseries,
    },
  };
}

export function useFusionResolversMetrics(fusionResolvers?: FusionResolver[]) {
  const muiTheme = useTheme();
  const { chainStore } = useOneInchAnalyticsAPIContext();

  const featureFlags = useFeatureFlags();

  const { data, loading } = useQuery<
    FusionResolversQueryResponse,
    FusionResolversQueryVariables
  >(FUSION_RESOLVERS_QUERY, {
    skip: featureFlags.enableMockData,
  });

  const parsedData = useMemo(() => {
    if (
      !chainStore ||
      featureFlags.enableMockData === undefined ||
      !fusionResolvers
    ) {
      return undefined;
    }

    if (featureFlags.enableMockData) {
      const response = createMockFusionResolversQueryResponse();
      return parseFusionResolversQueryResponse(response, fusionResolvers);
    }

    if (!data) {
      return undefined;
    }

    return parseFusionResolversQueryResponse(data, fusionResolvers);
  }, [
    data,
    chainStore,
    featureFlags.enableMockData,
    fusionResolvers,
    muiTheme,
  ]);

  return {
    data: parsedData,
    loading: !parsedData || loading,
  };
}
