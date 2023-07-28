import { css } from '@emotion/react';
import { Typography, useTheme } from '@mui/material';
import { lighten } from 'polished';
import { useEffect, useMemo, useState } from 'react';

import {
  TimedGasPrice,
  useUniswapV3SubgraphContext,
} from '@/contexts/UniswapV3Subgraph/UniswapV3SubgraphProvider';
import { useChainStore } from '@/hooks/useChainStore';
import {
  ChainGasPrice,
  useNativeTokenRates,
} from '@/hooks/useNativeTokenRates';
import { Chain } from '@/shared/Model/Chain';

import { AutoSkeleton } from './loading/AutoSkeleton';
import { ChainSelect } from './filters/ChainSelect';
import { GasPriceChart } from './chart/GasPriceChart';

function formatSwapPrice(chainGasPrice: number, gasTokenPrice: number) {
  const usdPrice = ((chainGasPrice * gasTokenPrice) / 1e9) * 100000;

  return usdPrice.toFixed(2);
}

const MOCK_CHAIN_GAS_PRICE: ChainGasPrice = {
  chainId: 1,
  gasPrices: [
    {
      displayText: 'slow',
      gwei: 50,
    },
    {
      displayText: 'average',
      gwei: 50,
    },
    {
      displayText: 'fast',
      gwei: 50,
    },
    {
      displayText: 'instant',
      gwei: 75,
    },
  ],
  gasTokenPriceUsd: 0,
};

export function GasMeter() {
  const theme = useTheme();
  const chainStore = useChainStore();
  const { latestGasPrices } = useUniswapV3SubgraphContext();
  const gasData = useNativeTokenRates();

  const [selectedChain, setSelectedChain] = useState<Chain | null>();
  const [chainGasData, setChainGasData] = useState<ChainGasPrice | undefined>();
  const [ethGasPrices, setEthGasPrices] = useState<TimedGasPrice[]>([]);
  const [displayGasTrend, setDisplayGasTrend] = useState<boolean>(false);

  const chainOptions = useMemo(() => {
    if (!chainStore) {
      return undefined;
    }

    const chains = chainStore.getAll();
    const defaultChain = chains.find((chain) => chain.chainId === 1);

    if (defaultChain) {
      setSelectedChain(defaultChain);
    }

    return chains;
  }, [chainStore]);

  useEffect(() => {
    if (selectedChain && gasData.data) {
      const chainData = gasData.data.find(
        (chainData) => chainData.chainId === selectedChain.chainId
      );

      setChainGasData(chainData);
    }
  }, [selectedChain, gasData]);

  useEffect(() => {
    if (latestGasPrices && selectedChain?.chainId === 1) {
      setEthGasPrices(latestGasPrices);
      setDisplayGasTrend(true);
    } else {
      setEthGasPrices([]);
      setDisplayGasTrend(false);
    }
  }, [selectedChain, latestGasPrices]);

  useEffect(() => {
    if (selectedChain) {
      gasData.sendMessage(
        `{"method":"getGasPriceChain${selectedChain.chainId}"}`
      );
    }
  }, [selectedChain]);

  const loading = !chainGasData || chainGasData.gasPrices.length === 0;
  const displayedChainGasData = loading ? MOCK_CHAIN_GAS_PRICE : chainGasData;

  return (
    <>
      <div
        css={(theme) => css`
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          background-color: ${theme.customBackgrounds.secondary};
          border-radius: 16px;
          width: 100%;
          padding: 16px;
          gap: 12px;
        `}
      >
        <AutoSkeleton loading={loading}>
          <ChainSelect
            chains={chainOptions || []}
            onChange={setSelectedChain}
            value={selectedChain}
          />
        </AutoSkeleton>
        <div
          css={css`
            width: 100%;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: space-between;
          `}
        >
          <AutoSkeleton loading={loading}>
            <Typography variant="body1">
              {selectedChain?.gasSymbol} price
            </Typography>
            <Typography variant="body1" color="textSecondary">
              ${displayedChainGasData.gasTokenPriceUsd.toFixed(2)}
            </Typography>
          </AutoSkeleton>
        </div>
        <hr
          css={(theme) => css`
            width: 100%;
            height: 1px;
            margin: 0;
            border: 0;
            background-color: ${theme.borders.secondary};
          `}
        />
        <div
          css={css`
            width: 100%;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: space-between;
          `}
        >
          <div
            css={css`
              width: 100%;
              display: flex;
              flex-direction: column;
            `}
          >
            <div
              css={css`
                display: flex;
                flex-flow: row;
                justify-content: space-between;
              `}
            >
              <AutoSkeleton loading={loading}>
                <Typography textAlign="right">Priority</Typography>
              </AutoSkeleton>
              <AutoSkeleton loading={loading}>
                <Typography color="textSecondary" textAlign="right">
                  Swap gas cost
                </Typography>
              </AutoSkeleton>
            </div>

            {displayedChainGasData.gasPrices.map((chainGasValue) => (
              <AutoSkeleton loading={loading} key={chainGasValue.displayText}>
                <div
                  css={css`
                    width: 100%;
                    display: flex;
                    flex-direction: row;
                    flex-wrap: wrap;
                    justify-content: space-between;
                    text-transform: capitalize;
                    margin-top: 3px;
                  `}
                >
                  <Typography variant="body1">
                    {chainGasValue.displayText} ({chainGasValue.gwei.toFixed(0)}{' '}
                    gwei)
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    ~$
                    {formatSwapPrice(
                      chainGasValue.gwei,
                      displayedChainGasData.gasTokenPriceUsd
                    )}
                  </Typography>
                </div>
              </AutoSkeleton>
            ))}
          </div>
        </div>
        <hr
          css={(theme) => css`
            width: 100%;
            height: 1px;
            margin: 0;
            border: 0;
            background-color: ${theme.borders.secondary};
          `}
        />
        <div
          css={css`
            width: 100%;
          `}
        >
          {displayGasTrend ? (
            <GasPriceChart data={ethGasPrices} />
          ) : (
            <AutoSkeleton loading={loading}>
              <div
                css={css`
                  display: flex;
                  flex-flow: column;
                  align-items: center;
                  justify-content: center;
                  border-radius: 10px;
                  padding: 10px;
                  background-color: ${lighten(
                    0.05,
                    theme.palette.background.paper
                  )};
                  height: 140px;
                `}
              >
                <Typography
                  variant="body1"
                  color="textSecondary"
                  textAlign="center"
                >
                  Historical gas price trend unavailable for this chain
                </Typography>
              </div>
            </AutoSkeleton>
          )}
        </div>
      </div>
    </>
  );
}
