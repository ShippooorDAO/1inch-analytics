import { css } from '@emotion/react';
import { Button, Container, Typography } from '@mui/material';
import { useMemo, useState } from 'react';

import { AddressCopyButton } from '@/components/AddressCopyButton';
import { DonutChart } from '@/components/chart/DonutChart';
import { HistogramChart } from '@/components/chart/HistogramChart';
import { TimeWindowToggleButtonGroup } from '@/components/chart/TimeWindowToggleButtonGroup';
import { EtherscanButton } from '@/components/EtherscanButton';
import { RoundedImageIcon } from '@/components/icons/RoundedImageIcon';
import { SlimMetricsCard, TrendLabelPercent } from '@/components/MetricsCard';
import { MultiTabSection } from '@/components/SectionContainer';
import { StatsContainer } from '@/components/StatsContainer';
import { useFusionResolvers } from '@/hooks/useFusionResolvers';
import {
  FusionResolverMetrics,
  FusionResolversMetrics,
  useFusionResolversMetrics,
} from '@/hooks/useFusionResolversMetrics';
import Dashboard from '@/layouts/DashboardLayout';
import {
  FusionResolver,
  getDuneResolverNameFromResolverAddress,
} from '@/shared/Model/FusionResolver';
import { TimeInterval, TimeWindow } from '@/shared/Model/Timeseries';
import { format } from '@/shared/Utils/Format';

interface ControlledDonutChartProps {
  seriesName: string;
  formatter: (y?: number | null) => string;
  volumeLastWeek?: {
    name: string;
    y: number;
    color?: string;
  }[];
  volumeLastMonth?: {
    name: string;
    y: number;
    color?: string;
  }[];
  volumeAllTime?: {
    name: string;
    y: number;
    color?: string;
  }[];
}

function ControlledDonutChart({
  seriesName,
  formatter,
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

  const options = (() => {
    const res = [];
    if (volumeLastWeek) {
      res.push({ value: TimeWindow.SEVEN_DAYS, label: 'Last Week' });
    }
    if (volumeLastMonth) {
      res.push({ value: TimeWindow.ONE_MONTH, label: 'Last Month' });
    }
    if (volumeAllTime) {
      res.push({ value: TimeWindow.MAX, label: 'All Time' });
    }
    return res;
  })();

  return (
    <>
      <TimeWindowToggleButtonGroup
        value={timeWindow}
        onChange={handleTimeWindowChange}
        options={options}
      />
      <DonutChart seriesName={seriesName} data={data} formatter={formatter} />
    </>
  );
}

function useFusionPageData() {
  const fusionResolversContext = useFusionResolvers();
  const fusionResolversMetricsContext = useFusionResolversMetrics(
    fusionResolversContext.data
  );

  const getFusionResolverMetrics = (
    resolver: FusionResolver
  ): FusionResolverMetrics | undefined => {
    if (!fusionResolversMetricsContext.data) {
      return undefined;
    }

    const duneResolverName = getDuneResolverNameFromResolverAddress(
      resolver.address
    );

    if (!duneResolverName) {
      return undefined;
    }

    return fusionResolversMetricsContext.data.byResolver.get(duneResolverName);
  };

  const loading =
    fusionResolversMetricsContext.loading || fusionResolversContext.loading;

  return {
    getFusionResolverMetrics,
    fusionResolversMetrics: fusionResolversMetricsContext.data,
    fusionResolvers: fusionResolversContext.data,
    loading,
  };
}

interface FusionResolversTableProps {
  fusionResolvers?: FusionResolver[];
  fusionResolversMetrics?: FusionResolversMetrics;
  getFusionResolverMetrics: (
    resolver: FusionResolver
  ) => FusionResolverMetrics | undefined;
}

function FusionResolversTable({
  fusionResolvers,
  getFusionResolverMetrics,
  fusionResolversMetrics,
}: FusionResolversTableProps) {
  const [sortBy, setSortBy] = useState<'volume' | 'transactions' | 'wallets'>(
    'volume'
  );
  const sortedFusionResolvers = useMemo(() => {
    if (!fusionResolvers) {
      return undefined;
    }

    return fusionResolvers.sort((a, b) => {
      const aMetrics = getFusionResolverMetrics(a);
      const bMetrics = getFusionResolverMetrics(b);

      if (!aMetrics || !bMetrics) {
        return 0;
      }

      switch (sortBy) {
        case 'transactions':
          return (
            bMetrics.transactionsCountLastWeek -
            aMetrics.transactionsCountLastWeek
          );
        case 'wallets':
          return bMetrics.walletsCountLastWeek - aMetrics.walletsCountLastWeek;
        case 'volume':
        default:
          return bMetrics.volumeLastWeek - aMetrics.volumeLastWeek;
      }
    });
  }, [sortBy, fusionResolvers, getFusionResolverMetrics]);

  return (
    <div
      css={css`
        display: flex;
        flex-flow: column;
        justify-content: space-between;
      `}
    >
      <div>
        <div
          css={css`
            display: flex;
            flex-flow: row;
            gap: 10px;
            align-items: center;
            padding: 10px 20px;
          `}
        >
          <div
            css={css`
              width: 440px;
              text-align: left;
            `}
          >
            <Typography variant="body2" color="textSecondary">
              Resolver
            </Typography>
          </div>
          <div
            css={css`
              flex-grow: 1;
              text-align: right;
            `}
          >
            <Button variant="text" onClick={() => setSortBy('volume')}>
              <Typography
                variant="body2"
                color="textSecondary"
                fontWeight={sortBy === 'volume' ? 'bold' : 'normal'}
              >
                Volume (7d)
              </Typography>
            </Button>
          </div>
          <div
            css={css`
              flex-grow: 1;
              text-align: right;
            `}
          >
            <Button variant="text" onClick={() => setSortBy('transactions')}>
              <Typography
                variant="body2"
                color="textSecondary"
                fontWeight={sortBy === 'transactions' ? 'bold' : 'normal'}
              >
                Transactions (7d)
              </Typography>
            </Button>
          </div>
          <div
            css={css`
              flex-grow: 1;
              text-align: right;
            `}
          >
            <Button variant="text" onClick={() => setSortBy('wallets')}>
              <Typography
                variant="body2"
                color="textSecondary"
                fontWeight={sortBy === 'wallets' ? 'bold' : 'normal'}
              >
                Unique wallets (7d)
              </Typography>
            </Button>
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
        {sortedFusionResolvers?.map((fusionResolver) => (
          <div
            key={fusionResolver.id}
            css={(theme) => css`
              display: flex;
              flex-flow: row;
              gap: 10px;
              align-items: center;
              padding: 20px;
              border-radius: 24px;
              background-color: ${theme.palette.background.paper};
            `}
          >
            <img
              src={fusionResolver.imageUrl}
              alt={fusionResolver.name}
              css={css`
                height: 40px;
                width: 40px;
              `}
            />
            <div>
              <div
                css={css`
                  display: flex;
                  flex-flow: row;
                  align-items: center;
                  gap: 10px;
                  width: 350px;
                `}
              >
                <a
                  href={`https://app.1inch.io/#/1/earn/delegate/${fusionResolver.address}`}
                >
                  <Typography variant="h3">{fusionResolver.name}</Typography>
                </a>
                <EtherscanButton
                  size="small"
                  address={fusionResolver.address}
                />
                <AddressCopyButton
                  size="small"
                  address={fusionResolver.address}
                />
              </div>
              <Typography variant="body2" color="textSecondary">
                {fusionResolver.address}
              </Typography>
            </div>
            <div
              css={css`
                display: flex;
                flex-flow: row;
                align-items: center;
                gap: 10px;
                flex-grow: 1;
              `}
            >
              <div
                css={css`
                  display: flex;
                  flex-flow: column;
                  flex-grow: 1;
                  justify-content: flex-end;
                  align-items: flex-end;
                  padding-left: 20px;
                `}
              >
                <Typography variant="h3" fontWeight={400}>
                  {format(
                    getFusionResolverMetrics(fusionResolver)?.volumeLastWeek,
                    { symbol: 'USD', decimals: 0 }
                  )}
                </Typography>
                <TrendLabelPercent
                  value={
                    getFusionResolverMetrics(fusionResolver)
                      ?.volumeLastWeekTrend
                  }
                  iconAlign="left"
                />
                <Typography variant="body2" color="textSecondary">
                  {format(
                    (getFusionResolverMetrics(fusionResolver)?.volumeLastWeek ??
                      0) /
                      (fusionResolversMetrics?.allResolvers.volumeLastWeek ??
                        1),
                    { symbol: '%' }
                  )}{' '}
                  of total volume
                </Typography>
              </div>
            </div>
            <div
              css={css`
                display: flex;
                flex-flow: column;
                flex-grow: 1;
                justify-content: flex-end;
                align-items: flex-end;
                padding-left: 20px;
              `}
            >
              <Typography variant="h3" fontWeight={400}>
                {format(
                  getFusionResolverMetrics(fusionResolver)
                    ?.transactionsCountLastWeek,
                  {
                    decimals: 0,
                  }
                )}
              </Typography>
              <TrendLabelPercent
                value={
                  getFusionResolverMetrics(fusionResolver)?.volumeLastWeekTrend
                }
                iconAlign="left"
              />
              <Typography variant="body2" color="textSecondary">
                {format(
                  (getFusionResolverMetrics(fusionResolver)
                    ?.transactionsCountLastWeek ?? 0) /
                    (fusionResolversMetrics?.allResolvers
                      .transactionsCountLastWeek ?? 1),
                  { symbol: '%' }
                )}{' '}
                of total trades
              </Typography>
            </div>
            <div
              css={css`
                display: flex;
                flex-flow: column;
                flex-grow: 1;
                justify-content: flex-end;
                align-items: flex-end;
                padding-left: 20px;
              `}
            >
              <Typography variant="h3" fontWeight={400}>
                {format(
                  getFusionResolverMetrics(fusionResolver)
                    ?.walletsCountLastWeek,
                  {
                    decimals: 0,
                  }
                )}
              </Typography>
              <TrendLabelPercent
                value={
                  getFusionResolverMetrics(fusionResolver)
                    ?.walletsCountLastWeekTrend
                }
                iconAlign="left"
              />
              <Typography variant="body2" color="textSecondary">
                {format(
                  (getFusionResolverMetrics(fusionResolver)
                    ?.walletsCountLastWeek ?? 0) /
                    (fusionResolversMetrics?.allResolvers
                      .walletsCountLastWeek ?? 1),
                  { symbol: '%' }
                )}{' '}
                of total wallets
              </Typography>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default function FusionPage() {
  const {
    getFusionResolverMetrics,
    fusionResolvers,
    fusionResolversMetrics,
    loading,
  } = useFusionPageData();

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
          flex-flow: row;
          gap: 10px;
          align-content: center;
          align-items: center;
          justify-content: flex-start;
        `}
      >
        <RoundedImageIcon src="/vendors/1inch/fusion.webp" size="medium" />
        <Typography variant="h1">Fusion Mode</Typography>
      </div>
      <div
        css={css`
          display: flex;
          flex-flow: column;
          gap: 20px;
          margin-top: -40px;
        `}
      >
        <MultiTabSection
          tabs={[
            {
              label: 'Volume',
              content: (
                <StatsContainer
                  leftContainer={{
                    title: 'Historical volume per resolver',
                    content: (
                      <HistogramChart
                        timeseriesList={Array.from(
                          fusionResolversMetrics?.byResolver.values() ?? []
                        ).map((m) => m.volumeWeeklyTimeseries)}
                        timeWindow={TimeWindow.MAX}
                        timeInterval={TimeInterval.WEEKLY}
                        onTimeWindowChange={() => {}}
                        onTimeIntervalChange={() => {}}
                      />
                    ),
                  }}
                  rightContainer={{
                    title: 'Current volume per resolver',
                    content: (
                      <ControlledDonutChart
                        seriesName="Volume (USD)"
                        volumeLastWeek={Array.from(
                          fusionResolversMetrics?.byResolver.values() ?? []
                        ).map((m) => {
                          const volume = m?.volumeLastWeek ?? 0;
                          return {
                            name: m.volumeWeeklyTimeseries.name,
                            y: volume,
                            color: m.volumeWeeklyTimeseries.color,
                          };
                        })}
                        volumeAllTime={Array.from(
                          fusionResolversMetrics?.byResolver.values() ?? []
                        ).map((m) => {
                          const volume = m?.volumeAllTime ?? 0;
                          return {
                            name: m.volumeWeeklyTimeseries.name,
                            y: volume,
                            color: m.volumeWeeklyTimeseries.color,
                          };
                        })}
                        formatter={(y) => format(y, { symbol: 'USD' })}
                      />
                    ),
                  }}
                />
              ),
            },
            {
              label: 'Transactions',
              content: (
                <StatsContainer
                  leftContainer={{
                    title: 'Historical transaction count per resolver',
                    content: (
                      <HistogramChart
                        timeseriesList={Array.from(
                          fusionResolversMetrics?.byResolver.values() ?? []
                        ).map((m) => m.transactionsCountWeeklyTimeseries)}
                        timeWindow={TimeWindow.MAX}
                        timeInterval={TimeInterval.WEEKLY}
                        onTimeWindowChange={() => {}}
                        onTimeIntervalChange={() => {}}
                        formatter={(y) => format(y, { abbreviate: true })}
                      />
                    ),
                  }}
                  rightContainer={{
                    title: 'Total transaction count per resolver',
                    content: (
                      <ControlledDonutChart
                        seriesName="Transactions"
                        volumeLastWeek={Array.from(
                          fusionResolversMetrics?.byResolver.values() ?? []
                        ).map((m) => {
                          const y = m?.transactionsCountLastWeek ?? 0;
                          return {
                            name: m.volumeWeeklyTimeseries.name,
                            y,
                            color: m.volumeWeeklyTimeseries.color,
                          };
                        })}
                        volumeAllTime={Array.from(
                          fusionResolversMetrics?.byResolver.values() ?? []
                        ).map((m) => {
                          const y = m?.transactionsCountAllTime ?? 0;
                          return {
                            name: m.transactionsCountWeeklyTimeseries.name,
                            y,
                            color: m.transactionsCountWeeklyTimeseries.color,
                          };
                        })}
                        formatter={(y) => format(y, { abbreviate: true })}
                      />
                    ),
                  }}
                />
              ),
            },
            {
              label: 'Users',
              content: (
                <StatsContainer
                  leftContainer={{
                    title: 'Historical users per resolver',
                    content: (
                      <HistogramChart
                        timeseriesList={Array.from(
                          fusionResolversMetrics?.byResolver.values() ?? []
                        ).map((m) => m.walletsCountWeeklyTimeseries)}
                        timeWindow={TimeWindow.MAX}
                        timeInterval={TimeInterval.WEEKLY}
                        onTimeWindowChange={() => {}}
                        onTimeIntervalChange={() => {}}
                        formatter={(y) => format(y, { abbreviate: true })}
                      />
                    ),
                  }}
                  rightContainer={{
                    title: 'Total users per resolver',
                    content: (
                      <ControlledDonutChart
                        seriesName="Users"
                        volumeLastWeek={Array.from(
                          fusionResolversMetrics?.byResolver.values() ?? []
                        ).map((m) => {
                          const y = m?.walletsCountLastWeek ?? 0;
                          return {
                            name: m.walletsCountWeeklyTimeseries.name,
                            y,
                            color: m.walletsCountWeeklyTimeseries.color,
                          };
                        })}
                        volumeAllTime={Array.from(
                          fusionResolversMetrics?.byResolver.values() ?? []
                        ).map((m) => {
                          const y = m?.transactionsCountAllTime ?? 0;
                          return {
                            name: m.walletsCountWeeklyTimeseries.name,
                            y,
                            color: m.walletsCountWeeklyTimeseries.color,
                          };
                        })}
                        formatter={(y) => format(y, { abbreviate: true })}
                      />
                    ),
                  }}
                />
              ),
            },
          ]}
        />
        <div
          css={css`
            display: flex;
            flex-flow: column;
            gap: 10px;
          `}
        >
          <div
            css={css`
              display: flex;
              flex-flow: row;
              justify-content: center;
              gap: 10px;
              flex-wrap: wrap;
            `}
          >
            <SlimMetricsCard
              title="Volume (All Time)"
              value={format(
                fusionResolversMetrics?.allResolvers.volumeAllTime,
                {
                  symbol: 'USD',
                  abbreviate: true,
                }
              )}
            />
            <SlimMetricsCard
              title="Transactions (All Time)"
              value={format(
                fusionResolversMetrics?.allResolvers.transactionsCountAllTime,
                {
                  abbreviate: true,
                }
              )}
            />
            <SlimMetricsCard
              title="Users (All Time)"
              value={format(
                fusionResolversMetrics?.allResolvers.walletsCountAllTime,
                {
                  abbreviate: true,
                }
              )}
            />
          </div>
          <div
            css={css`
              display: flex;
              flex-flow: row;
              justify-content: center;
              gap: 10px;
              flex-wrap: wrap;
            `}
          >
            <SlimMetricsCard
              title="Volume (7D)"
              value={format(
                fusionResolversMetrics?.allResolvers.walletsCountLastWeek,
                {
                  symbol: 'USD',
                  abbreviate: true,
                }
              )}
              subValue={
                <TrendLabelPercent
                  value={
                    fusionResolversMetrics?.allResolvers
                      .walletsCountLastWeekTrend
                  }
                />
              }
            />
            <SlimMetricsCard
              title="Transactions (7D)"
              value={format(
                fusionResolversMetrics?.allResolvers.transactionsCountLastWeek,
                {
                  symbol: 'USD',
                  abbreviate: true,
                }
              )}
              subValue={
                <TrendLabelPercent
                  value={
                    fusionResolversMetrics?.allResolvers
                      .transactionsCountLastWeekTrend
                  }
                />
              }
            />
            <SlimMetricsCard
              title="Users (7D)"
              value={format(
                fusionResolversMetrics?.allResolvers.walletsCountLastWeek,
                {
                  abbreviate: true,
                }
              )}
              subValue={
                <TrendLabelPercent
                  value={
                    fusionResolversMetrics?.allResolvers
                      .walletsCountLastWeekTrend
                  }
                />
              }
            />
          </div>
        </div>
        <FusionResolversTable
          fusionResolvers={fusionResolvers}
          fusionResolversMetrics={fusionResolversMetrics}
          getFusionResolverMetrics={getFusionResolverMetrics}
        />
      </div>
    </Container>
  );
}

FusionPage.getLayout = function getLayout(page: any) {
  return <Dashboard>{page}</Dashboard>;
};
