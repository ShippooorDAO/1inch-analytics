import { css } from '@emotion/react';
import { Typography, useTheme } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';

import {
  ChainGasPrice,
  useNativeTokenRates,
} from '@/hooks/useNativeTokenRates';
import { Chain } from '@/shared/Model/Chain';
import { useOneInchAnalyticsAPIContext } from '@/shared/OneInchAnalyticsAPI/OneInchAnalyticsAPIProvider';

import { AutoSkeleton } from './AutoSkeleton';
import { ChainSelect } from './filters/ChainSelect';

function formatSwapPrice(chainGasPrice: number, gasTokenPrice: number) {
  const usdPrice = ((chainGasPrice * gasTokenPrice) / 1e9) * 100000;

  return usdPrice.toFixed(2);
}

export function GasMeter() {
  const theme = useTheme();
  const { chainStore } = useOneInchAnalyticsAPIContext();
  const gasData = useNativeTokenRates();

  const [selectedChain, setSelectedChain] = useState<Chain | null>();
  const [chainGasData, setChainGasData] = useState<ChainGasPrice | undefined>();

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
                  <Typography variant="body2">
                    ${chainGasData.gasTokenPriceUsd.toFixed(2)}
                  </Typography>
                </div>
                <div>
                  <Typography variant="subtitle2">
                    Estimated swap costs:
                  </Typography>
                </div>
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
                      <Typography variant="body2">
                        ~$
                        {formatSwapPrice(
                          chainGasValue.gwei,
                          chainGasData.gasTokenPriceUsd
                        )}
                      </Typography>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : undefined}
        </AutoSkeleton>
      </div>
    </>
  );
}
