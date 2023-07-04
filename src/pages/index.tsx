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

import { TrendLabelPercent } from '@/components/MetricsCard';
import { format } from '@/shared/Utils/Format';
import { BarChart } from '@/components/chart/BarChart';
import { Chain } from '@/shared/Model/Chain';
import { useDexAggregatorOverview } from '@/hooks/useDexAggregatorOverview';
import { useMemo, useState } from 'react';
import { useOneInchAnalyticsAPIContext } from '@/shared/OneInchAnalyticsAPI/OneInchAnalyticsAPIProvider';
import { TimeWindowToggleButtonGroup } from '@/components/chart/TimeWindowToggleButtonGroup';
import {
  StatsContainer,
  StatsContainerLayout,
} from '@/components/StatsContainer';
import { scopeTimeseriesToTimeWindow } from '@/shared/Utils/Chart';
import { ChainMultiSelect } from '@/components/filters/ChainMultiSelect';
import { PageTitle } from '@/components/PageTitle';

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

interface ControlledBarChartProps {
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

function ControlledBarChart({
  seriesName,
  tooltipFormatter,
  labelFormatter,
  volumeLastWeek,
  volumeLastMonth,
  volumeAllTime,
}: ControlledBarChartProps) {
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
      <BarChart
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

  const chainOptions = useMemo(() => chainStore?.getAll() ?? [], [chainStore]);

  const displayedChains = useMemo(() => {
    if (!chainStore) {
      return undefined;
    }

    if (selectedChains.length === 0) {
      return chainStore?.getAll();
    }

    return selectedChains;
  }, [selectedChains, chainStore]);

  const { data, loading } = useDexAggregatorOverview({
    chainIds: displayedChains?.map((chain) => chain.id),
  });

  const loadingStubValue = 12.34;

  return (
    <Container
      css={css`
        padding: 20px;
      `}
    >
      <div
        css={css`
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
          margin-bottom: 5px;
        `}
      >
        <PageTitle>1inch Aggregation Protocol Overview</PageTitle>

        <div
          css={css`
            display: flex;
            flex-flow: row;
            align-items: center;
            gap: 5px;
            text-wrap: nowrap;
          `}
        >
          Filter by chain:
          <ChainMultiSelect
            values={selectedChains}
            onChange={setSelectedChains}
            chains={chainOptions ?? []}
          />
        </div>
      </div>
      <div
        css={css`
          display: flex;
          flex-flow: column;
          gap: 20px;
        `}
      >
        <StatsContainer
          title={
            <div
              css={css`
                display: flex;
                flex-flow: row;
                align-items: center;
                gap: 5px;
              `}
            >
              <img height="24px" width="24px" src="/chart.svg" alt="volume" />
              <Typography variant="h3">Volume</Typography>
            </div>
          }
          // backgroundImageUrl="card-bg-5.svg"
          headerMetrics={[
            {
              title: 'All time',
              value: format(
                data?.allSelectedChains.volumeAllTime ?? loadingStubValue,
                {
                  symbol: 'USD',
                  abbreviate: true,
                }
              ),
              loading,
            },
            {
              title: '24H',
              value: format(
                data?.allSelectedChains.volumeLastDay ?? loadingStubValue,
                {
                  symbol: 'USD',
                  abbreviate: true,
                }
              ),
              subValue: (
                <TrendLabelPercent
                  value={
                    data?.allSelectedChains.volumeLastDayTrend ??
                    loadingStubValue
                  }
                />
              ),
              loading,
            },
            {
              title: '7D',
              value: format(
                data?.allSelectedChains.volumeLastWeek ?? loadingStubValue,
                {
                  symbol: 'USD',
                  abbreviate: true,
                }
              ),
              subValue: (
                <TrendLabelPercent
                  value={
                    data?.allSelectedChains.volumeLastWeekTrend ??
                    loadingStubValue
                  }
                />
              ),
              loading,
            },
            {
              title: '30D',
              value: format(
                data?.allSelectedChains.volumeLastMonth ?? loadingStubValue,
                {
                  symbol: 'USD',
                  abbreviate: true,
                }
              ),
              subValue: (
                <TrendLabelPercent
                  value={
                    data?.allSelectedChains.volumeLastMonthTrend ??
                    loadingStubValue
                  }
                />
              ),
              loading,
            },
          ]}
          containers={[
            {
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
            },
            {
              content: (
                <ControlledBarChart
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
            },
          ]}
        />
        <StatsContainer
          title={
            <div
              css={css`
                display: flex;
                flex-flow: row;
                align-items: center;
                gap: 5px;
              `}
            >
              <img
                height="24px"
                width="24px"
                src="/swap.svg"
                alt="transactions"
              />
              <Typography variant="h3">Transactions</Typography>
            </div>
          }
          layout={StatsContainerLayout.TWO_THIRDS_ONE_THIRD}
          headerMetrics={[
            {
              title: 'All time',
              value: format(
                data?.allSelectedChains.transactionsCountAllTime ??
                  loadingStubValue,
                {
                  symbol: 'USD',
                  abbreviate: true,
                }
              ),
              loading,
            },
            {
              title: '24H',
              value: format(
                data?.allSelectedChains.transactionsCountLastDay ??
                  loadingStubValue,
                {
                  symbol: 'USD',
                  abbreviate: true,
                }
              ),
              subValue: (
                <TrendLabelPercent
                  value={
                    data?.allSelectedChains.transactionsCountLastDayTrend ??
                    loadingStubValue
                  }
                />
              ),
              loading,
            },
            {
              title: '7D',
              value: format(
                data?.allSelectedChains.transactionsCountLastWeek ??
                  loadingStubValue,
                {
                  symbol: 'USD',
                  abbreviate: true,
                }
              ),
              subValue: (
                <TrendLabelPercent
                  value={
                    data?.allSelectedChains.transactionsCountLastWeekTrend ??
                    loadingStubValue
                  }
                />
              ),
              loading,
            },
            {
              title: '30D',
              value: format(
                data?.allSelectedChains.transactionsCountLastMonth ??
                  loadingStubValue,
                {
                  symbol: 'USD',
                  abbreviate: true,
                }
              ),
              subValue: (
                <TrendLabelPercent
                  value={
                    data?.allSelectedChains.transactionsCountLastMonthTrend ??
                    loadingStubValue
                  }
                />
              ),
              loading,
            },
          ]}
          containers={[
            {
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
            },
            {
              content: (
                <ControlledBarChart
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
            },
          ]}
        />
        <StatsContainer
          title={
            <div
              css={css`
                display: flex;
                flex-flow: row;
                align-items: center;
                gap: 5px;
              `}
            >
              <img height="24px" width="24px" src="/profile.svg" alt="users" />
              <Typography variant="h3">Users</Typography>
            </div>
          }
          // backgroundImageUrl="card-bg-2.svg"
          headerMetrics={[
            {
              title: 'All time',
              value: format(
                data?.allSelectedChains.walletsCountAllTime ?? loadingStubValue,
                {
                  abbreviate: true,
                }
              ),
              loading,
            },
            {
              title: '24H',
              value: format(
                data?.allSelectedChains.walletsCountLastDay ?? loadingStubValue,
                {
                  abbreviate: true,
                }
              ),
              subValue: (
                <TrendLabelPercent
                  value={
                    data?.allSelectedChains.walletsCountLastDayTrend ??
                    loadingStubValue
                  }
                />
              ),
              loading,
            },
            {
              title: '7D',
              value: format(
                data?.allSelectedChains.walletsCountLastWeek ??
                  loadingStubValue,
                {
                  abbreviate: true,
                }
              ),
              subValue: (
                <TrendLabelPercent
                  value={
                    data?.allSelectedChains.walletsCountLastWeekTrend ??
                    loadingStubValue
                  }
                />
              ),
              loading,
            },
            {
              title: '30D',
              value: format(
                data?.allSelectedChains.walletsCountLastMonth ??
                  loadingStubValue,
                {
                  abbreviate: true,
                }
              ),
              subValue: (
                <TrendLabelPercent
                  value={
                    data?.allSelectedChains.walletsCountLastMonthTrend ??
                    loadingStubValue
                  }
                />
              ),
              loading,
            },
          ]}
          containers={[
            {
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
            },
            {
              content: (
                <ControlledBarChart
                  seriesName="Wallets"
                  volumeLastWeek={displayedChains?.map((chain) => {
                    const volume =
                      data?.byChain.get(chain.chainId)?.walletsCountLastWeek ??
                      0;
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
                      data?.byChain.get(chain.chainId)?.walletsCountAllTime ??
                      0;
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
            },
          ]}
        />
      </div>
    </Container>
  );
}

Home.getLayout = function getLayout(page: any) {
  return <Dashboard>{page}</Dashboard>;
};
