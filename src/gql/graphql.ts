/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Asset = {
  __typename?: 'Asset';
  address?: Maybe<Scalars['String']['output']>;
  chain?: Maybe<Chain>;
  decimals?: Maybe<Scalars['Int']['output']>;
  /** Asset object */
  id?: Maybe<Scalars['ID']['output']>;
  logoUrl?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  price?: Maybe<Scalars['Float']['output']>;
  priceUsd?: Maybe<Scalars['Float']['output']>;
  symbol?: Maybe<Scalars['String']['output']>;
};

export type BigintFilter = {
  field: Scalars['String']['input'];
  operator: Operator;
  value: Scalars['String']['input'];
};

export type BoolFilter = {
  field: Scalars['String']['input'];
  value: Scalars['Boolean']['input'];
};

export type Chain = {
  __typename?: 'Chain';
  chainIdentifier?: Maybe<Scalars['Int']['output']>;
  /** Chain object */
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  nativeToken?: Maybe<Scalars['String']['output']>;
};

export type Filter = {
  bigintFilters?: InputMaybe<Array<InputMaybe<BigintFilter>>>;
  boolFilters?: InputMaybe<Array<InputMaybe<BoolFilter>>>;
  floatFilters?: InputMaybe<Array<InputMaybe<FloatFilter>>>;
  integerFilters?: InputMaybe<Array<InputMaybe<IntegerFilter>>>;
  stringFilters?: InputMaybe<Array<InputMaybe<StringFilter>>>;
};

export type FloatFilter = {
  field: Scalars['String']['input'];
  operator: Operator;
  value: Scalars['Float']['input'];
};

export type FusionResolver = {
  __typename?: 'FusionResolver';
  /** Fusion resolver object */
  id?: Maybe<Scalars['ID']['output']>;
  resolver?: Maybe<Scalars['String']['output']>;
  timespan?: Maybe<FusionResolverTimespan>;
  timestamp?: Maybe<Scalars['Int']['output']>;
  totalVolumeUsd?: Maybe<Scalars['Float']['output']>;
  transactionCount?: Maybe<Scalars['Int']['output']>;
  walletCount?: Maybe<Scalars['Int']['output']>;
};

export enum FusionResolverTimespan {
  Week = 'WEEK'
}

export type FusionTopTrade = {
  __typename?: 'FusionTopTrade';
  chain?: Maybe<Chain>;
  destinationAsset?: Maybe<Asset>;
  destinationUsdAmount?: Maybe<Scalars['Float']['output']>;
  executorAddress?: Maybe<Scalars['String']['output']>;
  /** Fusion top trade object */
  id?: Maybe<Scalars['ID']['output']>;
  receiverAddress?: Maybe<Scalars['String']['output']>;
  sourceAsset?: Maybe<Asset>;
  sourceUsdAmount?: Maybe<Scalars['Float']['output']>;
  timestamp?: Maybe<Scalars['Int']['output']>;
  transactionHash?: Maybe<Scalars['String']['output']>;
};

export type FusionTopTrader = {
  __typename?: 'FusionTopTrader';
  address?: Maybe<Scalars['String']['output']>;
  chain?: Maybe<Chain>;
  /** Fusion top trader object */
  id?: Maybe<Scalars['ID']['output']>;
  transactionCount?: Maybe<Scalars['Int']['output']>;
  volumeUsd?: Maybe<Scalars['Float']['output']>;
};

export type FusionTopTraders = {
  __typename?: 'FusionTopTraders';
  fusionTopTraders?: Maybe<Array<Maybe<FusionTopTrader>>>;
  pageNumber?: Maybe<Scalars['Int']['output']>;
  pageSize?: Maybe<Scalars['Int']['output']>;
  totalEntries?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type FusionTopTrades = {
  __typename?: 'FusionTopTrades';
  fusionTopTrades?: Maybe<Array<Maybe<FusionTopTrade>>>;
  pageNumber?: Maybe<Scalars['Int']['output']>;
  pageSize?: Maybe<Scalars['Int']['output']>;
  totalEntries?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type FusionVolume = {
  __typename?: 'FusionVolume';
  /** Fusion volume object */
  id?: Maybe<Scalars['ID']['output']>;
  timespan?: Maybe<FusionVolumeTimespan>;
  timestamp?: Maybe<Scalars['Int']['output']>;
  totalVolumeUsd?: Maybe<Scalars['Float']['output']>;
  transactionCount?: Maybe<Scalars['Int']['output']>;
  volumeDexesUsd?: Maybe<Scalars['Float']['output']>;
  volumeFusionUsd?: Maybe<Scalars['Float']['output']>;
  walletCount?: Maybe<Scalars['Int']['output']>;
};

export enum FusionVolumeTimespan {
  All = 'ALL',
  Day = 'DAY',
  Hour = 'HOUR',
  Week = 'WEEK'
}

export type IntegerFilter = {
  field: Scalars['String']['input'];
  operator: Operator;
  value: Scalars['Int']['input'];
};

export enum Operator {
  Eq = 'EQ',
  Gt = 'GT',
  GtEq = 'GT_EQ',
  Sm = 'SM',
  SmEq = 'SM_EQ'
}

export type RootQueryType = {
  __typename?: 'RootQueryType';
  /** Fetch assets */
  assets?: Maybe<Array<Maybe<Asset>>>;
  /** Fetch all chains */
  chains?: Maybe<Array<Maybe<Chain>>>;
  /** Fetch fusion resolvers */
  fusionResolvers?: Maybe<Array<Maybe<FusionResolver>>>;
  /** Fetch fusion top traders */
  fusionTopTraders?: Maybe<FusionTopTraders>;
  /** Fetch fusion top trades */
  fusionTopTrades?: Maybe<FusionTopTrades>;
  /** Fetch fusion volumes */
  fusionVolumes?: Maybe<Array<Maybe<FusionVolume>>>;
  /** Fetch staking wallets */
  stakingWallets?: Maybe<StakingWallets>;
  /** Fetch system status */
  systemStatus?: Maybe<SystemStatus>;
  /** Fetch treasury transactions */
  treasuryBalances?: Maybe<TreasuryBalances>;
  /** Fetch treasury flows */
  treasuryFlows?: Maybe<Array<Maybe<TreasuryFlow>>>;
  /** Fetch treasury transactions */
  treasuryTransactions?: Maybe<TreasuryTransactions>;
  /** Fetch volumes */
  volumes?: Maybe<Array<Maybe<Volume>>>;
  /** Fetch wallets */
  wallets?: Maybe<Array<Maybe<Wallet>>>;
};


export type RootQueryTypeAssetsArgs = {
  chainIds?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type RootQueryTypeFusionResolversArgs = {
  timespan?: InputMaybe<FusionResolverTimespan>;
};


export type RootQueryTypeFusionTopTradersArgs = {
  chainIds?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  filter?: InputMaybe<Filter>;
  pageNumber?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Scalars['String']['input']>;
  sortDirection?: InputMaybe<SortDirection>;
};


export type RootQueryTypeFusionTopTradesArgs = {
  assetIds?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  chainIds?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  filter?: InputMaybe<Filter>;
  pageNumber?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Scalars['String']['input']>;
  sortDirection?: InputMaybe<SortDirection>;
};


export type RootQueryTypeFusionVolumesArgs = {
  timespan?: InputMaybe<FusionVolumeTimespan>;
};


export type RootQueryTypeStakingWalletsArgs = {
  filter?: InputMaybe<Filter>;
  pageNumber?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Scalars['String']['input']>;
  sortDirection?: InputMaybe<SortDirection>;
  version?: InputMaybe<StakingVersion>;
};


export type RootQueryTypeTreasuryBalancesArgs = {
  filter?: InputMaybe<Filter>;
  pageNumber?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Scalars['String']['input']>;
  sortDirection?: InputMaybe<SortDirection>;
};


export type RootQueryTypeTreasuryFlowsArgs = {
  timespan?: InputMaybe<TreasuryFlowTimespan>;
};


export type RootQueryTypeTreasuryTransactionsArgs = {
  filter?: InputMaybe<Filter>;
  pageNumber?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Scalars['String']['input']>;
  sortDirection?: InputMaybe<SortDirection>;
};


export type RootQueryTypeVolumesArgs = {
  chainIds?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  timespan?: InputMaybe<VolumeTimespan>;
};


export type RootQueryTypeWalletsArgs = {
  chainIds?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  timespan?: InputMaybe<WalletTimespan>;
};

export enum SortDirection {
  Asc = 'ASC',
  Desc = 'DESC'
}

export enum StakingVersion {
  All = 'ALL',
  One = 'ONE',
  Two = 'TWO'
}

export type StakingWallet = {
  __typename?: 'StakingWallet';
  address?: Maybe<Scalars['String']['output']>;
  delegated?: Maybe<Scalars['Boolean']['output']>;
  /** Staking Wallet object */
  id?: Maybe<Scalars['ID']['output']>;
  stakingBalance?: Maybe<Scalars['Float']['output']>;
  version?: Maybe<Scalars['String']['output']>;
};

export type StakingWallets = {
  __typename?: 'StakingWallets';
  pageNumber?: Maybe<Scalars['Int']['output']>;
  pageSize?: Maybe<Scalars['Int']['output']>;
  stakingWallets?: Maybe<Array<Maybe<StakingWallet>>>;
  totalEntries?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type StringFilter = {
  contains?: InputMaybe<Scalars['String']['input']>;
  field: Scalars['String']['input'];
};

export type SystemStatus = {
  __typename?: 'SystemStatus';
  /** System status object */
  id?: Maybe<Scalars['ID']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type TreasuryBalance = {
  __typename?: 'TreasuryBalance';
  amount?: Maybe<Scalars['Float']['output']>;
  amountUsd?: Maybe<Scalars['Float']['output']>;
  asset?: Maybe<Asset>;
  /** Treasury transaction object */
  id?: Maybe<Scalars['ID']['output']>;
};

export type TreasuryBalances = {
  __typename?: 'TreasuryBalances';
  pageNumber?: Maybe<Scalars['Int']['output']>;
  pageSize?: Maybe<Scalars['Int']['output']>;
  totalEntries?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
  treasuryBalances?: Maybe<Array<Maybe<TreasuryBalance>>>;
};

export type TreasuryFlow = {
  __typename?: 'TreasuryFlow';
  /** Treasury flow object */
  id?: Maybe<Scalars['ID']['output']>;
  inboundVolumeUsd?: Maybe<Scalars['Float']['output']>;
  outboundVolumeUsd?: Maybe<Scalars['Float']['output']>;
  timespan?: Maybe<TreasuryFlowTimespan>;
  timestamp?: Maybe<Scalars['Int']['output']>;
};

export enum TreasuryFlowTimespan {
  Day = 'DAY',
  Month = 'MONTH',
  Week = 'WEEK'
}

export type TreasuryTransaction = {
  __typename?: 'TreasuryTransaction';
  amount?: Maybe<Scalars['Float']['output']>;
  amountUsd?: Maybe<Scalars['Float']['output']>;
  asset?: Maybe<Asset>;
  from?: Maybe<Scalars['String']['output']>;
  /** Treasury transaction object */
  id?: Maybe<Scalars['ID']['output']>;
  timestamp?: Maybe<Scalars['Int']['output']>;
  to?: Maybe<Scalars['String']['output']>;
  transactionHash?: Maybe<Scalars['String']['output']>;
};

export type TreasuryTransactions = {
  __typename?: 'TreasuryTransactions';
  pageNumber?: Maybe<Scalars['Int']['output']>;
  pageSize?: Maybe<Scalars['Int']['output']>;
  totalEntries?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
  treasuryTransactions?: Maybe<Array<Maybe<TreasuryTransaction>>>;
};

export type Volume = {
  __typename?: 'Volume';
  chain?: Maybe<Chain>;
  /** Volume object */
  id?: Maybe<Scalars['ID']['output']>;
  timespan?: Maybe<VolumeTimespan>;
  timestamp?: Maybe<Scalars['Int']['output']>;
  transactionCount?: Maybe<Scalars['Int']['output']>;
  volumeUsd?: Maybe<Scalars['Float']['output']>;
};

export enum VolumeTimespan {
  All = 'ALL',
  Day = 'DAY',
  Month = 'MONTH',
  Week = 'WEEK'
}

export type Wallet = {
  __typename?: 'Wallet';
  chain?: Maybe<Chain>;
  /** Wallet object */
  id?: Maybe<Scalars['ID']['output']>;
  timespan?: Maybe<WalletTimespan>;
  timestamp?: Maybe<Scalars['Int']['output']>;
  transactionCount?: Maybe<Scalars['Int']['output']>;
  walletCount?: Maybe<Scalars['Int']['output']>;
};

export enum WalletTimespan {
  All = 'ALL',
  Day = 'DAY',
  Month = 'MONTH',
  Week = 'WEEK'
}

export type WalletsAndTransactionsFieldsFragment = { __typename?: 'Wallet', timestamp?: number | null, transactionCount?: number | null, walletCount?: number | null, chain?: { __typename?: 'Chain', chainIdentifier?: number | null } | null } & { ' $fragmentName'?: 'WalletsAndTransactionsFieldsFragment' };

export type VolumeFieldsFragment = { __typename?: 'Volume', timestamp?: number | null, volumeUsd?: number | null, chain?: { __typename?: 'Chain', chainIdentifier?: number | null } | null } & { ' $fragmentName'?: 'VolumeFieldsFragment' };

export type GetDexAggregatorOverviewQueryVariables = Exact<{
  chainIds: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type GetDexAggregatorOverviewQuery = { __typename?: 'RootQueryType', allTimeWalletsAndTransactionsCount?: Array<(
    { __typename?: 'Wallet' }
    & { ' $fragmentRefs'?: { 'WalletsAndTransactionsFieldsFragment': WalletsAndTransactionsFieldsFragment } }
  ) | null> | null, dailyWalletsAndTransactionsCount?: Array<(
    { __typename?: 'Wallet' }
    & { ' $fragmentRefs'?: { 'WalletsAndTransactionsFieldsFragment': WalletsAndTransactionsFieldsFragment } }
  ) | null> | null, weeklyWalletsAndTransactionsCount?: Array<(
    { __typename?: 'Wallet' }
    & { ' $fragmentRefs'?: { 'WalletsAndTransactionsFieldsFragment': WalletsAndTransactionsFieldsFragment } }
  ) | null> | null, monthlyWalletsAndTransactionsCount?: Array<(
    { __typename?: 'Wallet' }
    & { ' $fragmentRefs'?: { 'WalletsAndTransactionsFieldsFragment': WalletsAndTransactionsFieldsFragment } }
  ) | null> | null, allTimeVolume?: Array<(
    { __typename?: 'Volume' }
    & { ' $fragmentRefs'?: { 'VolumeFieldsFragment': VolumeFieldsFragment } }
  ) | null> | null, dailyVolume?: Array<(
    { __typename?: 'Volume' }
    & { ' $fragmentRefs'?: { 'VolumeFieldsFragment': VolumeFieldsFragment } }
  ) | null> | null, weeklyVolume?: Array<(
    { __typename?: 'Volume' }
    & { ' $fragmentRefs'?: { 'VolumeFieldsFragment': VolumeFieldsFragment } }
  ) | null> | null, monthlyVolume?: Array<(
    { __typename?: 'Volume' }
    & { ' $fragmentRefs'?: { 'VolumeFieldsFragment': VolumeFieldsFragment } }
  ) | null> | null };

export type GetFusionResolversQueryVariables = Exact<{ [key: string]: never; }>;


export type GetFusionResolversQuery = { __typename?: 'RootQueryType', weeklyFusionResolvers?: Array<{ __typename?: 'FusionResolver', id?: string | null, timespan?: FusionResolverTimespan | null, timestamp?: number | null, resolver?: string | null, transactionCount?: number | null, walletCount?: number | null, totalVolumeUsd?: number | null } | null> | null };

export type GetFusionTopTradersQueryVariables = Exact<{
  sortBy?: InputMaybe<Scalars['String']['input']>;
  sortDirection?: InputMaybe<SortDirection>;
  pageNumber?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetFusionTopTradersQuery = { __typename?: 'RootQueryType', fusionTopTraders?: { __typename?: 'FusionTopTraders', pageNumber?: number | null, pageSize?: number | null, totalEntries?: number | null, totalPages?: number | null, fusionTopTraders?: Array<{ __typename?: 'FusionTopTrader', id?: string | null, address?: string | null, transactionCount?: number | null, volumeUsd?: number | null, chain?: { __typename?: 'Chain', id?: string | null } | null } | null> | null } | null };

export type GetFusionTradesQueryVariables = Exact<{
  assetIds?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>> | InputMaybe<Scalars['String']['input']>>;
  chainIds?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>> | InputMaybe<Scalars['String']['input']>>;
  filter?: InputMaybe<Filter>;
  pageNumber?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Scalars['String']['input']>;
  sortDirection?: InputMaybe<SortDirection>;
}>;


export type GetFusionTradesQuery = { __typename?: 'RootQueryType', fusionTopTrades?: { __typename?: 'FusionTopTrades', pageNumber?: number | null, pageSize?: number | null, totalPages?: number | null, totalEntries?: number | null, fusionTopTrades?: Array<{ __typename?: 'FusionTopTrade', id?: string | null, executorAddress?: string | null, receiverAddress?: string | null, destinationUsdAmount?: number | null, sourceUsdAmount?: number | null, timestamp?: number | null, transactionHash?: string | null, chain?: { __typename?: 'Chain', id?: string | null } | null, destinationAsset?: { __typename?: 'Asset', id?: string | null } | null, sourceAsset?: { __typename?: 'Asset', id?: string | null } | null } | null> | null } | null };

export type GetStakingWalletsQueryVariables = Exact<{
  filter?: InputMaybe<Filter>;
  pageNumber?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Scalars['String']['input']>;
  sortDirection?: InputMaybe<SortDirection>;
  version?: InputMaybe<StakingVersion>;
}>;


export type GetStakingWalletsQuery = { __typename?: 'RootQueryType', stakingWallets?: { __typename?: 'StakingWallets', totalEntries?: number | null, totalPages?: number | null, pageSize?: number | null, pageNumber?: number | null, stakingWallets?: Array<{ __typename?: 'StakingWallet', id?: string | null, address?: string | null, delegated?: boolean | null, stakingBalance?: number | null, version?: string | null } | null> | null } | null };

export type GetTreasuryFlowsQueryVariables = Exact<{
  timespan?: InputMaybe<TreasuryFlowTimespan>;
}>;


export type GetTreasuryFlowsQuery = { __typename?: 'RootQueryType', treasuryFlows?: Array<{ __typename?: 'TreasuryFlow', id?: string | null, inboundVolumeUsd?: number | null, outboundVolumeUsd?: number | null, timespan?: TreasuryFlowTimespan | null, timestamp?: number | null } | null> | null };

export type GetTreasuryTransactionsQueryVariables = Exact<{
  filter?: InputMaybe<Filter>;
  pageNumber?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Scalars['String']['input']>;
  sortDirection?: InputMaybe<SortDirection>;
}>;


export type GetTreasuryTransactionsQuery = { __typename?: 'RootQueryType', treasuryTransactions?: { __typename?: 'TreasuryTransactions', pageNumber?: number | null, pageSize?: number | null, totalEntries?: number | null, totalPages?: number | null, treasuryTransactions?: Array<{ __typename?: 'TreasuryTransaction', amount?: number | null, amountUsd?: number | null, from?: string | null, id?: string | null, timestamp?: number | null, to?: string | null, transactionHash?: string | null, asset?: { __typename?: 'Asset', id?: string | null } | null } | null> | null } | null };

export const WalletsAndTransactionsFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WalletsAndTransactionsFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Wallet"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"chain"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chainIdentifier"}}]}},{"kind":"Field","name":{"kind":"Name","value":"transactionCount"}},{"kind":"Field","name":{"kind":"Name","value":"walletCount"}}]}}]} as unknown as DocumentNode<WalletsAndTransactionsFieldsFragment, unknown>;
export const VolumeFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"VolumeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Volume"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"chain"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chainIdentifier"}}]}},{"kind":"Field","name":{"kind":"Name","value":"volumeUsd"}}]}}]} as unknown as DocumentNode<VolumeFieldsFragment, unknown>;
export const GetDexAggregatorOverviewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getDexAggregatorOverview"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"chainIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"allTimeWalletsAndTransactionsCount"},"name":{"kind":"Name","value":"wallets"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"chainIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"chainIds"}}},{"kind":"Argument","name":{"kind":"Name","value":"timespan"},"value":{"kind":"EnumValue","value":"ALL"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"WalletsAndTransactionsFields"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"dailyWalletsAndTransactionsCount"},"name":{"kind":"Name","value":"wallets"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"chainIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"chainIds"}}},{"kind":"Argument","name":{"kind":"Name","value":"timespan"},"value":{"kind":"EnumValue","value":"DAY"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"WalletsAndTransactionsFields"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"weeklyWalletsAndTransactionsCount"},"name":{"kind":"Name","value":"wallets"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"chainIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"chainIds"}}},{"kind":"Argument","name":{"kind":"Name","value":"timespan"},"value":{"kind":"EnumValue","value":"WEEK"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"WalletsAndTransactionsFields"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"monthlyWalletsAndTransactionsCount"},"name":{"kind":"Name","value":"wallets"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"chainIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"chainIds"}}},{"kind":"Argument","name":{"kind":"Name","value":"timespan"},"value":{"kind":"EnumValue","value":"MONTH"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"WalletsAndTransactionsFields"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"allTimeVolume"},"name":{"kind":"Name","value":"volumes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"chainIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"chainIds"}}},{"kind":"Argument","name":{"kind":"Name","value":"timespan"},"value":{"kind":"EnumValue","value":"ALL"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"VolumeFields"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"dailyVolume"},"name":{"kind":"Name","value":"volumes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"chainIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"chainIds"}}},{"kind":"Argument","name":{"kind":"Name","value":"timespan"},"value":{"kind":"EnumValue","value":"DAY"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"VolumeFields"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"weeklyVolume"},"name":{"kind":"Name","value":"volumes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"chainIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"chainIds"}}},{"kind":"Argument","name":{"kind":"Name","value":"timespan"},"value":{"kind":"EnumValue","value":"WEEK"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"VolumeFields"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"monthlyVolume"},"name":{"kind":"Name","value":"volumes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"chainIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"chainIds"}}},{"kind":"Argument","name":{"kind":"Name","value":"timespan"},"value":{"kind":"EnumValue","value":"MONTH"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"VolumeFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WalletsAndTransactionsFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Wallet"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"chain"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chainIdentifier"}}]}},{"kind":"Field","name":{"kind":"Name","value":"transactionCount"}},{"kind":"Field","name":{"kind":"Name","value":"walletCount"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"VolumeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Volume"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"chain"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chainIdentifier"}}]}},{"kind":"Field","name":{"kind":"Name","value":"volumeUsd"}}]}}]} as unknown as DocumentNode<GetDexAggregatorOverviewQuery, GetDexAggregatorOverviewQueryVariables>;
export const GetFusionResolversDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getFusionResolvers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"weeklyFusionResolvers"},"name":{"kind":"Name","value":"fusionResolvers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"timespan"},"value":{"kind":"EnumValue","value":"WEEK"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"timespan"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"resolver"}},{"kind":"Field","name":{"kind":"Name","value":"transactionCount"}},{"kind":"Field","name":{"kind":"Name","value":"walletCount"}},{"kind":"Field","name":{"kind":"Name","value":"totalVolumeUsd"}}]}}]}}]} as unknown as DocumentNode<GetFusionResolversQuery, GetFusionResolversQueryVariables>;
export const GetFusionTopTradersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getFusionTopTraders"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortDirection"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SortDirection"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageNumber"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fusionTopTraders"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"sortBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortDirection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortDirection"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageNumber"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageNumber"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fusionTopTraders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"chain"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"transactionCount"}},{"kind":"Field","name":{"kind":"Name","value":"volumeUsd"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageNumber"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}},{"kind":"Field","name":{"kind":"Name","value":"totalEntries"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}}]}}]}}]} as unknown as DocumentNode<GetFusionTopTradersQuery, GetFusionTopTradersQueryVariables>;
export const GetFusionTradesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getFusionTrades"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"assetIds"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"chainIds"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Filter"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageNumber"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortDirection"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SortDirection"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fusionTopTrades"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"assetIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"assetIds"}}},{"kind":"Argument","name":{"kind":"Name","value":"chainIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"chainIds"}}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageNumber"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageNumber"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortDirection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortDirection"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pageNumber"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"totalEntries"}},{"kind":"Field","name":{"kind":"Name","value":"fusionTopTrades"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chain"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"destinationAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sourceAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"executorAddress"}},{"kind":"Field","name":{"kind":"Name","value":"receiverAddress"}},{"kind":"Field","name":{"kind":"Name","value":"destinationUsdAmount"}},{"kind":"Field","name":{"kind":"Name","value":"sourceUsdAmount"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"transactionHash"}}]}}]}}]}}]} as unknown as DocumentNode<GetFusionTradesQuery, GetFusionTradesQueryVariables>;
export const GetStakingWalletsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getStakingWallets"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Filter"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageNumber"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortDirection"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SortDirection"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"version"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"StakingVersion"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stakingWallets"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageNumber"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageNumber"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortDirection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortDirection"}}},{"kind":"Argument","name":{"kind":"Name","value":"version"},"value":{"kind":"Variable","name":{"kind":"Name","value":"version"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalEntries"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}},{"kind":"Field","name":{"kind":"Name","value":"pageNumber"}},{"kind":"Field","name":{"kind":"Name","value":"stakingWallets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"delegated"}},{"kind":"Field","name":{"kind":"Name","value":"stakingBalance"}},{"kind":"Field","name":{"kind":"Name","value":"version"}}]}}]}}]}}]} as unknown as DocumentNode<GetStakingWalletsQuery, GetStakingWalletsQueryVariables>;
export const GetTreasuryFlowsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getTreasuryFlows"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"timespan"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"TreasuryFlowTimespan"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"treasuryFlows"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"timespan"},"value":{"kind":"Variable","name":{"kind":"Name","value":"timespan"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"inboundVolumeUsd"}},{"kind":"Field","name":{"kind":"Name","value":"outboundVolumeUsd"}},{"kind":"Field","name":{"kind":"Name","value":"timespan"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}}]}}]} as unknown as DocumentNode<GetTreasuryFlowsQuery, GetTreasuryFlowsQueryVariables>;
export const GetTreasuryTransactionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getTreasuryTransactions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Filter"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageNumber"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortDirection"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SortDirection"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"treasuryTransactions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageNumber"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageNumber"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortDirection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortDirection"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pageNumber"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}},{"kind":"Field","name":{"kind":"Name","value":"totalEntries"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"treasuryTransactions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"amountUsd"}},{"kind":"Field","name":{"kind":"Name","value":"asset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"from"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"to"}},{"kind":"Field","name":{"kind":"Name","value":"transactionHash"}}]}}]}}]}}]} as unknown as DocumentNode<GetTreasuryTransactionsQuery, GetTreasuryTransactionsQueryVariables>;