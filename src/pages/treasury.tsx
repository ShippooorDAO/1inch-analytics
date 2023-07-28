import { css, useTheme } from '@emotion/react';
import { Container, Typography } from '@mui/material';
import { green, red } from '@mui/material/colors';
import { useMemo, useState } from 'react';

import { HistogramChart } from '@/components/chart/HistogramChart';
import {
  StatsContainer,
  StatsContainerLayout,
} from '@/components/container/StatsContainer';
import { EtherscanButton } from '@/components/EtherscanButton';
import { PageTitle } from '@/components/PageTitle';
import { TreasuryBalancesTable } from '@/components/TreasuryBalancesTable';
import { TreasuryCashflowBreakdownTable } from '@/components/TreasuryCashflowBreakdownTable';
import { TreasuryTransactionsTable } from '@/components/TreasuryTransactionsTable';
import { useTreasuryBalances } from '@/hooks/useTreasuryBalances';
import { useTreasuryCashflowBreakdown } from '@/hooks/useTreasuryCashflowBreakdown';
import { TreasuryFlows, useTreasuryFlows } from '@/hooks/useTreasuryFlows';
import Dashboard from '@/layouts/DashboardLayout';
import { TREASURY_ADDRESS } from '@/shared/Constants';
import {
  getTimeIntervalLabel,
  TimeInterval,
  Timeseries,
  TimeWindow,
} from '@/shared/Model/Timeseries';
import { format } from '@/shared/Utils/Format';

function ControlledTreasuryFlowsChart({
  treasuryFlows,
}: {
  treasuryFlows?: TreasuryFlows;
}) {
  const [selectedTimeWindow, setSelectedTimeWindow] = useState(TimeWindow.MAX);
  const [selectedTimeInterval, setSelectedTimeInterval] = useState(
    TimeInterval.MONTHLY
  );
  const [selectedTimeseries, setSelectedTimeseries] = useState<Timeseries[]>();

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
    const res = [
      {
        ...timeseriesSetForTimeInterval.inboundVolumeUsdTimeseries,
        color: green[400],
        type: 'column',
        stack: 1,
      },
      {
        ...timeseriesSetForTimeInterval.outboundVolumeUsdTimeseries,
        color: red[400],
        type: 'column',
        stack: 1,
      },
      {
        ...timeseriesSetForTimeInterval.cumulativeRevenueUsdTimeseries,
        type: 'area',
        color: green[500],
        stack: 2,
      },
      {
        ...timeseriesSetForTimeInterval.cumulativeExpenseUsdTimeseries,
        type: 'area',
        color: red[500],
        stack: 3,
      },
    ] as Timeseries[];
    setSelectedTimeseries(res);
    return res;
  }, [selectedTimeWindow, selectedTimeInterval, treasuryFlows]);

  return (
    <HistogramChart
      timeseriesList={selectedTimeseries ?? []}
      timeInterval={selectedTimeInterval}
      timeWindow={selectedTimeWindow}
      timeIntervalOptions={[TimeInterval.MONTHLY, TimeInterval.QUARTERLY].map(
        (t) => ({ label: getTimeIntervalLabel(t), value: t })
      )}
      timeseriesOptions={timeseriesList}
      onTimeseriesChange={setSelectedTimeseries}
      onTimeIntervalChange={setSelectedTimeInterval}
      excludeTotalFromTooltip={true}
      excludeSharesFromTooltip={true}
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
      timeseriesOptions={timeseriesList}
      onTimeseriesChange={() => {}}
      excludeTotalFromTooltip={true}
      excludeSharesFromTooltip={true}
    />
  );
}

export default function TreasuryPage() {
  const treasuryFlowsContext = useTreasuryFlows();
  const treasuryBalanceContext = useTreasuryBalances();
  const treasuryCashFlowBreakdown = useTreasuryCashflowBreakdown();

  return (
    <Container
      css={css`
        padding: 10px 0;
      `}
    >
      <div
        css={css`
          display: flex;
          flex-flow: column;
          gap: 20px;
        `}
      >
        <StatsContainer
          layout={StatsContainerLayout.ONE_HALF_ONE_HALF}
          title={
            <PageTitle
              icon={
                <img
                  height="32px"
                  width="32px"
                  src="/bank.svg"
                  alt="treasury"
                />
              }
            >
              Treasury
            </PageTitle>
          }
          loading={treasuryFlowsContext.loading || !treasuryBalanceContext.data}
          headerMetrics={[
            {
              title: 'Total Revenues',
              value: format(
                treasuryCashFlowBreakdown?.data?.revenues ?? 12345,
                {
                  abbreviate: true,
                }
              ),
            },
            {
              title: 'Total Expenses',
              value: format(
                treasuryCashFlowBreakdown?.data?.expenses ?? 12345,
                {
                  abbreviate: true,
                }
              ),
            },
            {
              title: 'Net Worth',
              value:
                treasuryBalanceContext.data?.totalValueUsd?.toDisplayString({
                  abbreviate: true,
                }) ?? 12345,
            },
          ]}
          containers={[
            {
              // title: 'Balance',
              content: (
                <div
                  css={css`
                    display: flex;
                    flex-flow: column;
                    justify-content: flex-end;
                    height: 100%;
                  `}
                >
                  <ControlledHistoricalBalanceChart
                    treasuryFlows={treasuryFlowsContext.data}
                  />
                </div>
              ),
            },
            {
              // title: 'Cash Flows',
              content: (
                <ControlledTreasuryFlowsChart
                  treasuryFlows={treasuryFlowsContext.data}
                />
              ),
            },
          ]}
        />
        <StatsContainer
          layout={StatsContainerLayout.TWO_THIRDS_ONE_THIRD}
          containers={[
            {
              title: (
                <div
                  css={css`
                    display: flex;
                    flex-flow: row;
                    gap: 10px;
                  `}
                >
                  <Typography variant="h3">Portfolio</Typography>
                  <EtherscanButton size="medium" address={TREASURY_ADDRESS} />
                </div>
              ),
              content: (
                <TreasuryBalancesTable
                  data={treasuryBalanceContext.data}
                  mockData={treasuryBalanceContext.mockData ?? undefined}
                />
              ),
            },
            {
              title: 'Cash Flow Breakdown',
              content: (
                <TreasuryCashflowBreakdownTable
                  data={treasuryCashFlowBreakdown.data}
                />
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
