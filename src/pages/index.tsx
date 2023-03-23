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
import { Chain } from '@/shared/Model/Chain';
import { useDexAggregatorOverview } from '@/hooks/useDexAggregatorOverview';
import { useMemo, useState } from 'react';
import { ChainMultiSelect } from '@/components/filters/ChainMultiSelect';
import { useOneInchAnalyticsAPIContext } from '@/shared/OneInchAnalyticsAPI/OneInchAnalyticsAPIProvider';

interface ControllerHistogramChartProps {
  dailyTimeseriesList?: Timeseries[];
  weeklyTimeseriesList?: Timeseries[];
  monthlyTimeseriesList?: Timeseries[];
  formatter?: (y?: number | null) => string;
}

function ControlledHistogramChart({
  dailyTimeseriesList,
  weeklyTimeseriesList,
  monthlyTimeseriesList,
  formatter,
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
      formatter={formatter}
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

    setSelectedChains(chainStore.getAll());
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
          gap: 40px;
        `}
      >
        <Typography variant="h2">1inch Aggregation Protocol</Typography>

        <div
          css={css`
            display: flex;
            justify-content: center;
          `}
        >
          <ChainMultiSelect
            values={selectedChains}
            onChange={setSelectedChains}
            chains={chains ?? []}
          />
        </div>
        {/* <div
          css={css`
            display: flex;
            flex-flow: column;
            gap: 30px;
          `}
        >
          <Typography variant="h3">Topline Metrics</Typography>

          <div
            css={css`
              display: flex;
              flex-flow: row;
              justify-content: center;
              gap: 20px;
            `}
          >
            <MetricsCard
              title="Volume (All time)"
              value={format(data?.allSelectedChains.allTimeVolume, {
                symbol: 'USD',
                abbreviate: true,
              })}
            />
            <MetricsCard
              title="Wallets  (All time)"
              value={format(data?.allSelectedChains.allTimeWalletsCount, {
                abbreviate: true,
              })}
            />
            <MetricsCard
              title="Transactions  (All time)"
              value={format(data?.allSelectedChains.allTimeTransactionsCount, {
                abbreviate: true,
              })}
            />
          </div>
        </div> */}
        <div
          css={css`
            display: flex;
            flex-flow: column;
            gap: 30px;
          `}
        >
          <Typography variant="h3">Volume</Typography>
          <div
            css={css`
              display: flex;
              flex-flow: row;
              justify-content: center;
              gap: 20px;
            `}
          >
            <MetricsCard
              title="Volume (All time)"
              value={format(data?.allSelectedChains.allTimeVolume, {
                symbol: 'USD',
                abbreviate: true,
              })}
              footer="All selected chains"
            />
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
              footer="All selected chains"
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
              footer="All selected chains"
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
              footer="All selected chains"
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
                        data!.byChain.get(chain.chainId)!
                          .monthlyVolumeTimeseries
                    )
                  : undefined
              }
              formatter={(y) => format(y, { symbol: 'USD' })}
            />
            <div
              css={css`
                display: flex;
                flex-flow: column;
                gap: 20px;
              `}
            >
              <DonutChart
                seriesName="Volume (USD)"
                data={selectedChains.map((chain) => {
                  const volume =
                    data?.byChain.get(chain.chainId)?.allTimeVolume ?? 0;
                  return {
                    name: chain.name,
                    y: volume,
                    color: chain.color,
                  };
                })}
                formatter={(y) => format(y, { symbol: 'USD' })}
              />
            </div>
          </div>
        </div>

        <div
          css={css`
            display: flex;
            flex-flow: column;
            gap: 20px;
          `}
        >
          <Typography variant="h3">Transactions</Typography>

          <div
            css={css`
              display: flex;
              flex-flow: row;
              justify-content: center;
              gap: 20px;
            `}
          >
            <MetricsCard
              title="Transactions (All time)"
              value={format(data?.allSelectedChains.allTimeTransactionsCount, {
                symbol: 'USD',
                abbreviate: true,
              })}
              footer="All selected chains"
            />
            <MetricsCard
              title="Transactions (24H)"
              value={format(data?.allSelectedChains.lastDayTransactionsCount, {
                symbol: 'USD',
                abbreviate: true,
              })}
              subValue={
                <TrendLabelPercent
                  value={data?.allSelectedChains.lastDayTransactionsCountTrend}
                />
              }
              footer="All selected chains"
            />
            <MetricsCard
              title="Transactions (7D)"
              value={format(data?.allSelectedChains.lastWeekTransactionsCount, {
                symbol: 'USD',
                abbreviate: true,
              })}
              subValue={
                <TrendLabelPercent
                  value={data?.allSelectedChains.lastWeekTransactionsCountTrend}
                />
              }
              footer="All selected chains"
            />
            <MetricsCard
              title="Transactions (30D)"
              value={format(
                data?.allSelectedChains.lastMonthTransactionsCount,
                {
                  symbol: 'USD',
                  abbreviate: true,
                }
              )}
              footer="All selected chains"
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
            <div
              css={css`
                display: flex;
                flex-flow: column;
                gap: 20px;
              `}
            >
              <DonutChart
                seriesName="Transactions"
                formatter={(y) => format(y, { decimals: 0 })}
                data={selectedChains.map((chain) => {
                  const volume =
                    data?.byChain.get(chain.chainId)
                      ?.allTimeTransactionsCount ?? 0;
                  return {
                    name: chain.name,
                    y: volume,
                    color: chain.color,
                  };
                })}
              />
            </div>
            <ControlledHistogramChart
              dailyTimeseriesList={
                data
                  ? selectedChains.map(
                      (chain) =>
                        data!.byChain.get(chain.chainId)!
                          .dailyTransactionsCountTimeseries
                    )
                  : undefined
              }
              weeklyTimeseriesList={
                data
                  ? selectedChains.map(
                      (chain) =>
                        data!.byChain.get(chain.chainId)!
                          .weeklyTransactionsCountTimeseries
                    )
                  : undefined
              }
              monthlyTimeseriesList={
                data
                  ? selectedChains.map(
                      (chain) =>
                        data!.byChain.get(chain.chainId)!
                          .monthlyTransactionsCountTimeseries
                    )
                  : undefined
              }
              formatter={(y) => format(y, { decimals: 0 })}
            />
          </div>
        </div>

        <div
          css={css`
            display: flex;
            flex-flow: column;
            gap: 30px;
          `}
        >
          <Typography variant="h3">Wallets</Typography>

          <div
            css={css`
              display: flex;
              flex-flow: row;
              justify-content: center;
              gap: 20px;
            `}
          >
            <MetricsCard
              title="Wallets (All time)"
              value={format(data?.allSelectedChains.allTimeWalletsCount, {
                symbol: 'USD',
                abbreviate: true,
              })}
              footer="All selected chains"
            />
            <MetricsCard
              title="Wallets (24H)"
              value={format(data?.allSelectedChains.lastDayWalletsCount, {
                symbol: 'USD',
                abbreviate: true,
              })}
              subValue={
                <TrendLabelPercent
                  value={data?.allSelectedChains.lastDayWalletsCountTrend}
                />
              }
              footer="All selected chains"
            />
            <MetricsCard
              title="Wallets (7D)"
              value={format(data?.allSelectedChains.lastWeekWalletsCount, {
                symbol: 'USD',
                abbreviate: true,
              })}
              subValue={
                <TrendLabelPercent
                  value={data?.allSelectedChains.lastWeekWalletsCountTrend}
                />
              }
              footer="All selected chains"
            />
            <MetricsCard
              title="Wallets (30D)"
              value={format(data?.allSelectedChains.lastMonthWalletsCount, {
                symbol: 'USD',
                abbreviate: true,
              })}
              footer="All selected chains"
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
                        data!.byChain.get(chain.chainId)!
                          .dailyTransactionsCountTimeseries
                    )
                  : undefined
              }
              weeklyTimeseriesList={
                data
                  ? selectedChains.map(
                      (chain) =>
                        data!.byChain.get(chain.chainId)!
                          .weeklyTransactionsCountTimeseries
                    )
                  : undefined
              }
              monthlyTimeseriesList={
                data
                  ? selectedChains.map(
                      (chain) =>
                        data!.byChain.get(chain.chainId)!
                          .monthlyTransactionsCountTimeseries
                    )
                  : undefined
              }
              formatter={(y) => format(y, { decimals: 0 })}
            />
            <div
              css={css`
                display: flex;
                flex-flow: column;
                gap: 20px;
              `}
            >
              <DonutChart
                seriesName="Wallets"
                formatter={(y) => format(y, { decimals: 0 })}
                data={selectedChains.map((chain) => {
                  const volume =
                    data?.byChain.get(chain.chainId)
                      ?.allTimeTransactionsCount ?? 0;
                  return {
                    name: chain.name,
                    y: volume,
                    color: chain.color,
                  };
                })}
              />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

Home.getLayout = function getLayout(page: any) {
  return <Dashboard>{page}</Dashboard>;
};
