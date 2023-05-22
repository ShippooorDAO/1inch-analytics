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
import BarChartIcon from '@mui/icons-material/BarChart';
import PersonIcon from '@mui/icons-material/Person';
import ReceiptIcon from '@mui/icons-material/Receipt';

import {
  MetricsCardWithLink,
  SlimMetricsCard,
  TrendLabelPercent,
} from '@/components/MetricsCard';
import { format } from '@/shared/Utils/Format';
import { DonutChart } from '@/components/chart/DonutChart';
import { Chain } from '@/shared/Model/Chain';
import { useDexAggregatorOverview } from '@/hooks/useDexAggregatorOverview';
import { useMemo, useState } from 'react';
import { useOneInchAnalyticsAPIContext } from '@/shared/OneInchAnalyticsAPI/OneInchAnalyticsAPIProvider';
import { TimeWindowToggleButtonGroup } from '@/components/chart/TimeWindowToggleButtonGroup';
import { rgba } from 'polished';

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

interface ControlledDonutChartProps {
  seriesName: string;
  formatter: (y?: number | null) => string;
  lastWeekVolume?: {
    name: string;
    y: number;
    color: string;
  }[];
  lastMonthVolume?: {
    name: string;
    y: number;
    color: string;
  }[];

  allTimeVolume?: {
    name: string;
    y: number;
    color: string;
  }[];
}

function ControlledDonutChart({
  seriesName,
  formatter,
  lastWeekVolume,
  lastMonthVolume,
  allTimeVolume,
}: ControlledDonutChartProps) {
  const [timeWindow, setTimeWindow] = useState<TimeWindow>(TimeWindow.MAX);

  const handleTimeWindowChange = (e: any, value: any) => {
    if (value) {
      setTimeWindow(value);
    }
  };

  const data = useMemo(() => {
    switch (timeWindow) {
      case TimeWindow.SEVEN_DAYS:
        return lastWeekVolume;
      case TimeWindow.ONE_MONTH:
        return lastMonthVolume;
      case TimeWindow.MAX:
      default:
        return allTimeVolume;
    }
  }, [timeWindow, lastWeekVolume, lastMonthVolume, allTimeVolume]);

  return (
    <>
      <TimeWindowToggleButtonGroup
        value={timeWindow}
        onChange={handleTimeWindowChange}
        options={[
          { value: TimeWindow.SEVEN_DAYS, label: 'Last Week' },
          { value: TimeWindow.ONE_MONTH, label: 'Last Month' },
          { value: TimeWindow.MAX, label: 'All Time' },
        ]}
      />
      <DonutChart seriesName={seriesName} data={data} formatter={formatter} />
    </>
  );
}

export default function Home() {
  const { chainStore } = useOneInchAnalyticsAPIContext();
  const [selectedChains, setSelectedChains] = useState<Chain[]>([]);

  const displayedChains = useMemo(() => {
    if (!chainStore) {
      return undefined;
    }

    if (selectedChains.length === 0) {
      return chainStore?.getAll();
    }

    return selectedChains;
  }, [selectedChains, chainStore]);

  const chainOptions = useMemo(() => {
    if (!chainStore) {
      return undefined;
    }

    return chainStore.getAll();
  }, [chainStore]);

  const { data } = useDexAggregatorOverview({
    chainIds: displayedChains?.map((chain) => chain.chainId),
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
        {/* <div
          css={css`
            display: flex;
            justify-content: flex-start;
            align-items: center;
            gap: 20px;
          `}
        >
          <div>
            Filter by chain:
            <ChainMultiSelect
              values={selectedChains}
              onChange={setSelectedChains}
              chains={chainOptions ?? []}
            />
          </div>
        </div> */}
        <div
          css={css`
            display: flex;
            flex-flow: row;
            justify-content: center;
            gap: 20px;
          `}
        >
          <MetricsCardWithLink
            linkUrl="/treasury"
            title={'DAO Treasury'}
            backgroundImageUrl="dao.svg"
            backgroundImageAlt="dao"
            value={`${format(18013934.31, {
              symbol: 'USD',
              abbreviate: true,
            })}`}
            subValue={
              <TrendLabelPercent
                value={data?.allSelectedChains.lastWeekVolumeTrend}
              />
            }
            footer="Net Worth (24h)"
          />

          <MetricsCardWithLink
            linkUrl="/treasury"
            title={'1inch Fusion'}
            backgroundImageUrl="/vendors/1inch/fusion.webp"
            backgroundImageAlt="dao"
            value={format(23476937, { symbol: 'USD', abbreviate: true })}
            subValue={
              <TrendLabelPercent
                value={data?.allSelectedChains.lastWeekVolumeTrend}
              />
            }
            footer="Volume (24h)"
          />

          <MetricsCardWithLink
            linkUrl="/treasury"
            title={'Staked 1INCH'}
            backgroundImageUrl="staked-1inch.webp"
            backgroundImageAlt="staked 1inch"
            value={format(14.1424252 * 1e6, {
              symbol: 'USD',
              abbreviate: true,
            })}
            subValue={
              <TrendLabelPercent
                value={data?.allSelectedChains.lastWeekVolumeTrend}
              />
            }
            footer="Total Value Locked (24h)"
          />
        </div>
        <div
          css={(theme) => css`
            position: relative;
            border-radius: 24px;
            background-color: ${rgba(theme.palette.background.paper, 0.5)};
            z-index: 2;
          `}
        >
          <img
            alt="none"
            src="card-bg-5.svg"
            css={css`
              position: absolute;
              border-radius: 24px;
              left: 0;
              top: 0;
              width: 100%;
              z-index: -1;
              opacity: 0.5;
            `}
          />
          <div
            css={(theme) => css`
              display: flex;
              flex-flow: row;
              ${theme.breakpoints.down('md')} {
                flex-flow: column;
              }
              padding: 20px;
              gap: 20px;
              justify-content: space-between;
              border-top-left-radius: 24px;
              border-top-right-radius: 24px;
              align-items: flex-start;
            `}
          >
            <div
              css={css`
                margin-top: 10px;
                display: flex;
                flex-flow: row;
                gap: 5px;
              `}
            >
              <BarChartIcon />
              <Typography variant="h3">Volume</Typography>
            </div>
            <div
              css={css`
                display: flex;
                flex-flow: row;
                align-items: center;
                justify-content: center;
                flex-wrap: wrap;
                gap: 20px;
                width: 100%;
              `}
            >
              <SlimMetricsCard
                title="All time"
                value={format(data?.allSelectedChains.allTimeVolume, {
                  symbol: 'USD',
                  abbreviate: true,
                })}
              />
              <SlimMetricsCard
                title="24H"
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
              <SlimMetricsCard
                title="7D"
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
              <SlimMetricsCard
                title="30D"
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
            <div></div>
          </div>
          <div
            css={css`
              display: flex;
              flex-flow: row;
              justify-content: flex-start;
              gap: 20px;
              flex-wrap: wrap;
              padding: 0 20px 20px 20px;
            `}
          >
            <div
              css={(theme) => css`
                display: flex;
                flex-flow: column;
                gap: 20px;
                border: 1px solid ${theme.palette.divider};
                border-radius: 24px;
                background-color: ${rgba(theme.palette.background.paper, 0.5)};
                padding: 16px;
                width: calc(100% - 420px);
                ${theme.breakpoints.down('lg')} {
                  width: 100%;
                }
              `}
            >
              <Typography variant="h3">Historical volume per chain</Typography>
              <div
                css={css`
                  width: 100%;
                `}
              >
                <ControlledHistogramChart
                  dailyTimeseriesList={
                    data
                      ? displayedChains?.map(
                          (chain) =>
                            data!.byChain.get(chain.chainId)!
                              .dailyVolumeTimeseries
                        )
                      : undefined
                  }
                  weeklyTimeseriesList={
                    data
                      ? displayedChains?.map(
                          (chain) =>
                            data!.byChain.get(chain.chainId)!
                              .weeklyVolumeTimeseries
                        )
                      : undefined
                  }
                  monthlyTimeseriesList={
                    data
                      ? displayedChains?.map(
                          (chain) =>
                            data!.byChain.get(chain.chainId)!
                              .monthlyVolumeTimeseries
                        )
                      : undefined
                  }
                  formatter={(y) => format(y, { symbol: 'USD' })}
                />
              </div>
            </div>
            <div
              css={(theme) => css`
                display: flex;
                flex-flow: column;
                gap: 20px;
                background-color: ${rgba(theme.palette.background.paper, 0.5)};
                border: 1px solid ${theme.palette.divider};
                border-radius: 24px;
                justify-content: space-between;
                padding: 16px;
                width: 400px;
                ${theme.breakpoints.down('lg')} {
                  width: 100%;
                }
              `}
            >
              <Typography variant="h3">Current volume per chain</Typography>
              <ControlledDonutChart
                seriesName="Volume (USD)"
                lastWeekVolume={displayedChains?.map((chain) => {
                  const volume =
                    data?.byChain.get(chain.chainId)?.lastWeekVolume ?? 0;
                  return {
                    name: chain.name,
                    y: volume,
                    color: chain.color,
                  };
                })}
                lastMonthVolume={displayedChains?.map((chain) => {
                  const volume =
                    data?.byChain.get(chain.chainId)?.lastMonthVolume ?? 0;
                  return {
                    name: chain.name,
                    y: volume,
                    color: chain.color,
                  };
                })}
                allTimeVolume={displayedChains?.map((chain) => {
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
          css={(theme) => css`
            position: relative;
            border-radius: 24px;
            background-color: ${rgba(theme.palette.background.paper, 0.7)};
            z-index: 2;
          `}
        >
          <img
            src="card-bg-4.svg"
            alt="none"
            css={css`
              position: absolute;
              border-radius: 24px;
              left: 0;
              right: 0;
              top: 0;
              bottom: 0;
              width: 100%;
              z-index: -1;
              opacity: 0.3;
            `}
          />
          <div
            css={(theme) => css`
              display: flex;
              flex-flow: row;
              ${theme.breakpoints.down('md')} {
                flex-flow: column;
              }
              padding: 20px;
              gap: 20px;
              border-top-left-radius: 24px;
              border-top-right-radius: 24px;
              align-items: flex-start;
              justify-content: space-between;
            `}
          >
            <div
              css={css`
                margin-top: 10px;
                display: flex;
                flex-flow: row;
                gap: 5px;
              `}
            >
              <ReceiptIcon />
              <Typography variant="h3">Transactions</Typography>
            </div>
            <div
              css={css`
                display: flex;
                flex-flow: row;
                align-items: center;
                justify-content: center;
                flex-wrap: wrap;
                gap: 20px;
                width: 100%;
              `}
            >
              <SlimMetricsCard
                title="All time"
                value={format(
                  data?.allSelectedChains.allTimeTransactionsCount,
                  {
                    symbol: 'USD',
                    abbreviate: true,
                  }
                )}
              />
              <SlimMetricsCard
                title="24H"
                value={format(
                  data?.allSelectedChains.lastDayTransactionsCount,
                  {
                    symbol: 'USD',
                    abbreviate: true,
                  }
                )}
                subValue={
                  <TrendLabelPercent
                    value={
                      data?.allSelectedChains.lastDayTransactionsCountTrend
                    }
                  />
                }
              />
              <SlimMetricsCard
                title="7D"
                value={format(
                  data?.allSelectedChains.lastWeekTransactionsCount,
                  {
                    symbol: 'USD',
                    abbreviate: true,
                  }
                )}
                subValue={
                  <TrendLabelPercent
                    value={
                      data?.allSelectedChains.lastWeekTransactionsCountTrend
                    }
                  />
                }
              />
              <SlimMetricsCard
                title="30D"
                value={format(
                  data?.allSelectedChains.lastMonthTransactionsCount,
                  {
                    symbol: 'USD',
                    abbreviate: true,
                  }
                )}
              />
            </div>
            <div></div>
          </div>
          <div
            css={css`
              display: flex;
              flex-flow: row;
              justify-content: flex-start;
              gap: 20px;
              flex-wrap: wrap;
              padding: 0 20px 20px 20px;
            `}
          >
            <div
              css={(theme) => css`
                display: flex;
                flex-flow: column;
                gap: 20px;
                background-color: ${rgba(theme.palette.background.paper, 0.5)};
                border: 1px solid ${theme.palette.divider};
                border-radius: 24px;
                justify-content: space-between;
                padding: 16px;
                width: 400px;
                ${theme.breakpoints.down('lg')} {
                  width: 100%;
                }
              `}
            >
              <Typography variant="h3">
                Current transactions per chain
              </Typography>
              <ControlledDonutChart
                seriesName="Transactions"
                lastWeekVolume={displayedChains?.map((chain) => {
                  const volume =
                    data?.byChain.get(chain.chainId)
                      ?.lastWeekTransactionsCount ?? 0;
                  return {
                    name: chain.name,
                    y: volume,
                    color: chain.color,
                  };
                })}
                lastMonthVolume={displayedChains?.map((chain) => {
                  const volume =
                    data?.byChain.get(chain.chainId)
                      ?.lastMonthTransactionsCount ?? 0;
                  return {
                    name: chain.name,
                    y: volume,
                    color: chain.color,
                  };
                })}
                allTimeVolume={displayedChains?.map((chain) => {
                  const volume =
                    data?.byChain.get(chain.chainId)
                      ?.allTimeTransactionsCount ?? 0;
                  return {
                    name: chain.name,
                    y: volume,
                    color: chain.color,
                  };
                })}
                formatter={(y) => format(y, { decimals: 0 })}
              />
            </div>
            <div
              css={(theme) => css`
                display: flex;
                flex-flow: column;
                gap: 20px;
                background-color: ${rgba(theme.palette.background.paper, 0.7)};
                border: 1px solid ${theme.palette.divider};
                border-radius: 24px;
                padding: 16px;
                width: calc(100% - 420px);
                ${theme.breakpoints.down('lg')} {
                  width: 100%;
                }
              `}
            >
              <Typography variant="h3">
                Historical transactions per chain
              </Typography>
              <div
                css={css`
                  width: 100%;
                `}
              >
                <ControlledHistogramChart
                  dailyTimeseriesList={
                    data
                      ? displayedChains?.map(
                          (chain) =>
                            data!.byChain.get(chain.chainId)!
                              .dailyTransactionsCountTimeseries
                        )
                      : undefined
                  }
                  weeklyTimeseriesList={
                    data
                      ? displayedChains?.map(
                          (chain) =>
                            data!.byChain.get(chain.chainId)!
                              .weeklyTransactionsCountTimeseries
                        )
                      : undefined
                  }
                  monthlyTimeseriesList={
                    data
                      ? displayedChains?.map(
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
          </div>
        </div>
        <div
          css={(theme) => css`
            position: relative;
            border-radius: 24px;
            z-index: 2;
            background-color: ${theme.palette.background.paper};
          `}
        >
          <img
            src="card-bg-2.svg"
            alt="none"
            css={css`
              position: absolute;
              border-radius: 24px;
              width: 100%;
              left: 0;
              top: 0;
              z-index: -1;
              opacity: 0.3;
            `}
          />
          <div
            css={(theme) => css`
              display: flex;
              flex-flow: row;
              ${theme.breakpoints.down('md')} {
                flex-flow: column;
              }
              justify-content: space-between;
              align-items: flex-start;
              gap: 20px;
              padding: 20px;
              border-top-left-radius: 24px;
              border-top-right-radius: 24px;
            `}
          >
            <div
              css={css`
                margin-top: 10px;
                display: flex;
                flex-flow: row;
                gap: 5px;
              `}
            >
              <PersonIcon />
              <Typography variant="h3">Users</Typography>
            </div>
            <div
              css={css`
                display: flex;
                flex-flow: row;
                align-items: center;
                justify-content: center;
                flex-wrap: wrap;
                gap: 20px;
                width: 100%;
              `}
            >
              <SlimMetricsCard
                title="All time"
                value={format(data?.allSelectedChains.allTimeWalletsCount, {
                  abbreviate: true,
                })}
              />
              <SlimMetricsCard
                title="24H"
                value={format(data?.allSelectedChains.lastDayWalletsCount, {
                  abbreviate: true,
                })}
                subValue={
                  <TrendLabelPercent
                    value={data?.allSelectedChains.lastDayWalletsCountTrend}
                  />
                }
              />
              <SlimMetricsCard
                title="7D"
                value={format(data?.allSelectedChains.lastWeekWalletsCount, {
                  abbreviate: true,
                })}
                subValue={
                  <TrendLabelPercent
                    value={data?.allSelectedChains.lastWeekWalletsCountTrend}
                  />
                }
              />
              <SlimMetricsCard
                title="30D"
                value={format(data?.allSelectedChains.lastMonthWalletsCount, {
                  abbreviate: true,
                })}
              />
            </div>
            <div></div>
          </div>
          <div
            css={css`
              display: flex;
              flex-flow: row;
              justify-content: flex-start;
              gap: 20px;
              flex-wrap: wrap;
              padding: 0 20px 20px 20px;
            `}
          >
            <div
              css={(theme) => css`
                z-index: 2;
                background-color: ${rgba(theme.palette.background.paper, 0.5)};
                display: flex;
                flex-flow: column;
                gap: 20px;
                border: 1px solid ${theme.palette.divider};
                border-radius: 24px;
                padding: 16px;
                width: calc(100% - 420px);
                ${theme.breakpoints.down('lg')} {
                  width: 100%;
                }
              `}
            >
              <Typography variant="h3">Historical users per chain</Typography>
              <div
                css={css`
                  width: 100%;
                `}
              >
                <ControlledHistogramChart
                  dailyTimeseriesList={
                    data
                      ? displayedChains?.map(
                          (chain) =>
                            data!.byChain.get(chain.chainId)!
                              .dailyWalletsCountTimeseries
                        )
                      : undefined
                  }
                  weeklyTimeseriesList={
                    data
                      ? displayedChains?.map(
                          (chain) =>
                            data!.byChain.get(chain.chainId)!
                              .weeklyWalletsCountTimeseries
                        )
                      : undefined
                  }
                  monthlyTimeseriesList={
                    data
                      ? displayedChains?.map(
                          (chain) =>
                            data!.byChain.get(chain.chainId)!
                              .monthlyWalletsCountTimeseries
                        )
                      : undefined
                  }
                  formatter={(y) => format(y, { decimals: 0 })}
                />
              </div>
            </div>
            <div
              css={(theme) => css`
                z-index: 2;
                background-color: ${rgba(theme.palette.background.paper, 0.5)};
                display: flex;
                flex-flow: column;
                gap: 20px;
                border: 1px solid ${theme.palette.divider};
                border-radius: 24px;
                justify-content: space-between;
                padding: 16px;
                width: 400px;
                ${theme.breakpoints.down('lg')} {
                  width: 100%;
                }
              `}
            >
              <Typography variant="h3">Current users per chain</Typography>
              <ControlledDonutChart
                seriesName="Wallets"
                lastWeekVolume={displayedChains?.map((chain) => {
                  const volume =
                    data?.byChain.get(chain.chainId)?.lastWeekWalletsCount ?? 0;
                  return {
                    name: chain.name,
                    y: volume,
                    color: chain.color,
                  };
                })}
                lastMonthVolume={displayedChains?.map((chain) => {
                  const volume =
                    data?.byChain.get(chain.chainId)?.lastMonthWalletsCount ??
                    0;
                  return {
                    name: chain.name,
                    y: volume,
                    color: chain.color,
                  };
                })}
                allTimeVolume={displayedChains?.map((chain) => {
                  const volume =
                    data?.byChain.get(chain.chainId)?.allTimeWalletsCount ?? 0;
                  return {
                    name: chain.name,
                    y: volume,
                    color: chain.color,
                  };
                })}
                formatter={(y) => format(y, { decimals: 0 })}
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
