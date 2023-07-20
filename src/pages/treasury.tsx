import { css, useTheme } from '@emotion/react';
import { Container } from '@mui/material';
import { green, red } from '@mui/material/colors';
import { useMemo, useState } from 'react';

import { HistogramChart } from '@/components/chart/HistogramChart';
import { MetricsCard, TrendLabelPercent } from '@/components/MetricsCard';
import { PageTitle } from '@/components/PageTitle';
import {
  StatsContainer,
  StatsContainerLayout,
} from '@/components/StatsContainer';
import { TreasuryBalancesTable } from '@/components/TreasuryBalancesTable';
import { TreasuryTransactionsTable } from '@/components/TreasuryTransactionsTable';
import { TreasuryFlows, useTreasuryFlows } from '@/hooks/useTreasuryFlows';
import Dashboard from '@/layouts/DashboardLayout';
import {
  getTimeIntervalLabel,
  TimeInterval,
  Timeseries,
  TimeWindow,
} from '@/shared/Model/Timeseries';

function ControlledTreasuryFlowsChart({
  treasuryFlows,
}: {
  treasuryFlows?: TreasuryFlows;
}) {
  const theme = useTheme();
  const [selectedTimeWindow, setSelectedTimeWindow] = useState(TimeWindow.MAX);
  const [selectedTimeInterval, setSelectedTimeInterval] = useState(
    TimeInterval.MONTHLY
  );

  const timeseriesList = useMemo(() => {
    const timeseriesSetForTimeInterval = (() => {
      switch (selectedTimeInterval) {
        case TimeInterval.DAILY:
          return treasuryFlows?.daily;
        case TimeInterval.WEEKLY:
          return treasuryFlows?.weekly;
        case TimeInterval.MONTHLY:
          return treasuryFlows?.monthly;
        case TimeInterval.QUARTERLY:
          return treasuryFlows?.quarterly;
        case TimeInterval.YEARLY:
          return treasuryFlows?.yearly;
        default:
          return undefined;
      }
    })();
    if (!timeseriesSetForTimeInterval) {
      return [];
    }
    return [
      {
        ...timeseriesSetForTimeInterval.inboundVolumeUsdTimeseries,
        color: green[400],
        type: 'bar',
      },
      {
        ...timeseriesSetForTimeInterval.outboundVolumeUsdTimeseries,
        color: red[400],
        type: 'bar',
      },
      {
        ...timeseriesSetForTimeInterval.cumulativeRevenueUsdTimeseries,
        type: 'area',
        color: green[500],
      },
      {
        ...timeseriesSetForTimeInterval.cumulativeExpenseUsdTimeseries,
        type: 'area',
        color: red[500],
      },
    ] as Timeseries[];
  }, [selectedTimeWindow, selectedTimeInterval, treasuryFlows]);

  return (
    <HistogramChart
      timeseriesList={timeseriesList}
      timeInterval={selectedTimeInterval}
      timeWindow={selectedTimeWindow}
      timeIntervalOptions={[TimeInterval.MONTHLY, TimeInterval.QUARTERLY].map(
        (t) => ({ label: getTimeIntervalLabel(t), value: t })
      )}
      onTimeIntervalChange={setSelectedTimeInterval}
    />
  );
}

function ControlledHistoricalBalanceChart({
  treasuryFlows,
}: {
  treasuryFlows?: TreasuryFlows;
}) {
  const theme = useTheme();
  const [selectedTimeWindow, setSelectedTimeWindow] = useState(TimeWindow.MAX);
  const [selectedTimeInterval, setSelectedTimeInterval] = useState(
    TimeInterval.DAILY
  );

  const timeseriesList = useMemo(() => {
    const timeseriesSetForTimeInterval = (() => {
      switch (selectedTimeInterval) {
        case TimeInterval.DAILY:
          return treasuryFlows?.daily;
        case TimeInterval.WEEKLY:
          return treasuryFlows?.weekly;
        case TimeInterval.MONTHLY:
          return treasuryFlows?.monthly;
        case TimeInterval.QUARTERLY:
          return treasuryFlows?.quarterly;
        case TimeInterval.YEARLY:
          return treasuryFlows?.yearly;
        default:
          return undefined;
      }
    })();
    if (!timeseriesSetForTimeInterval) {
      return [];
    }
    return [
      {
        ...timeseriesSetForTimeInterval.balanceUsdTimeseries,
        color: theme.palette.primary.main,
        type: 'area',
      },
    ] as Timeseries[];
  }, [selectedTimeWindow, selectedTimeInterval, treasuryFlows]);

  return (
    <HistogramChart
      timeseriesList={timeseriesList}
      timeInterval={selectedTimeInterval}
      timeWindow={selectedTimeWindow}
    />
  );
}

export default function TreasuryPage() {
  const { treasuryFlows } = useTreasuryFlows();

  return (
    <Container
      css={css`
        padding: 20px;
      `}
    >
      <div
        css={css`
          display: flex;
          flex-flow: column;
          gap: 20px;
        `}
      >
        <PageTitle>Treasury</PageTitle>
        <div
          css={css`
            display: flex;
            flex-flow: row;
            justify-content: center;
            gap: 20px;
          `}
        >
          <MetricsCard
            title="Net Worth (7D)"
            value="$1.26M"
            subValue={<TrendLabelPercent value={-0.09} />}
          />
          <MetricsCard title="Total Revenue (7D)" value="$1.26M" />
        </div>
        <StatsContainer
          layout={StatsContainerLayout.ONE_HALF_ONE_HALF}
          containers={[
            {
              title: 'Treasury Balance',
              content: (
                <ControlledHistoricalBalanceChart
                  treasuryFlows={treasuryFlows}
                />
              ),
            },
            {
              title: 'Cash Flows',
              content: (
                <ControlledTreasuryFlowsChart treasuryFlows={treasuryFlows} />
              ),
            },
          ]}
        />
        <div
          css={(theme) => css`
            width: 100%;
            background-color: ${theme.palette.background.paper};
            border-radius: 24px;
            ${theme.breakpoints.down('md')} {
              width: 100%;
            }
          `}
        >
          <TreasuryBalancesTable />
        </div>
        <div
          css={(theme) => css`
            width: 100%;
            background-color: ${theme.palette.background.paper};
            border-radius: 24px;
            ${theme.breakpoints.down('md')} {
              width: 100%;
            }
            height: 768px;
          `}
        >
          <TreasuryTransactionsTable />
        </div>
      </div>
    </Container>
  );
}

TreasuryPage.getLayout = function getLayout(page: any) {
  return <Dashboard>{page}</Dashboard>;
};
