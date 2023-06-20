import { css } from '@emotion/react';
import { ArrowBack, ArrowForward, Sort } from '@mui/icons-material';
import {
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import { lighten } from 'polished';
import { useMemo, useState } from 'react';

import { AddressCopyButton } from '@/components/AddressCopyButton';
import { DonutChart } from '@/components/chart/DonutChart';
import { HistogramChart } from '@/components/chart/HistogramChart';
import { TimeWindowToggleButtonGroup } from '@/components/chart/TimeWindowToggleButtonGroup';
import { EtherscanButton } from '@/components/EtherscanButton';
import { AddressIcon } from '@/components/icons/AddressIcon';
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
import { useFusionTopTraders } from '@/hooks/useFusionTopTraders';
import Dashboard from '@/layouts/DashboardLayout';
import {
  FusionResolver,
  getDuneResolverNameFromResolverAddress,
} from '@/shared/Model/FusionResolver';
import { FusionTrader } from '@/shared/Model/FusionTrader';
import { TimeInterval, TimeWindow } from '@/shared/Model/Timeseries';
import { format, getAddressShorthand } from '@/shared/Utils/Format';

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
  const { fusionTopTraders } = useFusionTopTraders({
    pageSize: 1000,
  });
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
    fusionTraders: fusionTopTraders,
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
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(8);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const sortMenuOpen = Boolean(anchorEl);
  const handleSortMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleSortMenuClose = () => {
    setAnchorEl(null);
  };

  const loading = fusionResolvers === undefined;
  const isLastPage =
    pageSize * (pageNumber + 1) >= (fusionResolvers?.length ?? 0);
  const isFirstPage = pageNumber === 0;

  const nextPage = () => {
    if (
      fusionResolvers?.length &&
      fusionResolvers.length < pageSize * pageNumber
    )
      return;
    setPageNumber(pageNumber + 1);
  };

  const previousPage = () => {
    if (pageNumber === 0) return;
    setPageNumber(pageNumber - 1);
  };

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

  const displayedFusionResolvers = sortedFusionResolvers?.slice(
    pageNumber * pageSize,
    pageNumber * pageSize + pageSize
  );

  return (
    <div
      css={css`
        display: flex;
        flex-flow: column;
        justify-content: space-between;
        height: 100%;
      `}
    >
      <div
        css={css`
          display: flex;
          flex-flow: column;
          justify-content: flex-start;
          gap: 10px;
          padding-left: 10px;
          padding-right: 10px;
        `}
      >
        <div
          css={css`
            display: flex;
            flex-flow: row;
            justify-content: space-between;
            align-items: center;
            white-space: nowrap;
            padding: 10px 10px 0 10px;
            width: 100%;
          `}
        >
          <Typography variant="h3">Top Fusion Resolvers</Typography>
          <Button
            onClick={handleSortMenuClick}
            endIcon={<Sort />}
            css={(theme) =>
              css`
                color: ${theme.palette.text.secondary};
              `
            }
          >
            Sort by
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={sortMenuOpen}
            onClose={handleSortMenuClose}
          >
            <MenuItem
              selected={sortBy === 'volume'}
              onClick={() => setSortBy('volume')}
            >
              Volume
            </MenuItem>
            <MenuItem
              selected={sortBy === 'transactions'}
              onClick={() => setSortBy('transactions')}
            >
              Transactions
            </MenuItem>
            <MenuItem
              selected={sortBy === 'wallets'}
              onClick={() => setSortBy('wallets')}
            >
              Wallets
            </MenuItem>
          </Menu>
        </div>
        {displayedFusionResolvers?.map((fusionResolver) => (
          <div
            key={fusionResolver.id}
            css={(theme) => css`
              display: flex;
              flex-flow: row;
              gap: 10px;
              align-items: center;
              padding: 10px 20px;
              border-radius: 24px;
              background-color: ${lighten(
                0.05,
                theme.palette.background.paper
              )};
              white-space: nowrap;
            `}
          >
            <div
              css={css`
                display: flex;
                flex-flow: row;
                gap: 10px;
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
                    width: 200px;
                  `}
                >
                  <a
                    href={`https://app.1inch.io/#/1/earn/delegate/${fusionResolver.address}`}
                  >
                    <Typography variant="body2">
                      {fusionResolver.name}
                    </Typography>
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
                <Typography variant="body1" color="textSecondary">
                  {getAddressShorthand(fusionResolver.address)}
                </Typography>
              </div>
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
                <Typography variant="body2">
                  {format(
                    getFusionResolverMetrics(fusionResolver)?.volumeLastWeek,
                    { symbol: 'USD', decimals: 1, abbreviate: true }
                  )}{' '}
                  volume
                </Typography>
                <TrendLabelPercent
                  value={
                    getFusionResolverMetrics(fusionResolver)
                      ?.volumeLastWeekTrend
                  }
                  iconAlign="left"
                />
                <Typography variant="body1" color="textSecondary">
                  {format(
                    (getFusionResolverMetrics(fusionResolver)?.volumeLastWeek ??
                      0) /
                      (fusionResolversMetrics?.allResolvers.volumeLastWeek ??
                        1),
                    { symbol: '%' }
                  )}{' '}
                  of total
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
              <Typography variant="body2">
                {format(
                  getFusionResolverMetrics(fusionResolver)
                    ?.transactionsCountLastWeek,
                  { decimals: 1, abbreviate: true }
                )}{' '}
                transactions
              </Typography>
              <TrendLabelPercent
                value={
                  getFusionResolverMetrics(fusionResolver)?.volumeLastWeekTrend
                }
                iconAlign="left"
              />
              <Typography variant="body1" color="textSecondary">
                {format(
                  (getFusionResolverMetrics(fusionResolver)
                    ?.transactionsCountLastWeek ?? 0) /
                    (fusionResolversMetrics?.allResolvers
                      .transactionsCountLastWeek ?? 1),
                  { symbol: '%' }
                )}{' '}
                of total
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
              <Typography variant="body2">
                {format(
                  getFusionResolverMetrics(fusionResolver)
                    ?.walletsCountLastWeek,
                  { decimals: 1, abbreviate: true }
                )}{' '}
                wallets
              </Typography>
              <TrendLabelPercent
                value={
                  getFusionResolverMetrics(fusionResolver)
                    ?.walletsCountLastWeekTrend
                }
                iconAlign="left"
              />
              <Typography variant="body1" color="textSecondary">
                {format(
                  (getFusionResolverMetrics(fusionResolver)
                    ?.walletsCountLastWeek ?? 0) /
                    (fusionResolversMetrics?.allResolvers
                      .walletsCountLastWeek ?? 1),
                  { symbol: '%' }
                )}{' '}
                of total
              </Typography>
            </div>
          </div>
        ))}
      </div>
      <div
        css={css`
          display: flex;
          flex-flow: row;
          justify-content: center;
          align-items: center;
          gap: 10px;
        `}
      >
        <IconButton onClick={previousPage} disabled={loading || isFirstPage}>
          <ArrowBack />
        </IconButton>
        <Typography variant="body1" fontWeight={500}>
          {pageNumber + 1} /{' '}
          {Math.ceil((fusionResolvers?.length ?? 0) / pageSize)}
        </Typography>

        <IconButton onClick={nextPage} disabled={loading || isLastPage}>
          <ArrowForward />
        </IconButton>
      </div>
    </div>
  );
}

interface FusionTradersTableProps {
  fusionTraders: FusionTrader[] | null;
}

function FusionTradersTable({ fusionTraders }: FusionTradersTableProps) {
  const rows = fusionTraders ?? undefined;

  const [sortBy, setSortBy] = useState<'volume' | 'transactions'>('volume');
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(8);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const sortMenuOpen = Boolean(anchorEl);
  const handleSortMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleSortMenuClose = () => {
    setAnchorEl(null);
  };

  const loading = rows === undefined;
  const isLastPage = pageSize * (pageNumber + 1) >= (rows?.length ?? 0);
  const isFirstPage = pageNumber === 0;

  const displayedRows = rows?.slice(
    pageNumber * pageSize,
    pageNumber * pageSize + pageSize
  );

  const nextPage = () => {
    if (rows?.length && rows.length < pageSize * pageNumber) return;
    setPageNumber(pageNumber + 1);
  };

  const previousPage = () => {
    if (pageNumber === 0) return;
    setPageNumber(pageNumber - 1);
  };

  return (
    <div
      css={css`
        display: flex;
        flex-flow: column;
        justify-content: space-between;
        height: 100%;
      `}
    >
      <div
        css={css`
          display: flex;
          flex-flow: column;
          gap: 10px;
          white-space: nowrap;
          padding-left: 10px;
          padding-right: 10px;
        `}
      >
        <div
          css={css`
            display: flex;
            flex-flow: row;
            justify-content: space-between;
            align-items: center;
            white-space: nowrap;
            padding: 10px 10px 0 10px;
            width: 100%;
          `}
        >
          <Typography variant="h3">Top Fusion Traders</Typography>
          <Button
            onClick={handleSortMenuClick}
            endIcon={<Sort />}
            css={(theme) =>
              css`
                color: ${theme.palette.text.secondary};
              `
            }
          >
            Sort by
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={sortMenuOpen}
            onClose={handleSortMenuClose}
          >
            <MenuItem
              selected={sortBy === 'volume'}
              onClick={() => setSortBy('volume')}
            >
              Volume
            </MenuItem>
            <MenuItem
              selected={sortBy === 'transactions'}
              onClick={() => setSortBy('transactions')}
            >
              Transactions
            </MenuItem>
          </Menu>
        </div>
        {displayedRows?.map((fusionTrader) => (
          <div
            key={fusionTrader.id}
            css={(theme) => css`
              display: flex;
              flex-flow: row;
              height: 82px;
              gap: 10px;
              align-items: center;
              justify-content: space-between;
              padding: 10px 20px;
              border-radius: 24px;
              background-color: ${lighten(
                0.05,
                theme.palette.background.paper
              )};
            `}
          >
            <div
              css={css`
                display: flex;
                flex-flow: row;
                gap: 10px;
              `}
            >
              <AddressIcon address={fusionTrader.address} />
              <div>
                <div
                  css={css`
                    display: flex;
                    flex-flow: row;
                    align-items: center;
                    gap: 10px;
                  `}
                >
                  <a
                    href={`https://etherscan.io/address/${fusionTrader.address}`}
                  >
                    <Typography variant="body2">
                      {getAddressShorthand(fusionTrader.address)}
                    </Typography>
                  </a>
                  <EtherscanButton
                    size="small"
                    address={fusionTrader.address}
                  />
                  <AddressCopyButton
                    size="small"
                    address={fusionTrader.address}
                  />
                </div>
                <Typography variant="body1" color="textSecondary">
                  {getAddressShorthand(fusionTrader.address)}
                </Typography>
              </div>
            </div>
            <div
              css={css`
                display: flex;
                flex-flow: column;
                justify-content: space-between;
                gap: 5px;
                align-items: flex-end;
              `}
            >
              <div
                css={css`
                  display: flex;
                  flex-flow: row;
                  flex-grow: 1;
                  justify-content: flex-end;
                  align-items: flex-end;
                `}
              >
                <Typography variant="body2">
                  {format(fusionTrader.volumeUsd, {
                    symbol: 'USD',
                    abbreviate: true,
                  })}{' '}
                  volume
                </Typography>
              </div>
              <div
                css={css`
                  display: flex;
                  flex-flow: row;
                  flex-grow: 1;
                  justify-content: flex-end;
                  align-items: flex-end;
                `}
              >
                <Typography variant="body1" color="textSecondary">
                  {format(fusionTrader.transactionCount, {
                    decimals: 0,
                  })}{' '}
                  transactions
                </Typography>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div
        css={css`
          display: flex;
          flex-flow: row;
          justify-content: center;
          align-items: center;
          gap: 10px;
        `}
      >
        <IconButton onClick={previousPage} disabled={loading || isFirstPage}>
          <ArrowBack />
        </IconButton>
        <Typography variant="body1" fontWeight={500}>
          {pageNumber + 1} / {Math.ceil((rows?.length ?? 0) / pageSize)}
        </Typography>

        <IconButton onClick={nextPage} disabled={loading || isLastPage}>
          <ArrowForward />
        </IconButton>
      </div>
    </div>
  );
}

export default function FusionPage() {
  const {
    getFusionResolverMetrics,
    fusionResolvers,
    fusionResolversMetrics,
    fusionTraders,
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
          gap: 10px;
          padding-bottom: 20px;
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
            value={format(fusionResolversMetrics?.allResolvers.volumeAllTime, {
              symbol: 'USD',
              abbreviate: true,
            })}
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
                  fusionResolversMetrics?.allResolvers.walletsCountLastWeekTrend
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
                  fusionResolversMetrics?.allResolvers.walletsCountLastWeekTrend
                }
              />
            }
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
            flex-flow: row;
            flex-wrap: wrap;
            gap: 20px;
          `}
        >
          <div
            css={(theme) => css`
              width: calc(65% - 10px);
              background-color: ${theme.palette.background.paper};
              border-radius: 24px;
              width: 400px;
              ${theme.breakpoints.down('md')} {
                width: 100%;
              }
            `}
          >
            <FusionTradersTable fusionTraders={fusionTraders} />
          </div>
          <div
            css={(theme) => css`
              width: 35%;
              background-color: ${theme.palette.background.paper};
              border-radius: 24px;
              width: calc(100% - 420px);
              ${theme.breakpoints.down('md')} {
                width: 100%;
              }
            `}
          >
            <FusionResolversTable
              fusionResolvers={fusionResolvers}
              fusionResolversMetrics={fusionResolversMetrics}
              getFusionResolverMetrics={getFusionResolverMetrics}
            />
          </div>
        </div>
      </div>
    </Container>
  );
}

FusionPage.getLayout = function getLayout(page: any) {
  return <Dashboard>{page}</Dashboard>;
};
