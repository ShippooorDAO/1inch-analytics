import { AssetService } from '@/shared/Currency/AssetService';
import { ChainStore } from '@/shared/Model/Stores/ChainStore';

export interface OneInchAnalyticsAPIProviderState {
  systemStatus?: {
    id: string;
    message: string;
  };
  assetService?: AssetService;
  chainStore?: ChainStore;
}

export interface GlobalSystemQueryResponse {
  systemStatus: {
    id?: string;
    message?: string;
  };
  chains: {
    id: string;
    name: string;
    chainIdentifier: number;
    nativeToken: string;
  }[];
  assets: {
    id: string;
    address: string;
    symbol: string;
    chain: {
      id: string;
    };
    name: string;
    decimals: number;
    logoUrl: string;
    priceUsd: number;
    price: number;
  }[];
}
