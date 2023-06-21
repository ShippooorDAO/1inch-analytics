// eslint-disable-next-line simple-import-sort/imports
import { Container, Typography } from '@mui/material';

import Dashboard from '@/layouts/DashboardLayout';
import {
  getTimeIntervalLabel,
  getTimeWindowLabel,
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
  TrendLabelPercent,
} from '@/components/MetricsCard';
import { format } from '@/shared/Utils/Format';
import { DonutChart } from '@/components/chart/DonutChart';
import { Chain } from '@/shared/Model/Chain';
import { useDexAggregatorOverview } from '@/hooks/useDexAggregatorOverview';
import { useMemo, useState } from 'react';
import { useOneInchAnalyticsAPIContext } from '@/shared/OneInchAnalyticsAPI/OneInchAnalyticsAPIProvider';
import { TimeWindowToggleButtonGroup } from '@/components/chart/TimeWindowToggleButtonGroup';
import { StatsContainer } from '@/components/StatsContainer';
import { scopeTimeseriesToTimeWindow } from '@/shared/Utils/Chart';

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
  const [timeWindow, setTimeWindow] = useState<TimeWindow>(
    TimeWindow.YEAR_TO_DATE
  );
  const [timeInterval, setTimeInterval] = useState<TimeInterval>(
    TimeInterval.WEEKLY
  );

  const timeseriesList = useMemo(() => {
    const timeseriesListForSelectedTimeInterval = (() => {
      if (timeInterval === TimeInterval.DAILY) {
        return dailyTimeseriesList;
      }

      if (timeInterval === TimeInterval.WEEKLY) {
        return weeklyTimeseriesList;
      }

      if (timeInterval === TimeInterval.MONTHLY) {
        return monthlyTimeseriesList;
      }
    })();

    return timeseriesListForSelectedTimeInterval?.map((t) =>
      scopeTimeseriesToTimeWindow(t, timeWindow)
    );
  }, [
    timeInterval,
    timeWindow,
    dailyTimeseriesList,
    weeklyTimeseriesList,
    monthlyTimeseriesList,
  ]);

  return (
    <HistogramChart
      timeseriesList={timeseriesList}
      timeWindow={timeWindow}
      timeInterval={timeInterval}
      timeWindowOptions={[
        TimeWindow.SEVEN_DAYS,
        TimeWindow.ONE_MONTH,
        TimeWindow.ONE_YEAR,
        TimeWindow.YEAR_TO_DATE,
        TimeWindow.MAX,
      ].map((timeWindow) => ({
        value: timeWindow,
        label: getTimeWindowLabel(timeWindow),
      }))}
      timeIntervalOptions={[
        TimeInterval.DAILY,
        TimeInterval.WEEKLY,
        TimeInterval.MONTHLY,
      ].map((timeInterval) => ({
        value: timeInterval,
        label: getTimeIntervalLabel(timeInterval),
      }))}
      onTimeWindowChange={setTimeWindow}
      onTimeIntervalChange={setTimeInterval}
      formatter={formatter}
    />
  );
}

interface ControlledDonutChartProps {
  seriesName: string;
  tooltipFormatter: (y?: number | null) => string;
  labelFormatter: (y?: number | null) => string;
  volumeLastWeek?: {
    name: string;
    y: number;
    color: string;
  }[];
  volumeLastMonth?: {
    name: string;
    y: number;
    color: string;
  }[];

  volumeAllTime?: {
    name: string;
    y: number;
    color: string;
  }[];
}

function ControlledDonutChart({
  seriesName,
  tooltipFormatter,
  labelFormatter,
  volumeLastWeek,
  volumeLastMonth,
  volumeAllTime,
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
        return volumeLastWeek;
      case TimeWindow.ONE_MONTH:
        return volumeLastMonth;
      case TimeWindow.MAX:
      default:
        return volumeAllTime;
    }
  }, [timeWindow, volumeLastWeek, volumeLastMonth, volumeAllTime]);

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
      <DonutChart
        seriesName={seriesName}
        data={data}
        tooltipFormatter={tooltipFormatter}
        labelFormatter={labelFormatter}
      />
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

  const { data } = useDexAggregatorOverview({
    chainIds: displayedChains?.map((chain) => chain.id),
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
        <Typography variant="h3">1inch Aggregation Protocol</Typography>
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
                value={data?.allSelectedChains.volumeLastWeekTrend}
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
                value={data?.allSelectedChains.volumeLastWeekTrend}
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
                value={data?.allSelectedChains.volumeLastWeekTrend}
              />
            }
            footer="Total Value Locked (24h)"
          />
        </div>
        <StatsContainer
          title={
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
          }
          // backgroundImageUrl="card-bg-5.svg"
          headerMetrics={[
            {
              title: 'All time',
              value: format(data?.allSelectedChains.volumeAllTime, {
                symbol: 'USD',
                abbreviate: true,
              }),
            },
            {
              title: '24h',
              value: format(data?.allSelectedChains.volumeLastDay, {
                symbol: 'USD',
                abbreviate: true,
              }),
              subValue: (
                <TrendLabelPercent
                  value={data?.allSelectedChains.volumeLastDayTrend}
                />
              ),
            },
            {
              title: '7d',
              value: format(data?.allSelectedChains.volumeLastWeek, {
                symbol: 'USD',
                abbreviate: true,
              }),
              subValue: (
                <TrendLabelPercent
                  value={data?.allSelectedChains.volumeLastWeekTrend}
                />
              ),
            },
            {
              title: '30d',
              value: format(data?.allSelectedChains.volumeLastMonth, {
                symbol: 'USD',
                abbreviate: true,
              }),
              subValue: (
                <TrendLabelPercent
                  value={data?.allSelectedChains.volumeLastMonthTrend}
                />
              ),
            },
          ]}
          leftContainer={{
            title: 'Historical volume per chain',
            content: (
              <ControlledHistogramChart
                dailyTimeseriesList={
                  data
                    ? displayedChains?.map(
                        (chain) =>
                          data!.byChain.get(chain.chainId)!
                            .volumeDailyTimeseries
                      )
                    : undefined
                }
                weeklyTimeseriesList={
                  data
                    ? displayedChains?.map(
                        (chain) =>
                          data!.byChain.get(chain.chainId)!
                            .volumeWeeklyTimeseries
                      )
                    : undefined
                }
                monthlyTimeseriesList={
                  data
                    ? displayedChains?.map(
                        (chain) =>
                          data!.byChain.get(chain.chainId)!
                            .volumeMonthlyTimeseries
                      )
                    : undefined
                }
                formatter={(y) => format(y, { symbol: 'USD' })}
              />
            ),
          }}
          rightContainer={{
            title: 'Current volume per chain',
            content: (
              <ControlledDonutChart
                seriesName="Volume (USD)"
                volumeLastWeek={displayedChains?.map((chain) => {
                  const volume =
                    data?.byChain.get(chain.chainId)?.volumeLastWeek ?? 0;
                  return {
                    name: chain.displayName,
                    y: volume,
                    color: chain.color,
                  };
                })}
                volumeLastMonth={displayedChains?.map((chain) => {
                  const volume =
                    data?.byChain.get(chain.chainId)?.volumeLastMonth ?? 0;
                  return {
                    name: chain.displayName,
                    y: volume,
                    color: chain.color,
                  };
                })}
                volumeAllTime={displayedChains?.map((chain) => {
                  const volume =
                    data?.byChain.get(chain.chainId)?.volumeAllTime ?? 0;
                  return {
                    name: chain.displayName,
                    y: volume,
                    color: chain.color,
                  };
                })}
                tooltipFormatter={(y) => format(y, { symbol: 'USD' })}
                labelFormatter={(y) =>
                  format(y, { abbreviate: true, symbol: 'USD' })
                }
              />
            ),
          }}
        />
        <StatsContainer
          title={
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
          }
          reversed={true}
          // backgroundImageUrl="card-bg-4.svg"
          headerMetrics={[
            {
              title: 'All time',
              value: format(data?.allSelectedChains.transactionsCountAllTime, {
                symbol: 'USD',
                abbreviate: true,
              }),
            },
            {
              title: '24H',
              value: format(data?.allSelectedChains.transactionsCountLastDay, {
                symbol: 'USD',
                abbreviate: true,
              }),
              subValue: (
                <TrendLabelPercent
                  value={data?.allSelectedChains.transactionsCountLastDayTrend}
                />
              ),
            },
            {
              title: '7D',
              value: format(data?.allSelectedChains.transactionsCountLastWeek, {
                symbol: 'USD',
                abbreviate: true,
              }),
              subValue: (
                <TrendLabelPercent
                  value={data?.allSelectedChains.transactionsCountLastWeekTrend}
                />
              ),
            },
            {
              title: '30D',
              value: format(
                data?.allSelectedChains.transactionsCountLastMonth,
                {
                  symbol: 'USD',
                  abbreviate: true,
                }
              ),
              subValue: (
                <TrendLabelPercent
                  value={
                    data?.allSelectedChains.transactionsCountLastMonthTrend
                  }
                />
              ),
            },
          ]}
          rightContainer={{
            title: 'Current transactions per chain',
            content: (
              <ControlledDonutChart
                seriesName="Transactions"
                volumeLastWeek={displayedChains?.map((chain) => {
                  const volume =
                    data?.byChain.get(chain.chainId)
                      ?.transactionsCountLastWeek ?? 0;
                  return {
                    name: chain.displayName,
                    y: volume,
                    color: chain.color,
                  };
                })}
                volumeLastMonth={displayedChains?.map((chain) => {
                  const volume =
                    data?.byChain.get(chain.chainId)
                      ?.transactionsCountLastMonth ?? 0;
                  return {
                    name: chain.displayName,
                    y: volume,
                    color: chain.color,
                  };
                })}
                volumeAllTime={displayedChains?.map((chain) => {
                  const volume =
                    data?.byChain.get(chain.chainId)
                      ?.transactionsCountAllTime ?? 0;
                  return {
                    name: chain.displayName,
                    y: volume,
                    color: chain.color,
                  };
                })}
                labelFormatter={(y) =>
                  format(y, { decimals: 0, abbreviate: true })
                }
                tooltipFormatter={(y) => format(y, { decimals: 0 })}
              />
            ),
          }}
          leftContainer={{
            title: 'Historical transactions per chain',
            content: (
              <ControlledHistogramChart
                dailyTimeseriesList={
                  data
                    ? displayedChains?.map(
                        (chain) =>
                          data!.byChain.get(chain.chainId)!
                            .transactionsCountDailyTimeseries
                      )
                    : undefined
                }
                weeklyTimeseriesList={
                  data
                    ? displayedChains?.map(
                        (chain) =>
                          data!.byChain.get(chain.chainId)!
                            .transactionsCountWeeklyTimeseries
                      )
                    : undefined
                }
                monthlyTimeseriesList={
                  data
                    ? displayedChains?.map(
                        (chain) =>
                          data!.byChain.get(chain.chainId)!
                            .transactionsCountMonthlyTimeseries
                      )
                    : undefined
                }
                formatter={(y) => format(y, { decimals: 0 })}
              />
            ),
          }}
        />
        <StatsContainer
          title={
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
          }
          // backgroundImageUrl="card-bg-2.svg"
          headerMetrics={[
            {
              title: 'All time',
              value: format(data?.allSelectedChains.walletsCountAllTime, {
                abbreviate: true,
              }),
            },
            {
              title: '24H',
              value: format(data?.allSelectedChains.walletsCountLastDay, {
                abbreviate: true,
              }),
              subValue: (
                <TrendLabelPercent
                  value={data?.allSelectedChains.walletsCountLastDayTrend}
                />
              ),
            },
            {
              title: '7D',
              value: format(data?.allSelectedChains.walletsCountLastWeek, {
                abbreviate: true,
              }),
              subValue: (
                <TrendLabelPercent
                  value={data?.allSelectedChains.walletsCountLastWeekTrend}
                />
              ),
            },
            {
              title: '30D',
              value: format(data?.allSelectedChains.walletsCountLastMonth, {
                abbreviate: true,
              }),
              subValue: (
                <TrendLabelPercent
                  value={data?.allSelectedChains.walletsCountLastMonthTrend}
                />
              ),
            },
          ]}
          leftContainer={{
            title: 'Historical users per chain',
            content: (
              <ControlledHistogramChart
                dailyTimeseriesList={
                  data
                    ? displayedChains?.map(
                        (chain) =>
                          data!.byChain.get(chain.chainId)!
                            .walletsCountDailyTimeseries
                      )
                    : undefined
                }
                weeklyTimeseriesList={
                  data
                    ? displayedChains?.map(
                        (chain) =>
                          data!.byChain.get(chain.chainId)!
                            .walletsCountWeeklyTimeseries
                      )
                    : undefined
                }
                monthlyTimeseriesList={
                  data
                    ? displayedChains?.map(
                        (chain) =>
                          data!.byChain.get(chain.chainId)!
                            .walletsCountMonthlyTimeseries
                      )
                    : undefined
                }
                formatter={(y) => format(y, { decimals: 0 })}
              />
            ),
          }}
          rightContainer={{
            title: 'Current users per chain',
            content: (
              <ControlledDonutChart
                seriesName="Wallets"
                volumeLastWeek={displayedChains?.map((chain) => {
                  const volume =
                    data?.byChain.get(chain.chainId)?.walletsCountLastWeek ?? 0;
                  return {
                    name: chain.displayName,
                    y: volume,
                    color: chain.color,
                  };
                })}
                volumeLastMonth={displayedChains?.map((chain) => {
                  const volume =
                    data?.byChain.get(chain.chainId)?.walletsCountLastMonth ??
                    0;
                  return {
                    name: chain.displayName,
                    y: volume,
                    color: chain.color,
                  };
                })}
                volumeAllTime={displayedChains?.map((chain) => {
                  const volume =
                    data?.byChain.get(chain.chainId)?.walletsCountAllTime ?? 0;
                  return {
                    name: chain.displayName,
                    y: volume,
                    color: chain.color,
                  };
                })}
                labelFormatter={(y) =>
                  format(y, { decimals: 0, abbreviate: true })
                }
                tooltipFormatter={(y) => format(y, { decimals: 0 })}
              />
            ),
          }}
        />
      </div>
    </Container>
  );
}

Home.getLayout = function getLayout(page: any) {
  return <Dashboard>{page}</Dashboard>;
};
