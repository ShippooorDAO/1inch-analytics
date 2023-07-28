/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  fragment WalletsAndTransactionsFields on Wallet {\n    timestamp\n    chain {\n      chainIdentifier\n    }\n    transactionCount\n    walletCount\n  }\n  fragment VolumeFields on Volume {\n    timestamp\n    chain {\n      chainIdentifier\n    }\n    volumeUsd\n  }\n  query getDexAggregatorOverview($chainIds: [String!]!) {\n    allTimeWalletsAndTransactionsCount: wallets(\n      chainIds: $chainIds\n      timespan: ALL\n    ) {\n      ...WalletsAndTransactionsFields\n    }\n    dailyWalletsAndTransactionsCount: wallets(\n      chainIds: $chainIds\n      timespan: DAY\n    ) {\n      ...WalletsAndTransactionsFields\n    }\n    weeklyWalletsAndTransactionsCount: wallets(\n      chainIds: $chainIds\n      timespan: WEEK\n    ) {\n      ...WalletsAndTransactionsFields\n    }\n    monthlyWalletsAndTransactionsCount: wallets(\n      chainIds: $chainIds\n      timespan: MONTH\n    ) {\n      ...WalletsAndTransactionsFields\n    }\n    allTimeVolume: volumes(chainIds: $chainIds, timespan: ALL) {\n      ...VolumeFields\n    }\n    dailyVolume: volumes(chainIds: $chainIds, timespan: DAY) {\n      ...VolumeFields\n    }\n    weeklyVolume: volumes(chainIds: $chainIds, timespan: WEEK) {\n      ...VolumeFields\n    }\n    monthlyVolume: volumes(chainIds: $chainIds, timespan: MONTH) {\n      ...VolumeFields\n    }\n  }\n": types.WalletsAndTransactionsFieldsFragmentDoc,
    "\n  query getFusionResolvers {\n    weeklyFusionResolvers: fusionResolvers(timespan: WEEK) {\n      id\n      timespan\n      timestamp\n      resolver\n      transactionCount\n      walletCount\n      totalVolumeUsd\n    }\n  }\n": types.GetFusionResolversDocument,
    "\n  query getFusionTopTraders(\n    $sortBy: String\n    $sortDirection: SortDirection\n    $pageNumber: Int\n    $pageSize: Int\n  ) {\n    fusionTopTraders(\n      sortBy: $sortBy\n      sortDirection: $sortDirection\n      pageNumber: $pageNumber\n      pageSize: $pageSize\n    ) {\n      fusionTopTraders {\n        id\n        address\n        chain {\n          id\n        }\n        transactionCount\n        volumeUsd\n      }\n      pageNumber\n      pageSize\n      totalEntries\n      totalPages\n    }\n  }\n": types.GetFusionTopTradersDocument,
    "\n  query getFusionTrades(\n    $assetIds: [String]\n    $chainIds: [String]\n    $filter: Filter\n    $pageNumber: Int\n    $pageSize: Int\n    $sortBy: String\n    $sortDirection: SortDirection\n  ) {\n    fusionTopTrades(\n      assetIds: $assetIds\n      chainIds: $chainIds\n      filter: $filter\n      pageNumber: $pageNumber\n      pageSize: $pageSize\n      sortBy: $sortBy\n      sortDirection: $sortDirection\n    ) {\n      pageNumber\n      pageSize\n      totalPages\n      totalEntries\n      fusionTopTrades {\n        id\n        chain {\n          id\n        }\n        destinationAsset {\n          id\n        }\n        sourceAsset {\n          id\n        }\n        executorAddress\n        receiverAddress\n        destinationUsdAmount\n        sourceUsdAmount\n        timestamp\n        transactionHash\n      }\n    }\n  }\n": types.GetFusionTradesDocument,
    "\n  query getStakingWallets(\n    $filter: Filter\n    $pageNumber: Int\n    $pageSize: Int\n    $sortBy: String\n    $sortDirection: SortDirection\n    $version: StakingVersion\n  ) {\n    stakingWallets(\n      filter: $filter\n      pageNumber: $pageNumber\n      pageSize: $pageSize\n      sortBy: $sortBy\n      sortDirection: $sortDirection\n      version: $version\n    ) {\n      totalEntries\n      totalPages\n      pageSize\n      pageNumber\n      stakingWallets {\n        id\n        address\n        delegated\n        stakingBalance\n        version\n      }\n    }\n  }\n": types.GetStakingWalletsDocument,
    "\n  query getTreasuryBalances {\n    treasuryBalances(pageSize: 100, sortBy: \"amountUsd\", sortDirection: DESC) {\n      pageNumber\n      pageSize\n      totalEntries\n      totalPages\n      treasuryBalances {\n        id\n        amount\n        amountUsd\n        asset {\n          id\n        }\n        chain {\n          id\n        }\n      }\n    }\n  }\n": types.GetTreasuryBalancesDocument,
    "\n  query getTreasuryCashflowBreakdown {\n    treasuryTransactionSums {\n      from {\n        label\n        sumUsd\n      }\n      to {\n        label\n        sumUsd\n      }\n    }\n  }\n": types.GetTreasuryCashflowBreakdownDocument,
    "\n  fragment TreasuryFlowFields on TreasuryFlow {\n    id\n    inboundVolumeUsd\n    outboundVolumeUsd\n    timespan\n    timestamp\n  }\n  query getTreasuryFlows {\n    dailyTreasuryFlows: treasuryFlows(timespan: DAY) {\n      ...TreasuryFlowFields\n    }\n    weeklyTreasuryFlows: treasuryFlows(timespan: WEEK) {\n      ...TreasuryFlowFields\n    }\n    monthlyTreasuryFlows: treasuryFlows(timespan: MONTH) {\n      ...TreasuryFlowFields\n    }\n  }\n": types.TreasuryFlowFieldsFragmentDoc,
    "\n  query getTreasuryTransactions(\n    $filter: Filter\n    $pageNumber: Int\n    $pageSize: Int\n    $sortBy: String\n    $sortDirection: SortDirection\n    $assetIds: [String]\n    $chainIds: [String]\n    $fromLabels: [String]\n    $toLabels: [String]\n  ) {\n    treasuryTransactions(\n      filter: $filter\n      pageNumber: $pageNumber\n      pageSize: $pageSize\n      sortBy: $sortBy\n      sortDirection: $sortDirection\n      assetIds: $assetIds\n      chainIds: $chainIds\n      fromLabels: $fromLabels\n      toLabels: $toLabels\n    ) {\n      pageNumber\n      pageSize\n      totalEntries\n      totalPages\n      treasuryTransactions {\n        amount\n        amountUsd\n        asset {\n          id\n        }\n        chain {\n          id\n        }\n        from\n        fromLabel\n        id\n        timestamp\n        to\n        toLabel\n        transactionHash\n      }\n    }\n  }\n": types.GetTreasuryTransactionsDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment WalletsAndTransactionsFields on Wallet {\n    timestamp\n    chain {\n      chainIdentifier\n    }\n    transactionCount\n    walletCount\n  }\n  fragment VolumeFields on Volume {\n    timestamp\n    chain {\n      chainIdentifier\n    }\n    volumeUsd\n  }\n  query getDexAggregatorOverview($chainIds: [String!]!) {\n    allTimeWalletsAndTransactionsCount: wallets(\n      chainIds: $chainIds\n      timespan: ALL\n    ) {\n      ...WalletsAndTransactionsFields\n    }\n    dailyWalletsAndTransactionsCount: wallets(\n      chainIds: $chainIds\n      timespan: DAY\n    ) {\n      ...WalletsAndTransactionsFields\n    }\n    weeklyWalletsAndTransactionsCount: wallets(\n      chainIds: $chainIds\n      timespan: WEEK\n    ) {\n      ...WalletsAndTransactionsFields\n    }\n    monthlyWalletsAndTransactionsCount: wallets(\n      chainIds: $chainIds\n      timespan: MONTH\n    ) {\n      ...WalletsAndTransactionsFields\n    }\n    allTimeVolume: volumes(chainIds: $chainIds, timespan: ALL) {\n      ...VolumeFields\n    }\n    dailyVolume: volumes(chainIds: $chainIds, timespan: DAY) {\n      ...VolumeFields\n    }\n    weeklyVolume: volumes(chainIds: $chainIds, timespan: WEEK) {\n      ...VolumeFields\n    }\n    monthlyVolume: volumes(chainIds: $chainIds, timespan: MONTH) {\n      ...VolumeFields\n    }\n  }\n"): (typeof documents)["\n  fragment WalletsAndTransactionsFields on Wallet {\n    timestamp\n    chain {\n      chainIdentifier\n    }\n    transactionCount\n    walletCount\n  }\n  fragment VolumeFields on Volume {\n    timestamp\n    chain {\n      chainIdentifier\n    }\n    volumeUsd\n  }\n  query getDexAggregatorOverview($chainIds: [String!]!) {\n    allTimeWalletsAndTransactionsCount: wallets(\n      chainIds: $chainIds\n      timespan: ALL\n    ) {\n      ...WalletsAndTransactionsFields\n    }\n    dailyWalletsAndTransactionsCount: wallets(\n      chainIds: $chainIds\n      timespan: DAY\n    ) {\n      ...WalletsAndTransactionsFields\n    }\n    weeklyWalletsAndTransactionsCount: wallets(\n      chainIds: $chainIds\n      timespan: WEEK\n    ) {\n      ...WalletsAndTransactionsFields\n    }\n    monthlyWalletsAndTransactionsCount: wallets(\n      chainIds: $chainIds\n      timespan: MONTH\n    ) {\n      ...WalletsAndTransactionsFields\n    }\n    allTimeVolume: volumes(chainIds: $chainIds, timespan: ALL) {\n      ...VolumeFields\n    }\n    dailyVolume: volumes(chainIds: $chainIds, timespan: DAY) {\n      ...VolumeFields\n    }\n    weeklyVolume: volumes(chainIds: $chainIds, timespan: WEEK) {\n      ...VolumeFields\n    }\n    monthlyVolume: volumes(chainIds: $chainIds, timespan: MONTH) {\n      ...VolumeFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getFusionResolvers {\n    weeklyFusionResolvers: fusionResolvers(timespan: WEEK) {\n      id\n      timespan\n      timestamp\n      resolver\n      transactionCount\n      walletCount\n      totalVolumeUsd\n    }\n  }\n"): (typeof documents)["\n  query getFusionResolvers {\n    weeklyFusionResolvers: fusionResolvers(timespan: WEEK) {\n      id\n      timespan\n      timestamp\n      resolver\n      transactionCount\n      walletCount\n      totalVolumeUsd\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getFusionTopTraders(\n    $sortBy: String\n    $sortDirection: SortDirection\n    $pageNumber: Int\n    $pageSize: Int\n  ) {\n    fusionTopTraders(\n      sortBy: $sortBy\n      sortDirection: $sortDirection\n      pageNumber: $pageNumber\n      pageSize: $pageSize\n    ) {\n      fusionTopTraders {\n        id\n        address\n        chain {\n          id\n        }\n        transactionCount\n        volumeUsd\n      }\n      pageNumber\n      pageSize\n      totalEntries\n      totalPages\n    }\n  }\n"): (typeof documents)["\n  query getFusionTopTraders(\n    $sortBy: String\n    $sortDirection: SortDirection\n    $pageNumber: Int\n    $pageSize: Int\n  ) {\n    fusionTopTraders(\n      sortBy: $sortBy\n      sortDirection: $sortDirection\n      pageNumber: $pageNumber\n      pageSize: $pageSize\n    ) {\n      fusionTopTraders {\n        id\n        address\n        chain {\n          id\n        }\n        transactionCount\n        volumeUsd\n      }\n      pageNumber\n      pageSize\n      totalEntries\n      totalPages\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getFusionTrades(\n    $assetIds: [String]\n    $chainIds: [String]\n    $filter: Filter\n    $pageNumber: Int\n    $pageSize: Int\n    $sortBy: String\n    $sortDirection: SortDirection\n  ) {\n    fusionTopTrades(\n      assetIds: $assetIds\n      chainIds: $chainIds\n      filter: $filter\n      pageNumber: $pageNumber\n      pageSize: $pageSize\n      sortBy: $sortBy\n      sortDirection: $sortDirection\n    ) {\n      pageNumber\n      pageSize\n      totalPages\n      totalEntries\n      fusionTopTrades {\n        id\n        chain {\n          id\n        }\n        destinationAsset {\n          id\n        }\n        sourceAsset {\n          id\n        }\n        executorAddress\n        receiverAddress\n        destinationUsdAmount\n        sourceUsdAmount\n        timestamp\n        transactionHash\n      }\n    }\n  }\n"): (typeof documents)["\n  query getFusionTrades(\n    $assetIds: [String]\n    $chainIds: [String]\n    $filter: Filter\n    $pageNumber: Int\n    $pageSize: Int\n    $sortBy: String\n    $sortDirection: SortDirection\n  ) {\n    fusionTopTrades(\n      assetIds: $assetIds\n      chainIds: $chainIds\n      filter: $filter\n      pageNumber: $pageNumber\n      pageSize: $pageSize\n      sortBy: $sortBy\n      sortDirection: $sortDirection\n    ) {\n      pageNumber\n      pageSize\n      totalPages\n      totalEntries\n      fusionTopTrades {\n        id\n        chain {\n          id\n        }\n        destinationAsset {\n          id\n        }\n        sourceAsset {\n          id\n        }\n        executorAddress\n        receiverAddress\n        destinationUsdAmount\n        sourceUsdAmount\n        timestamp\n        transactionHash\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getStakingWallets(\n    $filter: Filter\n    $pageNumber: Int\n    $pageSize: Int\n    $sortBy: String\n    $sortDirection: SortDirection\n    $version: StakingVersion\n  ) {\n    stakingWallets(\n      filter: $filter\n      pageNumber: $pageNumber\n      pageSize: $pageSize\n      sortBy: $sortBy\n      sortDirection: $sortDirection\n      version: $version\n    ) {\n      totalEntries\n      totalPages\n      pageSize\n      pageNumber\n      stakingWallets {\n        id\n        address\n        delegated\n        stakingBalance\n        version\n      }\n    }\n  }\n"): (typeof documents)["\n  query getStakingWallets(\n    $filter: Filter\n    $pageNumber: Int\n    $pageSize: Int\n    $sortBy: String\n    $sortDirection: SortDirection\n    $version: StakingVersion\n  ) {\n    stakingWallets(\n      filter: $filter\n      pageNumber: $pageNumber\n      pageSize: $pageSize\n      sortBy: $sortBy\n      sortDirection: $sortDirection\n      version: $version\n    ) {\n      totalEntries\n      totalPages\n      pageSize\n      pageNumber\n      stakingWallets {\n        id\n        address\n        delegated\n        stakingBalance\n        version\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getTreasuryBalances {\n    treasuryBalances(pageSize: 100, sortBy: \"amountUsd\", sortDirection: DESC) {\n      pageNumber\n      pageSize\n      totalEntries\n      totalPages\n      treasuryBalances {\n        id\n        amount\n        amountUsd\n        asset {\n          id\n        }\n        chain {\n          id\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query getTreasuryBalances {\n    treasuryBalances(pageSize: 100, sortBy: \"amountUsd\", sortDirection: DESC) {\n      pageNumber\n      pageSize\n      totalEntries\n      totalPages\n      treasuryBalances {\n        id\n        amount\n        amountUsd\n        asset {\n          id\n        }\n        chain {\n          id\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getTreasuryCashflowBreakdown {\n    treasuryTransactionSums {\n      from {\n        label\n        sumUsd\n      }\n      to {\n        label\n        sumUsd\n      }\n    }\n  }\n"): (typeof documents)["\n  query getTreasuryCashflowBreakdown {\n    treasuryTransactionSums {\n      from {\n        label\n        sumUsd\n      }\n      to {\n        label\n        sumUsd\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment TreasuryFlowFields on TreasuryFlow {\n    id\n    inboundVolumeUsd\n    outboundVolumeUsd\n    timespan\n    timestamp\n  }\n  query getTreasuryFlows {\n    dailyTreasuryFlows: treasuryFlows(timespan: DAY) {\n      ...TreasuryFlowFields\n    }\n    weeklyTreasuryFlows: treasuryFlows(timespan: WEEK) {\n      ...TreasuryFlowFields\n    }\n    monthlyTreasuryFlows: treasuryFlows(timespan: MONTH) {\n      ...TreasuryFlowFields\n    }\n  }\n"): (typeof documents)["\n  fragment TreasuryFlowFields on TreasuryFlow {\n    id\n    inboundVolumeUsd\n    outboundVolumeUsd\n    timespan\n    timestamp\n  }\n  query getTreasuryFlows {\n    dailyTreasuryFlows: treasuryFlows(timespan: DAY) {\n      ...TreasuryFlowFields\n    }\n    weeklyTreasuryFlows: treasuryFlows(timespan: WEEK) {\n      ...TreasuryFlowFields\n    }\n    monthlyTreasuryFlows: treasuryFlows(timespan: MONTH) {\n      ...TreasuryFlowFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getTreasuryTransactions(\n    $filter: Filter\n    $pageNumber: Int\n    $pageSize: Int\n    $sortBy: String\n    $sortDirection: SortDirection\n    $assetIds: [String]\n    $chainIds: [String]\n    $fromLabels: [String]\n    $toLabels: [String]\n  ) {\n    treasuryTransactions(\n      filter: $filter\n      pageNumber: $pageNumber\n      pageSize: $pageSize\n      sortBy: $sortBy\n      sortDirection: $sortDirection\n      assetIds: $assetIds\n      chainIds: $chainIds\n      fromLabels: $fromLabels\n      toLabels: $toLabels\n    ) {\n      pageNumber\n      pageSize\n      totalEntries\n      totalPages\n      treasuryTransactions {\n        amount\n        amountUsd\n        asset {\n          id\n        }\n        chain {\n          id\n        }\n        from\n        fromLabel\n        id\n        timestamp\n        to\n        toLabel\n        transactionHash\n      }\n    }\n  }\n"): (typeof documents)["\n  query getTreasuryTransactions(\n    $filter: Filter\n    $pageNumber: Int\n    $pageSize: Int\n    $sortBy: String\n    $sortDirection: SortDirection\n    $assetIds: [String]\n    $chainIds: [String]\n    $fromLabels: [String]\n    $toLabels: [String]\n  ) {\n    treasuryTransactions(\n      filter: $filter\n      pageNumber: $pageNumber\n      pageSize: $pageSize\n      sortBy: $sortBy\n      sortDirection: $sortDirection\n      assetIds: $assetIds\n      chainIds: $chainIds\n      fromLabels: $fromLabels\n      toLabels: $toLabels\n    ) {\n      pageNumber\n      pageSize\n      totalEntries\n      totalPages\n      treasuryTransactions {\n        amount\n        amountUsd\n        asset {\n          id\n        }\n        chain {\n          id\n        }\n        from\n        fromLabel\n        id\n        timestamp\n        to\n        toLabel\n        transactionHash\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;