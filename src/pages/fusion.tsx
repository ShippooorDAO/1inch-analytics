import { css } from '@emotion/react';
import {
  ArrowBack,
  ArrowForward,
  KeyboardArrowRight,
  Sort,
} from '@mui/icons-material';
import {
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  NoSsr,
  Typography,
} from '@mui/material';
import moment from 'moment';
import { lighten } from 'polished';
import { useEffect, useMemo, useState } from 'react';
import TimeAgo from 'react-timeago';

import { AddressCopyButton } from '@/components/AddressCopyButton';
import { AutoSkeleton } from '@/components/AutoSkeleton';
import { BarChart } from '@/components/chart/BarChart';
import { HistogramChart } from '@/components/chart/HistogramChart';
import { TimeWindowToggleButtonGroup } from '@/components/chart/TimeWindowToggleButtonGroup';
import { EtherscanButton } from '@/components/EtherscanButton';
import { AssetMultiSelect } from '@/components/filters/AssetMultiSelect';
import { AddressIcon } from '@/components/icons/AddressIcon';
import { AssetIcon } from '@/components/icons/AssetIcon';
import { SlimMetricsCard, TrendLabelPercent } from '@/components/MetricsCard';
import { PageTitle } from '@/components/PageTitle';
import { MultiTabSection } from '@/components/SectionContainer';
import { StatsContainer } from '@/components/StatsContainer';
import { useFusionResolvers } from '@/hooks/useFusionResolvers';
import {
  FusionResolverMetrics,
  FusionResolversMetrics,
  useFusionResolversMetrics,
} from '@/hooks/useFusionResolversMetrics';
import { useFusionTopTraders } from '@/hooks/useFusionTopTraders';
import { useFusionTrades } from '@/hooks/useFusionTrades';
import Dashboard from '@/layouts/DashboardLayout';
import { Asset } from '@/shared/Model/Asset';
import { ChainId } from '@/shared/Model/Chain';
import {
  FusionResolver,
  getDuneResolverNameFromResolverAddress,
} from '@/shared/Model/FusionResolver';
import {
  TimeInterval,
  Timeseries,
  TimeWindow,
} from '@/shared/Model/Timeseries';
import { useOneInchAnalyticsAPIContext } from '@/shared/OneInchAnalyticsAPI/OneInchAnalyticsAPIProvider';
import {
  getEtherscanAddressLink,
  getEtherscanTransactionLink,
} from '@/shared/Utils/Etherscan';
import { format, getAddressShorthand } from '@/shared/Utils/Format';

interface ControlledBarChartProps {
  seriesName: string;
  tooltipFormatter: (y?: number | null) => string;
  labelFormatter: (y?: number | null) => string;
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
      <BarChart
        seriesName={seriesName}
        data={data}
        tooltipFormatter={tooltipFormatter}
        labelFormatter={labelFormatter}
      />
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
}: FusionResolversTableProps) {
  const [sortBy, setSortBy] = useState<'volume' | 'transactions' | 'wallets'>(
    'volume'
  );
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(7);
  const [timeWindow, setTimeWindow] = useState(TimeWindow.SEVEN_DAYS);
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

  const rows = useMemo(() => {
    if (!fusionResolvers) {
      return undefined;
    }

    return fusionResolvers
      .map((resolver) => {
        const metrics = getFusionResolverMetrics(resolver);

        if (!metrics) {
          return undefined;
        }

        const timeWindowMetrics = (() => {
          switch (timeWindow) {
            case TimeWindow.SEVEN_DAYS:
              return {
                transactionsCount: metrics.transactionsCountLastWeek,
                walletsCount: metrics.walletsCountLastWeek,
                volume: metrics.volumeLastWeek,

                transactionsCountTrend: metrics.transactionsCountLastWeekTrend,
                walletsCountTrend: metrics.walletsCountLastWeekTrend,
                volumeTrend: metrics.volumeLastWeekTrend,

                transactionsCountPercent:
                  metrics.transactionsCountLastWeekPercent,
                walletsCountPercent: metrics.walletsCountLastWeekPercent,
                volumePercent: metrics.volumeLastWeekPercent,
              };
            case TimeWindow.MAX:
            default:
              return {
                transactionsCount: metrics.transactionsCountAllTime,
                walletsCount: metrics.walletsCountAllTime,
                volume: metrics.volumeAllTime,

                transactionsCountPercent:
                  metrics.transactionsCountAllTimePercent,
                walletsCountPercent: metrics.walletsCountAllTimePercent,
                volumePercent: metrics.volumeAllTimePercent,
              };
          }
        })();

        return {
          resolver,
          metrics: timeWindowMetrics,
        };
      })
      .filter((r) => r !== undefined)
      .map((r) => r!);
  }, [fusionResolvers, getFusionResolverMetrics, timeWindow]);

  const sortedRows = useMemo(() => {
    if (!rows) {
      return undefined;
    }

    return rows?.sort((a, b) => {
      if (!a || !b) {
        return 0;
      }

      switch (sortBy) {
        case 'transactions':
          return b.metrics.transactionsCount - a.metrics.transactionsCount;
        case 'wallets':
          return b.metrics.walletsCount - a.metrics.walletsCount;
        case 'volume':
        default:
          return b.metrics.volume - a.metrics.volume;
      }
    });
  }, [sortBy, rows]);

  const displayedRows = sortedRows?.slice(
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
          <Typography variant="h4">Fusion Resolvers</Typography>
          <TimeWindowToggleButtonGroup
            value={timeWindow}
            onChange={(e, value) => setTimeWindow(value)}
            options={[
              { value: TimeWindow.SEVEN_DAYS, label: 'Last Week' },
              { value: TimeWindow.MAX, label: 'All Time' },
            ]}
          />
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
              onClick={() => {
                setSortBy('volume');
                handleSortMenuClose();
              }}
            >
              Volume
            </MenuItem>
            <MenuItem
              selected={sortBy === 'transactions'}
              onClick={() => {
                setSortBy('transactions');
                handleSortMenuClose();
              }}
            >
              Transactions
            </MenuItem>
            <MenuItem
              selected={sortBy === 'wallets'}
              onClick={() => {
                setSortBy('wallets');
                handleSortMenuClose();
              }}
            >
              Wallets
            </MenuItem>
          </Menu>
        </div>
        {displayedRows?.map((row) => (
          <div
            key={row?.resolver.id}
            css={(theme) => css`
              display: flex;
              flex-flow: row;
              gap: 10px;
              align-items: center;
              justify-content: space-between;
              padding: 10px 20px;
              border-radius: 24px;
              height: 85px;
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
                width: 250px;
              `}
            >
              <img
                src={row?.resolver.imageUrl}
                alt={row?.resolver.name}
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
                    href={`https://app.1inch.io/#/1/earn/delegate/${row.resolver.address}`}
                  >
                    <Typography variant="body2">
                      {row?.resolver.name}
                    </Typography>
                  </a>
                  <EtherscanButton
                    size="small"
                    address={row?.resolver.address}
                  />
                  <AddressCopyButton
                    size="small"
                    address={row?.resolver.address}
                  />
                </div>
                <Typography variant="body1" color="textSecondary">
                  {getAddressShorthand(row?.resolver.address)}
                </Typography>
              </div>
            </div>
            <div
              css={css`
                display: flex;
                flex-flow: row;
                align-items: center;
                gap: 10px;
                width: 150px;
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
                  {format(row?.metrics.volume, {
                    symbol: 'USD',
                    decimals: 1,
                    abbreviate: true,
                  })}{' '}
                  volume
                </Typography>
                {row?.metrics.volumeTrend && (
                  <TrendLabelPercent
                    value={row?.metrics.volumeTrend}
                    iconAlign="left"
                  />
                )}
                <Typography variant="body1" color="textSecondary">
                  {format(row?.metrics.transactionsCountPercent, {
                    symbol: '%',
                  })}{' '}
                  of total
                </Typography>
              </div>
            </div>
            <div
              css={css`
                display: flex;
                flex-flow: column;
                justify-content: flex-end;
                align-items: flex-end;
                padding-left: 20px;
                width: 150px;
              `}
            >
              <Typography variant="body2">
                {format(row?.metrics.transactionsCount, {
                  decimals: 1,
                  abbreviate: true,
                })}{' '}
                transactions
              </Typography>
              {row?.metrics.transactionsCountTrend && (
                <TrendLabelPercent
                  value={row?.metrics.transactionsCountTrend}
                  iconAlign="left"
                />
              )}
              <Typography variant="body1" color="textSecondary">
                {format(row?.metrics.transactionsCountPercent, { symbol: '%' })}{' '}
                of total
              </Typography>
            </div>
            <div
              css={css`
                display: flex;
                flex-flow: column;
                width: 150px;
                justify-content: flex-end;
                align-items: flex-end;
                padding-left: 20px;
              `}
            >
              <Typography variant="body2">
                {format(row?.metrics.walletsCount, {
                  decimals: 1,
                  abbreviate: true,
                })}{' '}
                wallets
              </Typography>
              {row?.metrics.walletsCountTrend && (
                <TrendLabelPercent
                  value={row?.metrics.walletsCountTrend}
                  iconAlign="left"
                />
              )}
              <Typography variant="body1" color="textSecondary">
                {format(row?.metrics.walletsCountPercent, { symbol: '%' })} of
                total
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

function FusionTradersTable() {
  const [sortBy, setSortBy] = useState<'volumeUsd' | 'transactionCount'>(
    'volumeUsd'
  );
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(7);
  const { fusionTopTraders } = useFusionTopTraders({
    pageSize: pageSize * 100,
    pageNumber: 1,
    sortBy,
  });
  const rows = fusionTopTraders ?? undefined;

  useEffect(() => {
    setPageNumber(0);
  }, [sortBy]);

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
          <Typography variant="h4">Fusion Traders</Typography>
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
              selected={sortBy === 'volumeUsd'}
              onClick={() => {
                setSortBy('volumeUsd');
                handleSortMenuClose();
              }}
            >
              Volume
            </MenuItem>
            <MenuItem
              selected={sortBy === 'transactionCount'}
              onClick={() => {
                setSortBy('transactionCount');
                handleSortMenuClose();
              }}
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
              height: 86px;
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

function FusionTradesTable() {
  const { assetService } = useOneInchAnalyticsAPIContext();
  const [selectedAssets, setSelectedAssets] = useState<Asset[]>([]);
  const [sortBy, setSortBy] = useState<'timestamp' | 'destinationUsdAmount'>(
    'destinationUsdAmount'
  );
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(7);
  const {
    fusionTrades,
    mock: mockFusionTrades,
    loading,
  } = useFusionTrades({
    pageSize: pageSize * 100,
    pageNumber: 1,
    sortBy,
    assetIds: selectedAssets.map((asset) => asset.id),
  });
  const rows = !loading && fusionTrades ? fusionTrades : mockFusionTrades;

  const assetOptions = useMemo(() => {
    if (!assetService) {
      return undefined;
    }

    return assetService.store
      .getAll()
      .filter((asset) => asset.chain.chainId === ChainId.ETHEREUM);
  }, [assetService]);

  useEffect(() => {
    setPageNumber(0);
  }, [sortBy]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const sortMenuOpen = Boolean(anchorEl);

  const handleSortMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleSortMenuClose = () => {
    setAnchorEl(null);
  };

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

  const resetFilters = () => {
    setSelectedAssets([]);
    setSortBy('timestamp');
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
          height: 100%;
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
          <Typography variant="h4">Top Fusion Trades</Typography>
          <AutoSkeleton loading={!assetOptions}>
            <AssetMultiSelect
              placeholder="Filter by assets"
              assets={assetOptions ?? []}
              values={selectedAssets}
              onChange={setSelectedAssets}
            />
          </AutoSkeleton>
          <div
            css={css`
              display: flex;
              flex-flow: row;
              justify-content: space-between;
            `}
          >
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
          </div>
          <Menu
            anchorEl={anchorEl}
            open={sortMenuOpen}
            onClose={handleSortMenuClose}
          >
            <MenuItem
              selected={sortBy === 'timestamp'}
              onClick={() => {
                setSortBy('timestamp');
                handleSortMenuClose();
              }}
            >
              Date
            </MenuItem>
            <MenuItem
              selected={sortBy === 'destinationUsdAmount'}
              onClick={() => {
                setSortBy('destinationUsdAmount');
                handleSortMenuClose();
              }}
            >
              Transaction Amount
            </MenuItem>
          </Menu>
        </div>
        {displayedRows?.length === 0 && (
          <div
            css={css`
              display: flex;
              flex-flow: column;
              justify-content: center;
              align-items: center;
              gap: 10px;
              height: 100%;
            `}
          >
            <Typography variant="h3">No trades found</Typography>
            <Button variant="outlined" onClick={() => resetFilters()}>
              Reset Filters
            </Button>
          </div>
        )}
        {displayedRows?.map((row) => (
          <div
            key={row.id}
            css={(theme) => css`
              display: flex;
              flex-flow: row;
              height: 86px;
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
                align-items: center;
                flex-grow: 1;
              `}
            >
              <div>
                <AutoSkeleton loading={loading}>
                  <div
                    css={css`
                      display: flex;
                      flex-flow: row;
                      align-items: center;
                      gap: 10px;
                    `}
                  >
                    <a
                      href={getEtherscanTransactionLink(
                        row.transactionHash,
                        row.chain.chainId
                      )}
                    >
                      <Typography variant="body2">
                        {moment.unix(row.timestamp).format('MMM D, YYYY')}
                      </Typography>
                    </a>
                    <AddressCopyButton
                      size="small"
                      address={row.transactionHash}
                      contentType="transaction"
                    />
                  </div>
                </AutoSkeleton>
                <AutoSkeleton loading={loading}>
                  <Typography variant="body1" color="textSecondary">
                    <NoSsr>
                      <TimeAgo date={row.timestamp * 1000} />
                    </NoSsr>
                  </Typography>
                </AutoSkeleton>
              </div>
            </div>
            <div
              css={(theme) => css`
                display: flex;
                flex-flow: row;
                width: 250px;
                gap: 10px;
                ${theme.breakpoints.down('md')} {
                  display: none;
                }
              `}
            >
              <AutoSkeleton loading={loading}>
                <AddressIcon address={row.executorAddress} />
              </AutoSkeleton>
              <div>
                <AutoSkeleton loading={loading}>
                  <div
                    css={css`
                      display: flex;
                      flex-flow: row;
                      align-items: center;
                      gap: 10px;
                    `}
                  >
                    <a
                      href={getEtherscanAddressLink(
                        row.executorAddress,
                        row.chain.chainId
                      )}
                    >
                      <Typography variant="body2">
                        {getAddressShorthand(row.executorAddress)}
                      </Typography>
                    </a>
                    <AddressCopyButton
                      size="small"
                      address={row.executorAddress}
                    />
                  </div>
                </AutoSkeleton>
                <AutoSkeleton loading={loading}>
                  <Typography variant="body1" color="textSecondary">
                    Sender
                  </Typography>
                </AutoSkeleton>
              </div>
            </div>
            <div
              css={(theme) => css`
                display: flex;
                flex-flow: row;
                width: 250px;
                gap: 10px;
                ${theme.breakpoints.down('lg')} {
                  display: none;
                }
              `}
            >
              <AutoSkeleton loading={loading}>
                <AddressIcon address={row.receiverAddress} />
              </AutoSkeleton>
              <div>
                <AutoSkeleton loading={loading}>
                  <div
                    css={css`
                      display: flex;
                      flex-flow: row;
                      align-items: center;
                      gap: 10px;
                    `}
                  >
                    <a
                      href={getEtherscanAddressLink(
                        row.receiverAddress,
                        row.chain.chainId
                      )}
                    >
                      <Typography variant="body2">
                        {getAddressShorthand(row.receiverAddress)}
                      </Typography>
                    </a>
                    <AddressCopyButton
                      size="small"
                      address={row.receiverAddress}
                    />
                  </div>
                </AutoSkeleton>
                <AutoSkeleton loading={loading}>
                  <Typography variant="body1" color="textSecondary">
                    Receiver
                  </Typography>
                </AutoSkeleton>
              </div>
            </div>
            <div
              css={css`
                display: flex;
                flex-flow: row;
                justify-content: flex-start;
                align-items: center;
                width: 200px;
                gap: 10px;
              `}
            >
              <div
                css={css`
                  display: flex;
                  flex-flow: row;
                  align-items: center;
                  justify-content: center;
                  gap: 10px;
                `}
              >
                <AutoSkeleton loading={loading}>
                  <AssetIcon asset={row.sourceAsset} />
                </AutoSkeleton>
                <div
                  css={css`
                    display: flex;
                    flex-flow: column;
                    align-items: flex-start;
                  `}
                >
                  <AutoSkeleton loading={loading}>
                    <Typography variant="body2">
                      {row.sourceAsset.symbol}
                    </Typography>
                  </AutoSkeleton>
                  <AutoSkeleton loading={loading}>
                    <Typography variant="body1" color="textSecondary">
                      {format(row.sourceUsdAmount, {
                        symbol: 'USD',
                        abbreviate: true,
                      })}
                    </Typography>
                  </AutoSkeleton>
                </div>
              </div>
              <AutoSkeleton loading={loading}>
                <KeyboardArrowRight />
              </AutoSkeleton>
              <div
                css={css`
                  display: flex;
                  flex-flow: row;
                  align-items: center;
                  justify-content: center;
                  gap: 10px;
                `}
              >
                <AutoSkeleton loading={loading}>
                  <AssetIcon asset={row.destinationAsset} />
                </AutoSkeleton>
                <div
                  css={css`
                    display: flex;
                    flex-flow: column;
                    align-items: flex-start;
                  `}
                >
                  <AutoSkeleton loading={loading}>
                    <Typography variant="body2">
                      {row.destinationAsset.symbol}
                    </Typography>
                  </AutoSkeleton>
                  <AutoSkeleton loading={loading}>
                    <Typography variant="body1" color="textSecondary">
                      {format(row.destinationUsdAmount, {
                        symbol: 'USD',
                        abbreviate: true,
                      })}
                    </Typography>
                  </AutoSkeleton>
                </div>
              </div>
            </div>
            <div
              css={css`
                display: flex;
                flex-flow: column;
                justify-content: space-between;
                width: 200px;
                align-items: flex-end;
              `}
            >
              <AutoSkeleton loading={loading}>
                <Typography variant="body2">
                  {format(row.destinationUsdAmount, { symbol: 'USD' })}
                </Typography>
              </AutoSkeleton>
              <AutoSkeleton loading={loading}>
                <Typography variant="body1" color="textSecondary">
                  {format(row.slippage, { symbol: '%' })} slippage
                </Typography>
              </AutoSkeleton>
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
  const { getFusionResolverMetrics, fusionResolvers, fusionResolversMetrics } =
    useFusionPageData();

  const [volumeTimeseriesList, setVolumeTimeseriesList] =
    useState<Timeseries[]>();
  const [volumeTimeseriesOptions, setVolumeTimeseriesOptions] =
    useState<Timeseries[]>();

  const [usersTimeseriesList, setUsersTimeseriesList] =
    useState<Timeseries[]>();
  const [usersTimeseriesOptions, setUsersTimeseriesOptions] =
    useState<Timeseries[]>();

  const [transactionsTimeseriesList, setTransactionsTimeseriesList] =
    useState<Timeseries[]>();
  const [transactionsTimeseriesOptions, setTransactionsTimeseriesOptions] =
    useState<Timeseries[]>();

  useEffect(() => {
    if (!fusionResolversMetrics) {
      return;
    }

    const volumeTimeseriesList_ = Array.from(
      fusionResolversMetrics.byResolver.values()
    ).map((v) => v.volumeWeeklyTimeseries);
    const transactionsTimeseriesList_ = Array.from(
      fusionResolversMetrics.byResolver.values()
    ).map((v) => v.transactionsCountWeeklyTimeseries);
    const usersTimeseriesList_ = Array.from(
      fusionResolversMetrics.byResolver.values()
    ).map((v) => v.walletsCountWeeklyTimeseries);

    setVolumeTimeseriesList(volumeTimeseriesList_);
    setTransactionsTimeseriesList(transactionsTimeseriesList_);
    setUsersTimeseriesList(usersTimeseriesList_);

    setVolumeTimeseriesOptions(volumeTimeseriesList_);
    setTransactionsTimeseriesOptions(transactionsTimeseriesList_);
    setUsersTimeseriesOptions(usersTimeseriesList_);
  }, [fusionResolversMetrics]);

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
        <MultiTabSection
          title={
            <PageTitle
              icon={
                <img
                  height="32px"
                  width="32px"
                  src="/vendors/1inch/fusion.webp"
                  alt="fusion"
                />
              }
            >
              Fusion Mode
            </PageTitle>
          }
          tabs={[
            {
              label: 'Volume',
              key: 'volume',
              content: (
                <StatsContainer
                  containers={[
                    {
                      title: 'Historical volume per resolver',
                      content: volumeTimeseriesList &&
                        volumeTimeseriesOptions && (
                          <HistogramChart
                            timeseriesList={volumeTimeseriesList}
                            timeseriesOptions={volumeTimeseriesOptions}
                            onTimeseriesChange={setVolumeTimeseriesList}
                            timeWindow={TimeWindow.MAX}
                            timeInterval={TimeInterval.WEEKLY}
                          />
                        ),
                    },
                    {
                      title: 'Current volume per resolver',
                      content: (
                        <ControlledBarChart
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
                          tooltipFormatter={(y) => format(y, { symbol: 'USD' })}
                          labelFormatter={(y) =>
                            format(y, { symbol: 'USD', abbreviate: true })
                          }
                        />
                      ),
                    },
                  ]}
                />
              ),
            },
            {
              label: 'Transactions',
              key: 'transactions',
              content: (
                <StatsContainer
                  containers={[
                    {
                      title: 'Historical transaction count per resolver',
                      content: transactionsTimeseriesList &&
                        transactionsTimeseriesOptions && (
                          <HistogramChart
                            timeseriesList={transactionsTimeseriesList}
                            timeseriesOptions={transactionsTimeseriesOptions}
                            onTimeseriesChange={setTransactionsTimeseriesList}
                            timeWindow={TimeWindow.MAX}
                            timeInterval={TimeInterval.WEEKLY}
                          />
                        ),
                    },
                    {
                      title: 'Total transaction count per resolver',
                      content: (
                        <ControlledBarChart
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
                          tooltipFormatter={(y) => format(y)}
                          labelFormatter={(y) =>
                            format(y, { abbreviate: true })
                          }
                        />
                      ),
                    },
                  ]}
                />
              ),
            },
            {
              label: 'Users',
              key: 'users',
              content: (
                <StatsContainer
                  containers={[
                    {
                      title: 'Historical users per resolver',
                      content: usersTimeseriesList &&
                        usersTimeseriesOptions && (
                          <HistogramChart
                            timeseriesList={usersTimeseriesList}
                            timeseriesOptions={usersTimeseriesOptions}
                            onTimeseriesChange={setUsersTimeseriesList}
                            timeWindow={TimeWindow.MAX}
                            timeInterval={TimeInterval.WEEKLY}
                          />
                        ),
                    },
                    {
                      title: 'Total users per resolver',
                      content: (
                        <ControlledBarChart
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
                          tooltipFormatter={(y) => format(y)}
                          labelFormatter={(y) =>
                            format(y, { abbreviate: true })
                          }
                        />
                      ),
                    },
                  ]}
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
            <FusionTradersTable />
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
            <FusionTradesTable />
          </div>
        </div>
      </div>
    </Container>
  );
}

FusionPage.getLayout = function getLayout(page: any) {
  return <Dashboard>{page}</Dashboard>;
};
