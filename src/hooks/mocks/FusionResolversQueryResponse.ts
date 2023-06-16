import { v4 as uuidv4 } from 'uuid';

import { createWeeklyTimestamps } from './utils';

function createMockDataPoint(
  timestamp: number,
  resolver: string,
  maxVolume: number,
  maxTransactionCount: number,
  maxWalletCount: number
) {
  return {
    id: uuidv4(),
    timestamp,
    resolver,
    totalVolumeUsd: Math.floor(maxVolume * Math.random()),
    transactionCount: Math.floor(maxTransactionCount * Math.random()),
    walletCount: Math.floor(maxWalletCount * Math.random()),
    timespan: 'WEEK',
  };
}

export function createMockFusionResolversQueryResponse(
  maxVolume = 1e10,
  maxTransactionCount = 50000,
  maxWalletCount = 30000
) {
  const startTimestamp = Math.floor(Date.now() / 1000) - 86400 * 365;
  const endTimestamp = Math.floor(Date.now() / 1000);

  const weeklyTimestamps = createWeeklyTimestamps(startTimestamp, endTimestamp);

  const resolvers = [
    '1inch Labs',
    'Alpha',
    'The T Resolver',
    'OTEX',
    'Arctic Bastion',
    'Seawise',
    'The Open DAO resolver',
    'Laertes',
    'Kinetex Labs Resolver',
    'Other',
  ];

  const weeklyFusionResolvers = resolvers
    .map((resolver) =>
      weeklyTimestamps.map((timestamp) =>
        createMockDataPoint(
          timestamp,
          resolver,
          maxVolume,
          maxTransactionCount,
          maxWalletCount
        )
      )
    )
    .flat();

  return {
    weeklyFusionResolvers,
  };
}
