// eslint-disable-next-line simple-import-sort/imports
import { Container, Typography } from '@mui/material';

import Dashboard from '@/layouts/DashboardLayout';
import {
  TimeInterval,
  Timeseries,
  TimeWindow,
} from '@/shared/Model/Timeseries';
import { HistogramChart } from '@/components/chart/HistogramChart';
import { css } from '@emotion/react';
import { MetricsCard, TrendLabelPercent } from '@/components/MetricsCard';
import { format } from '@/shared/Utils/Format';
import { DonutChart } from '@/components/chart/DonutChart';
import {
  getChainImageUrl,
  ChainId,
  getChainColor,
  Chain,
} from '@/shared/Model/Chain';
import { useDexAggregatorOverview } from '@/hooks/useDexAggregatorOverview';
import { useMemo, useState } from 'react';
import { ChainMultiSelect } from '@/components/filters/ChainMultiSelect';
import { useOneInchAnalyticsAPIContext } from '@/shared/OneInchAnalyticsAPI/OneInchAnalyticsAPIProvider';

const mockHistogramDataSeries = [
  {
    x: Math.floor(Date.now() / 1000),
    y: 4916100340,
  },
  {
    x: Math.floor(Date.now() / 1000) - 86400 * 30,
    y: 7500645091,
  },
  {
    x: Math.floor(Date.now() / 1000) - 86400 * 30 * 2,
    y: 5170765005,
  },
  {
    x: Math.floor(Date.now() / 1000) - 86400 * 30 * 3,
    y: 11199885376,
  },
  {
    x: Math.floor(Date.now() / 1000) - 86400 * 30 * 4,
    y: 4686927914,
  },
  {
    x: Math.floor(Date.now() / 1000) - 86400 * 30 * 5,
    y: 5742176598,
  },
  {
    x: Math.floor(Date.now() / 1000) - 86400 * 30 * 6,
    y: 6742750133,
  },
  {
    x: Math.floor(Date.now() / 1000) - 86400 * 30 * 7,
    y: 7738091771,
  },
];

const histogramData: Timeseries[] = [
  {
    name: 'Ethereum',
    imageUrl: getChainImageUrl(ChainId.ETHEREUM),
    color: getChainColor(ChainId.ETHEREUM),
    data: mockHistogramDataSeries,
  },
  {
    name: 'BNB',
    imageUrl: getChainImageUrl(ChainId.BSC),
    color: getChainColor(ChainId.BSC),
    data: mockHistogramDataSeries,
  },
  {
    name: 'Arbitrum',
    imageUrl: getChainImageUrl(ChainId.ARBITRUM),
    color: getChainColor(ChainId.ARBITRUM),
    data: mockHistogramDataSeries,
  },
  {
    name: 'Optimism',
    imageUrl: getChainImageUrl(ChainId.OPTIMISM),
    color: getChainColor(ChainId.OPTIMISM),
    data: mockHistogramDataSeries,
  },
  {
    name: 'Polygon',
    imageUrl: getChainImageUrl(ChainId.POLYGON),
    color: getChainColor(ChainId.POLYGON),
    data: mockHistogramDataSeries,
  },
  {
    name: 'Klaytn',
    imageUrl: getChainImageUrl(ChainId.KLAYTN),
    color: getChainColor(ChainId.KLAYTN),
    data: mockHistogramDataSeries,
  },
  {
    name: 'Gnosis',
    imageUrl: getChainImageUrl(ChainId.GNOSIS),
    color: getChainColor(ChainId.GNOSIS),
    data: mockHistogramDataSeries,
  },
  {
    name: 'Avalanche',
    imageUrl: getChainImageUrl(ChainId.AVALANCHE),
    color: getChainColor(ChainId.AVALANCHE),
    data: mockHistogramDataSeries,
  },
  {
    name: 'Fantom',
    imageUrl: getChainImageUrl(ChainId.FANTOM),
    color: getChainColor(ChainId.FANTOM),
    data: mockHistogramDataSeries,
  },
  {
    name: 'Aurora',
    imageUrl: getChainImageUrl(ChainId.AURORA),
    color: getChainColor(ChainId.AURORA),
    data: mockHistogramDataSeries,
  },
];

interface ControllerHistogramChartProps {
  dailyTimeseriesList?: Timeseries[];
  weeklyTimeseriesList?: Timeseries[];
  monthlyTimeseriesList?: Timeseries[];
}

function ControlledHistogramChart({
  dailyTimeseriesList,
  weeklyTimeseriesList,
  monthlyTimeseriesList,
}: ControllerHistogramChartProps) {
  const [timeWindow, setTimeWindow] = useState<TimeWindow>(TimeWindow.MAX);
  const [timeInterval, setTimeInterval] = useState<TimeInterval>(
    TimeInterval.DAILY
  );

  const timeseriesList = useMemo(() => {
    if (timeInterval === TimeInterval.DAILY) {
      return dailyTimeseriesList;
    }

    if (timeInterval === TimeInterval.WEEKLY) {
      return weeklyTimeseriesList;
    }

    if (timeInterval === TimeInterval.MONTHLY) {
      return monthlyTimeseriesList;
    }
  }, [
    timeInterval,
    dailyTimeseriesList,
    weeklyTimeseriesList,
    monthlyTimeseriesList,
  ]);

  return (
    <HistogramChart
      timeseriesList={timeseriesList}
      timeWindow={timeWindow}
      timeInterval={timeInterval}
      onTimeWindowChange={setTimeWindow}
      onTimeIntervalChange={setTimeInterval}
    />
  );
}

export default function Home() {
  const { chainStore } = useOneInchAnalyticsAPIContext();
  const [selectedChains, setSelectedChains] = useState<Chain[]>([]);

  const chains = useMemo(() => {
    if (!chainStore) {
      return undefined;
    }

    return chainStore.getAll();
  }, [chainStore]);

  const { data } = useDexAggregatorOverview({
    chainIds: selectedChains.map((chain) => chain.chainId),
  });

  return (
    <Container
      css={css`
        padding-top: 20px;
        padding-bottom: 20px;
      `}
    >
      <div
        css={css`
          display: flex;
          flex-flow: column;
          gap: 20px;
        `}
      >
        <Typography variant="h4">1inch Aggregation Protocol</Typography>
        <ChainMultiSelect
          values={selectedChains}
          onChange={setSelectedChains}
          chains={chains ?? []}
        />
        <div
          css={css`
            display: flex;
            flex-flow: row;
            justify-content: center;
            gap: 20px;
          `}
        >
          <MetricsCard
            title="Volume"
            value={format(data?.allSelectedChains.allTimeVolume, {
              symbol: 'USD',
              abbreviate: true,
            })}
          />
          <MetricsCard
            title="Wallets"
            value={format(data?.allSelectedChains.allTimeWalletsCount, {
              abbreviate: true,
            })}
          />
          <MetricsCard
            title="Transactions"
            value={format(data?.allSelectedChains.allTimeTransactionsCount, {
              abbreviate: true,
            })}
          />
        </div>
        <div
          css={css`
            display: flex;
            flex-flow: row;
            justify-content: center;
            gap: 20px;
          `}
        >
          <ControlledHistogramChart
            dailyTimeseriesList={
              data
                ? selectedChains.map(
                    (chain) =>
                      data!.byChain.get(chain.chainId)!.dailyVolumeTimeseries
                  )
                : undefined
            }
            weeklyTimeseriesList={
              data
                ? selectedChains.map(
                    (chain) =>
                      data!.byChain.get(chain.chainId)!.weeklyVolumeTimeseries
                  )
                : undefined
            }
            monthlyTimeseriesList={
              data
                ? selectedChains.map(
                    (chain) =>
                      data!.byChain.get(chain.chainId)!.monthlyVolumeTimeseries
                  )
                : undefined
            }
          />
          <div
            css={css`
              display: flex;
              flex-flow: column;
              gap: 20px;
            `}
          >
            <DonutChart
              data={selectedChains.map((chain) => {
                const volume =
                  data?.byChain.get(chain.chainId)?.allTimeVolume ?? 0;
                return {
                  name: chain.name,
                  y: volume,
                  color: chain.color,
                };
              })}
            />
          </div>
        </div>
        <div
          css={css`
            display: flex;
            flex-flow: row;
            justify-content: center;
            gap: 20px;
          `}
        >
          <MetricsCard
            title="Volume (24H)"
            value={format(data?.allSelectedChains.lastDayVolume, {
              symbol: 'USD',
              abbreviate: true,
            })}
            subValue={
              <TrendLabelPercent
                value={data?.allSelectedChains.lastDayVolumeTrend}
              />
            }
          />
          <MetricsCard
            title="Volume (7D)"
            value={format(data?.allSelectedChains.lastWeekVolume, {
              symbol: 'USD',
              abbreviate: true,
            })}
            subValue={
              <TrendLabelPercent
                value={data?.allSelectedChains.lastWeekVolumeTrend}
              />
            }
          />
          <MetricsCard
            title="Volume (30D)"
            value={format(data?.allSelectedChains.lastMonthVolume, {
              symbol: 'USD',
              abbreviate: true,
            })}
            subValue={
              <TrendLabelPercent
                value={data?.allSelectedChains.lastMonthVolumeTrend}
              />
            }
          />
        </div>
      </div>
    </Container>
  );
}

Home.getLayout = function getLayout(page: any) {
  return <Dashboard>{page}</Dashboard>;
};
