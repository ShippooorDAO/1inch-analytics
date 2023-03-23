// @ts-ignore
import levenshtein from 'js-levenshtein';

import { Chain, ChainId } from '../Chain';

const DEFAULT_SEARCH_RANKING = [
  'ethereum',
  'binance',
  'polygon',
  'optimism',
  'arbitrum',
];
const DEFAULT_SEARCH_RANKING_SYMBOLS = new Set(DEFAULT_SEARCH_RANKING);

export class ChainStore {
  constructor(private readonly chains: Chain[]) {
    this.chains = this.rank(this.chains);
  }

  rank(assets: Chain[]) {
    const rankedAssets = assets.map((asset) => ({
      rank: DEFAULT_SEARCH_RANKING_SYMBOLS.has(asset.name.toLowerCase())
        ? DEFAULT_SEARCH_RANKING.length -
          DEFAULT_SEARCH_RANKING.indexOf(asset.name.toLowerCase())
        : -1,
      asset,
    }));
    rankedAssets.sort((a, b) => {
      if (a.rank === b.rank) {
        return b.asset.name.localeCompare(a.asset.name);
      }
      return b.rank - a.rank;
    });
    return rankedAssets.map(({ asset }) => asset);
  }

  search(predicate: string = '') {
    predicate = predicate.toLowerCase();
    if (predicate === '') {
      return this.rank(this.getAll());
    }
    return this.getAll()
      .map((chain) => ({
        rank: chain.name.toLowerCase().includes(predicate.toLowerCase())
          ? levenshtein(chain.name.toLowerCase(), predicate.toLowerCase())
          : -1,
        chain,
      }))
      .filter(({ rank }) => rank !== -1)
      .sort((a, b) => a.rank - b.rank)
      .map(({ chain }) => chain);
  }

  getAll(): Array<Chain> {
    return [...this.chains];
  }

  getById(id: string): Chain | undefined {
    return this.getAll().find(
      (chain) => chain.id.toLowerCase() === id.toLowerCase()
    );
  }

  getByChainId(chainId: number | string | ChainId): Chain | undefined {
    return this.getAll().find((chain) => chain.chainId === Number(chainId));
  }

  getByName(name: string): Chain | undefined {
    return this.getAll().find(
      (chain) => chain.name.toLowerCase() === name.toLowerCase()
    );
  }
}
