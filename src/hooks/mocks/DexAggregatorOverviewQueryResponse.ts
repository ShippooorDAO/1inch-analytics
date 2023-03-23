import { ChainId } from '@/shared/Model/Chain';

import {
  DexAggregatorOverviewQueryResponse,
  DexAggregatorOverviewQueryVolumesQueryResponse,
  DexAggregatorOverviewWalletsAndTransactionsQueryResponse,
} from '../useDexAggregatorOverview';

const mockWalletAndTransactionDataPoint = {
  timestamp: Math.floor(Date.now() / 1000),
  chain: {
    chainIdentifier: 1,
  },
  transactionCount: 1234,
  walletCount: 1234,
};

const mockVolumeDataPoint = {
  timestamp: Math.floor(Date.now() / 1000),
  chain: {
    chainIdentifier: 1,
  },
  volumeUsd: 1234,
};

function createMockWalletAndTransactionDataPoint(
  timestamp: number,
  chainId: ChainId,
  transactionCount = 1234525,
  walletCount = 123424
): DexAggregatorOverviewWalletsAndTransactionsQueryResponse {
  return {
    timestamp,
    chain: {
      chainIdentifier: String(chainId),
    },
    transactionCount,
    walletCount,
  };
}

function createMockVolumeDataPoint(
  timestamp: number,
  chainId: ChainId,
  volumeUsd = 1234525
): DexAggregatorOverviewQueryVolumesQueryResponse {
  return {
    timestamp,
    chain: {
      chainIdentifier: String(chainId),
    },
    volumeUsd,
  };
}

function createDailyTimestamps(
  startTimestamp: number,
  endTimestamp: number
): number[] {
  const timestamps = [];
  let timestamp = startTimestamp;
  while (timestamp < endTimestamp) {
    timestamps.push(timestamp);
    timestamp += 86400;
  }
  return timestamps;
}

function createWeeklyTimestamps(
  startTimestamp: number,
  endTimestamp: number
): number[] {
  const timestamps = [];
  let timestamp = startTimestamp;
  while (timestamp < endTimestamp) {
    timestamps.push(timestamp);
    timestamp += 604800;
  }
  return timestamps;
}

function createMonthlyTimestamps(
  startTimestamp: number,
  endTimestamp: number
): number[] {
  const timestamps = [];
  let timestamp = startTimestamp;
  while (timestamp < endTimestamp) {
    timestamps.push(timestamp);
    timestamp += 2629743;
  }
  return timestamps;
}

export function createMockDexAggregatorOverviewResponse(
  volume = 1234525,
  liquidity = 123424
): DexAggregatorOverviewQueryResponse {
  const startTimestamp = Math.floor(Date.now() / 1000) - 86400 * 365;
  const endTimestamp = Math.floor(Date.now() / 1000);

  const dailyTimestamps = createDailyTimestamps(startTimestamp, endTimestamp);
  const weeklyTimestamps = createWeeklyTimestamps(startTimestamp, endTimestamp);
  const monthlyTimestamps = createMonthlyTimestamps(
    startTimestamp,
    endTimestamp
  );

  const dailyVolume = dailyTimestamps
    .map((timestamp) =>
      Object.values(ChainId).map((chainId) =>
        createMockVolumeDataPoint(timestamp, chainId as ChainId, volume)
      )
    )
    .flat();

  const weeklyVolume = weeklyTimestamps
    .map((timestamp) =>
      Object.values(ChainId).map((chainId) =>
        createMockVolumeDataPoint(timestamp, chainId as ChainId, volume)
      )
    )
    .flat();

  const monthlyVolume = monthlyTimestamps
    .map((timestamp) =>
      Object.values(ChainId).map((chainId) =>
        createMockVolumeDataPoint(timestamp, chainId as ChainId, volume)
      )
    )
    .flat();

  const allTimeVolume = [endTimestamp]
    .map((timestamp) =>
      Object.values(ChainId).map((chainId) =>
        createMockVolumeDataPoint(timestamp, chainId as ChainId, volume)
      )
    )
    .flat();

  const dailyWalletsAndTransactionsCount = dailyTimestamps
    .map((timestamp) =>
      Object.values(ChainId).map((chainId) =>
        createMockWalletAndTransactionDataPoint(
          timestamp,
          chainId as ChainId,
          volume,
          liquidity
        )
      )
    )
    .flat();

  const weeklyWalletsAndTransactionsCount = weeklyTimestamps
    .map((timestamp) =>
      Object.values(ChainId).map((chainId) =>
        createMockWalletAndTransactionDataPoint(
          timestamp,
          chainId as ChainId,
          volume,
          liquidity
        )
      )
    )
    .flat();

  const monthlyWalletsAndTransactionsCount = monthlyTimestamps
    .map((timestamp) =>
      Object.values(ChainId).map((chainId) =>
        createMockWalletAndTransactionDataPoint(
          timestamp,
          chainId as ChainId,
          volume,
          liquidity
        )
      )
    )
    .flat();

  const allTimeWalletsAndTransactionsCount = [endTimestamp]
    .map((timestamp) =>
      Object.values(ChainId).map((chainId) =>
        createMockWalletAndTransactionDataPoint(
          timestamp,
          chainId as ChainId,
          volume,
          liquidity
        )
      )
    )
    .flat();

  return {
    allTimeWalletsAndTransactionsCount,
    dailyWalletsAndTransactionsCount,
    weeklyWalletsAndTransactionsCount,
    monthlyWalletsAndTransactionsCount,
    allTimeVolume,
    dailyVolume,
    weeklyVolume,
    monthlyVolume,
  };
}
