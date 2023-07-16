import { gql, useQuery } from '@apollo/client';

import {
  GetTreasuryFlowsQuery,
  GetTreasuryFlowsQueryVariables,
} from '@/gql/graphql';
import { Timeseries } from '@/shared/Model/Timeseries';

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

  return {
    inboundVolumeUsdTimeseries,
    outboundVolumeUsdTimeseries,
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
