import { gql, useQuery } from '@apollo/client';

import {
  GetTreasuryFlowsQuery,
  GetTreasuryFlowsQueryVariables,
} from '@/gql/graphql';
import { DataPoint, Timeseries } from '@/shared/Model/Timeseries';

const QUERY = gql`
  query getTreasuryFlows($timespan: TreasuryFlowTimespan) {
    treasuryFlows(timespan: $timespan) {
      id
      inboundVolumeUsd
      outboundVolumeUsd
      timespan
      timestamp
    }
  }
`;

function convertResponseToModel(response: GetTreasuryFlowsQuery) {
  const data = response.treasuryFlows
    ?.filter(
      (f) =>
        !!f &&
        !!f.id &&
        !!f.timestamp &&
        f.inboundVolumeUsd !== null &&
        f.inboundVolumeUsd !== undefined &&
        f.outboundVolumeUsd !== null &&
        f.outboundVolumeUsd !== undefined
    )
    .map((f) => f!)
    .sort((a, b) => a.timestamp! - b.timestamp!)
    .map((flow) => ({
      timestamp: flow.timestamp!,
      inboundVolumeUsd: flow.inboundVolumeUsd ?? 0,
      outboundVolumeUsd: flow.outboundVolumeUsd ?? 0,
    }));

  const inboundVolumeUsdTimeseries: Timeseries = {
    name: 'Inbound Volume (USD)',
    data:
      data?.map((flow) => ({
        x: flow.timestamp,
        y: flow.inboundVolumeUsd,
      })) ?? [],
  };
  const outboundVolumeUsdTimeseries: Timeseries = {
    name: 'Inbound Volume (USD)',
    data:
      data?.map((flow) => ({
        x: flow.timestamp,
        y: flow.inboundVolumeUsd,
      })) ?? [],
  };

  const balanceUsdTimeseries: Timeseries = {
    name: 'Balance (USD)',
    data:
      data?.reduce((acc, flow) => {
        const latestValue = acc[acc.length - 1]?.y ?? 0;
        acc.push({
          x: flow.timestamp,
          y: flow.inboundVolumeUsd + flow.outboundVolumeUsd + latestValue,
        });
        return acc;
      }, [] as DataPoint[]) ?? [],
  };

  return {
    inboundVolumeUsdTimeseries,
    outboundVolumeUsdTimeseries,
    balanceUsdTimeseries,
  };
}

export function useTreasuryFlows() {
  const { data, loading, error } = useQuery<
    GetTreasuryFlowsQuery,
    GetTreasuryFlowsQueryVariables
  >(QUERY);

  const treasuryFlows = data ? convertResponseToModel(data) : undefined;

  return {
    treasuryFlows,
    loading,
    error,
  };
}
