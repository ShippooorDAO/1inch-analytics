// @ts-ignore
import levenshtein from 'js-levenshtein';

import { Asset } from '../Asset';
import { Chain } from '../Chain';

const DEFAULT_SEARCH_RANKING = ['weth', 'usdc', 'wbtc', 'dai', 'wsteth'];
const DEFAULT_SEARCH_RANKING_SYMBOLS = new Set(DEFAULT_SEARCH_RANKING);

export class AssetStore {
  private readonly groupedById = new Map<string, Asset>();

  private readonly groupedBySymbol = new Map<string, Asset>();

  constructor(private readonly assets: Asset[]) {
    this.assets = this.rank(this.assets);

    this.assets.forEach((asset) => {
      this.groupedById.set(asset.id.toLowerCase(), asset);
      this.groupedBySymbol.set(
        this.getSymbolIdentifierForChain(asset.symbol, asset.chain),
        asset
      );
    });
  }

  getSymbolIdentifierForChain(symbol: string, chain?: Chain) {
    return `${symbol.toLowerCase()}-${chain?.name.toLowerCase()}`;
  }

  rank(assets: Asset[]) {
    const rankedAssets = assets.map((asset) => ({
      rank: DEFAULT_SEARCH_RANKING_SYMBOLS.has(asset.symbol.toLowerCase())
        ? DEFAULT_SEARCH_RANKING.length -
          DEFAULT_SEARCH_RANKING.indexOf(asset.symbol.toLowerCase())
        : -1,
      asset,
    }));
    rankedAssets.sort((a, b) => {
      if (a.rank === b.rank) {
        return b.asset.displayName.localeCompare(a.asset.displayName);
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
      .map((asset) => ({
        rank: asset.symbol.toLowerCase().includes(predicate)
          ? levenshtein(asset.symbol.toLowerCase(), predicate)
          : -1,
        asset,
      }))
      .filter(({ rank }) => rank !== -1)
      .sort((a, b) => a.rank - b.rank)
      .map(({ asset }) => asset);
  }

  getAll() {
    return this.assets;
  }

  getById(id: string): Asset | undefined {
    return this.groupedById.get(id.toLowerCase());
  }

  getBySymbol(symbol: string, chain?: Chain): Asset | undefined {
    return this.groupedBySymbol.get(
      this.getSymbolIdentifierForChain(symbol, chain)
    );
  }
}
