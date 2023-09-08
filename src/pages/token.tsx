import { css, useTheme } from '@emotion/react';
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
import { useEffect, useMemo, useRef, useState } from 'react';

import { AddressCopyButton } from '@/components/AddressCopyButton';
import { DonutChart } from '@/components/chart/DonutChart';
import { HistogramChart } from '@/components/chart/HistogramChart';
import { LineChart } from '@/components/chart/LineChart';
import {
  StatsContainer,
  StatsContainerLayout,
} from '@/components/container/StatsContainer';
import { EtherscanButton } from '@/components/EtherscanButton';
import { AddressIcon } from '@/components/icons/AddressIcon';
import { TrendLabelPercent } from '@/components/MetricsCard';
import { PageTitle } from '@/components/PageTitle';
import { StakingVersionToggleButtonGroup } from '@/components/StakingVersionToggleButtonGroup';
import {
  GetStakingWalletsQueryVariables,
  SortDirection,
  StakingVersion,
} from '@/gql/graphql';
import { useCoingeckoMarketData } from '@/hooks/useCoingeckoMarketData';
import { useStakingWallets } from '@/hooks/useStakingWallets';
import { useTokenHoldings } from '@/hooks/useTokenHoldings';
import { useTokenUnlocks } from '@/hooks/useTokenUnlocks';
import Dashboard from '@/layouts/DashboardLayout';
import {
  StakingWallet,
  StakingWalletVersion,
} from '@/shared/Model/StakingWallet';
import {
  getTimeWindowLabel,
  TimeInterval,
  Timeseries,
  TimeWindow,
} from '@/shared/Model/Timeseries';
import { format, getAddressShorthand } from '@/shared/Utils/Format';
import { chartColors } from '@/theme/variants';

function getStakingWalletVersionLabel(version: StakingWalletVersion) {
  switch (version) {
    case StakingWalletVersion.One:
      return 'Staking 1INCH v1';
    case StakingWalletVersion.Two:
      return 'Staking 1INCH v2';
    case StakingWalletVersion.All:
      return 'All';
    default:
      return 'Unknown';
  }
}

function useTokenPageData() {
  const initialStakingWalletsParams = {
    sortBy: 'stakingBalance',
    sortDirection: SortDirection.Desc,
    pageNumber: 1,
    pageSize: 8,
    version: 'ALL',
  };

  const marketDataContext = useCoingeckoMarketData(TimeWindow.MAX, '1inch');
  const stakingWalletsContext = useStakingWallets(initialStakingWalletsParams);
  const tokenUnlocksContext = useTokenUnlocks();
  const tokenHoldingsContext = useTokenHoldings();

  const loading =
    !stakingWalletsContext.stakingWallets ||
    !marketDataContext.data ||
    !tokenUnlocksContext.tokenUnlocks ||
    !tokenHoldingsContext.tokenHoldings;

  return {
    marketData: marketDataContext.data,
    stakingWallets: stakingWalletsContext.stakingWallets,
    tokenHoldings: tokenHoldingsContext.tokenHoldings,
    tokenUnlocks: tokenUnlocksContext.tokenUnlocks,
    pagination: stakingWalletsContext.pagination,
    refetchStakingWallets: stakingWalletsContext.refetchStakingWallets,
    updateMarketDataTimeWindow: marketDataContext.updateTimeWindow,
    loading,
  };
}

interface StakingWalletsTableProps {
  tokenPrice: number;
  stakingWallets: StakingWallet[];
  pagination: {
    pageSize?: number | null;
    pageNumber?: number | null;
    totalEntries?: number | null;
    totalPages?: number | null;
  };
  marketCap?: number;
  refetchStakingWallets: (params: GetStakingWalletsQueryVariables) => void;
}

function StakingWalletsTable({
  tokenPrice,
  stakingWallets,
  refetchStakingWallets,
  pagination,
  marketCap,
}: StakingWalletsTableProps) {
  const rows = stakingWallets ?? undefined;

  const [sortBy, setSortBy] = useState<'stakingBalance' | 'address'>(
    'stakingBalance'
  );
  const [stakingVersion, setStakingVersion] = useState<StakingVersion>(
    StakingVersion.All
  );
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const sortMenuOpen = Boolean(anchorEl);
  const handleSortMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleSortMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (rows) {
      refetchStakingWallets({
        pageSize,
        pageNumber,
        sortBy,
        sortDirection:
          sortBy === 'stakingBalance' ? SortDirection.Desc : SortDirection.Asc,
        version: stakingVersion,
      });
    }
  }, [pageNumber, pageSize, sortBy, stakingVersion]);

  const loading = rows === undefined;
  const isLastPage = pageNumber === pagination.totalPages;
  const isFirstPage = pageNumber === 1;

  const versionOptions = (
    Object.keys(StakingWalletVersion) as (keyof typeof StakingWalletVersion)[]
  ).map((key) => {
    return {
      value: StakingWalletVersion[key],
      label: getStakingWalletVersionLabel(StakingWalletVersion[key]),
    };
  });

  const handleVersionChange = (e: any, value: any) => {
    if (value) {
      setStakingVersion(value);
    }
  };

  const nextPage = () => {
    if (pageNumber === pagination.totalPages) return;
    setPageNumber(pageNumber + 1);
  };

  const previousPage = () => {
    if (pageNumber === 1) return;
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
          <Typography variant="h4">Staking Wallets</Typography>
          <StakingVersionToggleButtonGroup
            value={stakingVersion}
            onChange={handleVersionChange}
            options={versionOptions}
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
              selected={sortBy === 'stakingBalance'}
              onClick={() => {
                setSortBy('stakingBalance');
                handleSortMenuClose();
              }}
            >
              Staking Balance
            </MenuItem>
            <MenuItem
              selected={sortBy === 'address'}
              onClick={() => {
                setSortBy('address');
                handleSortMenuClose();
              }}
            >
              Address
            </MenuItem>
          </Menu>
        </div>
        {rows?.map((stakingWallet) => (
          <div
            key={stakingWallet.id}
            css={(theme) => css`
              display: flex;
              flex-flow: row;
              gap: 10px;
              align-items: center;
              justify-content: space-between;
              padding: 10px 20px;
              border-radius: 16px;
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
                flex-grow: 1;
              `}
            >
              <AddressIcon address={stakingWallet.address} />
              <div
                css={css`
                  display: flex;
                  flex-flow: row;
                  align-items: center;
                  gap: 10px;
                `}
              >
                <a
                  href={`https://etherscan.io/address/${stakingWallet.address}`}
                >
                  <Typography variant="body2">
                    {getAddressShorthand(stakingWallet.address)}
                  </Typography>
                </a>
                <EtherscanButton size="small" address={stakingWallet.address} />
                <AddressCopyButton
                  size="small"
                  address={stakingWallet.address}
                />
              </div>
            </div>

            <div
              css={css`
                text-align: right;
              `}
            >
              <Typography variant="body2">
                {format(stakingWallet.stakingBalance, {
                  abbreviate: true,
                  symbol: stakingWallet.version,
                })}
              </Typography>
            </div>
            <div
              css={css`
                width: 200px;
                text-align: right;
              `}
            >
              <Typography variant="body2">
                {format(tokenPrice * stakingWallet.stakingBalance, {
                  abbreviate: true,
                  symbol: 'USD',
                })}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {format(
                  (stakingWallet.stakingBalance * tokenPrice) /
                    (marketCap ?? 1),
                  {
                    symbol: '%',
                  }
                )}{' '}
                of market cap
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
          {pageNumber} / {pagination.totalPages}
        </Typography>

        <IconButton onClick={nextPage} disabled={loading || isLastPage}>
          <ArrowForward />
        </IconButton>
      </div>
    </div>
  );
}

interface ControllerLineChartProps {
  timeseriesList?: Timeseries[];
  formatter?: (y?: number | null) => string;
  updateTimeWindow?: (TimeWindow: TimeWindow) => void;
}

function ControlledLineChart({
  timeseriesList,
  updateTimeWindow,
}: ControllerLineChartProps) {
  const [selectedTimeseriesList, setSelectedTimeseriesList] =
    useState<Timeseries[]>();
  const selectedTimeseriesListRef = useRef<Timeseries[]>();
  const isInitialized = useRef<boolean>(false);
  const [timeWindow, setTimeWindow] = useState<TimeWindow>(TimeWindow.MAX);

  useEffect(() => {
    if (timeWindow) {
      updateTimeWindow?.(timeWindow);
    }
  }, [timeWindow]);

  useEffect(() => {
    if (
      timeseriesList &&
      timeseriesList.length > 0 &&
      isInitialized.current === false
    ) {
      isInitialized.current = true;
      setSelectedTimeseriesList([timeseriesList[0]]);
      selectedTimeseriesListRef.current = [timeseriesList[0]];
    }
  }, [timeseriesList]);

  useEffect(() => {
    if (timeseriesList && isInitialized.current) {
      const selectedTimeseriesListIds = selectedTimeseriesListRef.current?.map(
        (timeseries) => timeseries.name
      );
      const newSelectedTimeseriesList = timeseriesList.filter((timeseries) =>
        selectedTimeseriesListIds?.includes(timeseries.name)
      );
      setSelectedTimeseriesList(newSelectedTimeseriesList);
    }
  }, [timeseriesList]);

  return (
    <LineChart
      loading={!timeseriesList}
      timeseriesList={timeseriesList}
      selectedTimeseriesList={selectedTimeseriesList}
      onSelectedTimeseriesChange={setSelectedTimeseriesList}
      timeWindow={timeWindow}
      timeWindowOptions={
        updateTimeWindow
          ? [
              TimeWindow.ONE_DAY,
              TimeWindow.SEVEN_DAYS,
              TimeWindow.ONE_MONTH,
              TimeWindow.ONE_YEAR,
              TimeWindow.YEAR_TO_DATE,
              TimeWindow.MAX,
            ].map((timeWindow) => ({
              value: timeWindow,
              label: getTimeWindowLabel(timeWindow),
            }))
          : undefined
      }
      onTimeWindowChange={setTimeWindow}
    />
  );
}

export default function TokenPage() {
  const theme = useTheme();
  const {
    marketData,
    stakingWallets,
    tokenHoldings,
    tokenUnlocks,
    pagination,
    updateMarketDataTimeWindow,
    refetchStakingWallets,
  } = useTokenPageData();

  const tokenPriceTimeseries: Timeseries[] = useMemo(
    () => [
      {
        name: 'Token price',
        data: marketData?.historicalMarketData?.prices || [],
        yAxis: 0,
        color: theme.palette.chart[0],
      },
      {
        name: 'Market cap',
        data: marketData?.historicalMarketData?.marketCaps || [],
        yAxis: 1,
        color: theme.palette.chart[1],
      },
      {
        name: 'Volume',
        data: marketData?.historicalMarketData?.volumes || [],
        yAxis: 1,
        color: theme.palette.chart[2],
      },
    ],
    [marketData]
  );

  const tokenUnlocksTimeseries: Timeseries[] = useMemo(() => {
    if (!tokenUnlocks) return [];

    return [
      {
        name: 'Token unlocks',
        data: tokenUnlocks.map((tokenUnlock) => {
          return {
            x: tokenUnlock.timestamp!,
            y: tokenUnlock.totalAmount!,
          };
        }),
        color: theme.palette.chart[0],
      },
    ];
  }, [tokenUnlocks]);

  const tokenHoldingsData = useMemo(() => {
    if (!tokenHoldings) return undefined;

    return tokenHoldings.map((tokenHolding, i) => {
      return {
        name: tokenHolding.affiliation!,
        y: tokenHolding.balance!,
        color: chartColors[i],
      };
    });
  }, [tokenHoldings]);

  const loadingStubValue = 1234;
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
        <div
          css={css`
            display: flex;
            flex-flow: row;
            flex-wrap: wrap;
            justify-content: space-between;
            gap: 20px;
          `}
        >
          <div
            css={css`
              width: 100%;
            `}
          >
            <StatsContainer
              layout={StatsContainerLayout.ONE_HALF_ONE_HALF}
              loading={!marketData}
              title={
                <PageTitle
                  icon={
                    <img
                      height="32px"
                      width="32px"
                      src="/vendors/1inch/1inch_logo.svg"
                      alt="1inch token"
                    />
                  }
                >
                  1INCH Token
                </PageTitle>
              }
              headerMetrics={[
                {
                  title: 'Price (24H)',
                  value: format(
                    marketData?.currentMarketData.usd ?? loadingStubValue,
                    {
                      symbol: 'USD',
                      abbreviate: true,
                    }
                  ),
                  subValue: (
                    <TrendLabelPercent
                      value={
                        marketData?.currentMarketData.usd24hChange ??
                        loadingStubValue
                      }
                    />
                  ),
                },
                {
                  title: 'Market cap',
                  value: format(
                    marketData?.currentMarketData?.usdMarketCap ??
                      loadingStubValue,
                    {
                      symbol: 'USD',
                      abbreviate: true,
                    }
                  ),
                },
                {
                  title: 'Volume (24H)',
                  value: format(
                    marketData?.currentMarketData?.usd24hVol ??
                      loadingStubValue,
                    {
                      symbol: 'USD',
                      abbreviate: true,
                    }
                  ),
                },
                {
                  title: 'Total supply',
                  value: format(1500000000, { abbreviate: true }),
                },
              ]}
              containers={[
                {
                  content: (
                    <ControlledLineChart
                      timeseriesList={[tokenPriceTimeseries[0]]}
                      updateTimeWindow={updateMarketDataTimeWindow}
                      formatter={(y) => format(y, { symbol: 'USD' })}
                    />
                  ),
                },
                {
                  content: (
                    <ControlledLineChart
                      timeseriesList={[
                        tokenPriceTimeseries[1],
                        tokenPriceTimeseries[2],
                      ]}
                      formatter={(y) => format(y, { symbol: 'USD' })}
                    />
                  ),
                },
                {
                  title: 'Token unlock schedule',
                  content: (
                    <HistogramChart
                      timeseriesList={tokenUnlocksTimeseries}
                      loading={tokenUnlocksTimeseries.length === 0}
                      timeWindow={TimeWindow.MAX}
                      timeInterval={TimeInterval.MONTHLY}
                      onTimeWindowChange={() => {}}
                      onTimeIntervalChange={() => {}}
                      formatter={(y?: number | null) =>
                        format(y, { abbreviate: true })
                      }
                      yAxisFormatter={(y?: number | null) =>
                        format(y, { abbreviate: true })
                      }
                    />
                  ),
                },
                {
                  title: 'Token distribution',
                  content: (
                    <DonutChart
                      data={tokenHoldingsData}
                      seriesName="Token amount"
                      labelFormatter={(y?: number | null) =>
                        `${format(y, { abbreviate: true })}`
                      }
                      tooltipFormatter={(y?: number | null) => `${format(y)}`}
                    />
                  ),
                },
              ]}
            />
          </div>

          <div
            css={(theme) => css`
              width: 100%;
              max-width: 1024px;
              margin-left: auto;
              margin-right: auto;
              background-color: ${theme.palette.background.paper};
              border-radius: 24px;
            `}
          >
            <StakingWalletsTable
              tokenPrice={marketData?.currentMarketData?.usd ?? 0}
              stakingWallets={stakingWallets}
              pagination={pagination}
              marketCap={marketData?.currentMarketData?.usdMarketCap}
              refetchStakingWallets={refetchStakingWallets}
            />
          </div>
        </div>
      </div>
    </Container>
  );
}

TokenPage.getLayout = function getLayout(page: any) {
  return <Dashboard>{page}</Dashboard>;
};
