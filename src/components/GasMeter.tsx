import { css } from '@emotion/react';
import { Typography, useTheme } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';

import {
  ChainGasPrice,
  useNativeTokenRates,
} from '@/hooks/useNativeTokenRates';
import { Chain } from '@/shared/Model/Chain';
import { useOneInchAnalyticsAPIContext } from '@/shared/OneInchAnalyticsAPI/OneInchAnalyticsAPIProvider';
import {
  TimedGasPrice,
  useUniswapV3SubgraphContext,
} from '@/shared/UniswapV3Subgraph/UniswapV3SubgraphProvider';

import { AutoSkeleton } from './AutoSkeleton';
import { ChainSelect } from './filters/ChainSelect';

function formatSwapPrice(chainGasPrice: number, gasTokenPrice: number) {
  const usdPrice = ((chainGasPrice * gasTokenPrice) / 1e9) * 100000;

  return usdPrice.toFixed(2);
}

export function GasMeter() {
  const theme = useTheme();
  const { chainStore } = useOneInchAnalyticsAPIContext();
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

  return (
    <>
      <div
        css={css`
          display: flex;
          flex-direction: column;
          align-items: center;
          background-color: ${theme.palette.background.paper};
          border-radius: 10px;
          max-width: 240px;
          min-height: 180px;
          padding: 10px;
        `}
      >
        <ChainSelect
          chains={chainOptions || []}
          onChange={setSelectedChain}
          value={selectedChain}
        />
        <AutoSkeleton loading={!chainGasData} width={220} height={200}>
          {chainGasData ? (
            <>
              <div
                css={css`
                  display: flex;
                  flex-direction: column;
                  align-items: flex-start;
                  width: 100%;
                  padding: 10px;
                `}
              >
                <div
                  css={css`
                    width: 100%;
                    display: flex;
                    flex-direction: row;
                    flex-wrap: wrap;
                    justify-content: space-between;
                    margin-bottom: 5px;
                  `}
                >
                  <Typography variant="subtitle2">
                    {selectedChain?.gasSymbol} price:
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    ${chainGasData.gasTokenPriceUsd.toFixed(2)}
                  </Typography>
                </div>
                <div>
                  <Typography variant="subtitle2">
                    Estimated swap costs:
                  </Typography>
                </div>
                <hr
                  css={css`
                    width: 100%;
                    height: 1px;
                    border: 1px solid rgba(255, 255, 225, 0.1);
                  `}
                />
                <div
                  css={css`
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    margin-top: 5px;
                  `}
                >
                  {chainGasData.gasPrices.map((chainGasValue) => (
                    <div
                      key={chainGasValue.displayText}
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
                      <Typography variant="body2">
                        {chainGasValue.displayText} (
                        {chainGasValue.gwei.toFixed(0)} gwei)
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        ~$
                        {formatSwapPrice(
                          chainGasValue.gwei,
                          chainGasData.gasTokenPriceUsd
                        )}
                      </Typography>
                    </div>
                  ))}
                </div>
                {displayGasTrend ? (
                  <>
                    <div
                      css={css`
                        margin-top: 5px;
                      `}
                    >
                      <Typography variant="subtitle2">
                        Gas price trend:
                      </Typography>
                    </div>
                    <hr
                      css={css`
                        width: 100%;
                        height: 1px;
                        border: 1px solid rgba(255, 255, 225, 0.1);
                      `}
                    />
                  </>
                ) : undefined}
              </div>
            </>
          ) : undefined}
        </AutoSkeleton>
      </div>
    </>
  );
}
