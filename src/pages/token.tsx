import { css } from '@emotion/react';
import { ArrowBack, ArrowForward, Sort } from '@mui/icons-material';
import PieChartIcon from '@mui/icons-material/PieChart';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import {
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import { lighten } from 'polished';
import { useEffect, useState } from 'react';

import { AddressCopyButton } from '@/components/AddressCopyButton';
import { DonutChart } from '@/components/chart/DonutChart';
import { HistogramChart } from '@/components/chart/HistogramChart';
import { LineChart } from '@/components/chart/LineChart';
import { EtherscanButton } from '@/components/EtherscanButton';
import { AddressIcon } from '@/components/icons/AddressIcon';
import { RoundedImageIcon } from '@/components/icons/RoundedImageIcon';
import { TrendLabelPercent } from '@/components/MetricsCard';
import { StatsContainer } from '@/components/StatsContainer';
import { StatsSingleContainer } from '@/components/StatsSingleContainer';
import { StakingVersionToggleButtonGroup } from '@/components/table/StakingVersionToggleButtonGroup';
import { useCoingeckoMarketData } from '@/hooks/useCoingeckoMarketData';
import {
  StakingWalletsQueryVariables,
  useStakingWallets,
} from '@/hooks/useStakingWallets';
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

function useTokenPageData() {
  const initialStakingWalletsParams = {
    sortBy: 'stakingBalance',
    sortDirection: 'DESC',
    pageNumber: 1,
    pageSize: 5,
    version: 'ALL',
  };

  const tokenDistribution = [
    {
      name: 'Backers 2',
      y: 12.2,
      color: 'rgb(103,188,169)',
    },
    {
      name: 'Backers 1',
      y: 18.5,
      color: 'rgb(200,115,95)',
    },
    {
      name: 'Small Backers',
      y: 2.3,
      color: 'rgb(217,202,128)',
    },
    {
      name: 'Core contributors',
      y: 22.5,
      color: 'rgb(81,86,116)',
    },
    {
      name: 'Network Growth Fund',
      y: 14.5,
      color: 'rgb(94,86,205)',
    },
    {
      name: 'Community Incentives',
      y: 30.0,
      color: 'rgb(190,73,81)',
    },
  ];

  const tokenUnlockSchedule: Timeseries[] = [
    {
      name: 'Backers 2',
      data: [
        { x: 1606780800, y: 0 },
        { x: 1622505600, y: 0 },
        { x: 1638316800, y: 500000000 * 0.023 },
        { x: 1654041600, y: 708333333 * 0.023 },
        { x: 1669852800, y: 940972222 * 0.023 },
        { x: 1685577600, y: 1166666666 * 0.023 },
        { x: 1701388800, y: 1277777777 * 0.023 },
        { x: 1717200000, y: 1388888888 * 0.122 },
        { x: 1733011200, y: 183000000 },
      ],
      color: 'rgb(103,188,169)',
    },
    {
      name: 'Backers 1',
      data: [
        { x: 1606780800, y: 0 },
        { x: 1622505600, y: 0 },
        { x: 1638316800, y: 500000000 * 0.023 },
        { x: 1654041600, y: 708333333 * 0.023 },
        { x: 1669852800, y: 940972222 * 0.023 },
        { x: 1685577600, y: 1166666666 * 0.023 },
        { x: 1701388800, y: 1277777777 * 0.023 },
        { x: 1717200000, y: 1388888888 * 0.185 },
        { x: 1733011200, y: 277500000 },
      ],
      color: 'rgb(200,115,95)',
    },
    {
      name: 'Small Backers',
      data: [
        { x: 1606780800, y: 0 },
        { x: 1622505600, y: 0 },
        { x: 1638316800, y: 500000000 * 0.023 },
        { x: 1654041600, y: 708333333 * 0.023 },
        { x: 1669852800, y: 940972222 * 0.023 },
        { x: 1685577600, y: 1166666666 * 0.023 },
        { x: 1701388800, y: 1277777777 * 0.023 },
        { x: 1717200000, y: 1388888888 * 0.023 },
        { x: 1733011200, y: 34500000 },
      ],
      color: 'rgb(217,202,128)',
    },
    {
      name: 'Core contributors',
      data: [
        { x: 1606780800, y: 0 },
        { x: 1622505600, y: 0 },
        { x: 1638316800, y: 500000000 * 0.225 },
        { x: 1654041600, y: 708333333 * 0.225 },
        { x: 1669852800, y: 940972222 * 0.225 },
        { x: 1685577600, y: 1166666666 * 0.225 },
        { x: 1701388800, y: 1277777777 * 0.225 },
        { x: 1717200000, y: 1388888888 * 0.225 },
        { x: 1733011200, y: 337500000 },
      ],
      color: 'rgb(81,86,116)',
    },
    {
      name: 'Network Growth Fund',
      data: [
        { x: 1606780800, y: 59027777 },
        { x: 1622505600, y: 69444444 },
        { x: 1638316800, y: 500000000 * 0.145 },
        { x: 1654041600, y: 708333333 * 0.145 },
        { x: 1669852800, y: 940972222 * 0.145 },
        { x: 1685577600, y: 1166666666 * 0.145 },
        { x: 1701388800, y: 1277777777 * 0.145 },
        { x: 1717200000, y: 1388888888 * 0.145 },
        { x: 1733011200, y: 217500000 },
      ],
      color: 'rgb(94,86,205)',
    },
    {
      name: 'Community Incentives',
      data: [
        { x: 1606780800, y: 145833333 },
        { x: 1622505600, y: 173611111 },
        { x: 1638316800, y: 500000000 * 0.3 },
        { x: 1654041600, y: 708333333 * 0.3 },
        { x: 1669852800, y: 940972222 * 0.3 },
        { x: 1685577600, y: 1166666666 * 0.3 },
        { x: 1701388800, y: 1277777777 * 0.3 },
        { x: 1717200000, y: 1388888888 * 0.3 },
        { x: 1733011200, y: 450000000 },
      ],
      color: 'rgb(190,73,81)',
    },
  ];

  const marketDataContext = useCoingeckoMarketData(TimeWindow.MAX, '1inch');
  const stakingWalletsContext = useStakingWallets(initialStakingWalletsParams);

  const loading =
    !stakingWalletsContext.stakingWallets || !marketDataContext.data;

  return {
    marketData: marketDataContext.data,
    stakingWallets: stakingWalletsContext.stakingWallets,
    tokenDistribution,
    tokenUnlockSchedule,
    pagination: stakingWalletsContext.pagination,
    refetchStakingWallets: stakingWalletsContext.refetchStakingWallets,
    updateMarketDataTimeWindow: marketDataContext.updateTimeWindow,
    loading,
  };
}

interface StakingWalletsTableProps {
  stakingWallets: StakingWallet[];
  pagination: {
    pageSize?: number;
    pageNumber?: number;
    totalEntries?: number;
    totalPages?: number;
  };
  refetchStakingWallets: (params: StakingWalletsQueryVariables) => void;
}

function StakingWalletsTable({
  stakingWallets,
  refetchStakingWallets,
  pagination,
}: StakingWalletsTableProps) {
  const rows = stakingWallets ?? undefined;

  const [sortBy, setSortBy] = useState<'stakingBalance' | 'address'>(
    'stakingBalance'
  );
  const [stakingVersion, setStakingVersion] = useState<StakingWalletVersion>(
    StakingWalletVersion.All
  );
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);
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
        sortDirection: sortBy === 'stakingBalance' ? 'DESC' : 'ASC',
        version: stakingVersion.valueOf(),
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
      label: key,
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
          <Typography variant="h3">Staking Wallets</Typography>
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
              <AddressIcon address={stakingWallet.address} />
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
                    href={`https://etherscan.io/address/${stakingWallet.address}`}
                  >
                    <Typography variant="body2">
                      {getAddressShorthand(stakingWallet.address)}
                    </Typography>
                  </a>
                  <EtherscanButton
                    size="small"
                    address={stakingWallet.address}
                  />
                  <AddressCopyButton
                    size="small"
                    address={stakingWallet.address}
                  />
                </div>
                <Typography variant="body1" color="textSecondary">
                  {getAddressShorthand(stakingWallet.address)}
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
                  {format(stakingWallet.stakingBalance, {
                    abbreviate: true,
                  })}{' '}
                  st1INCH
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
                  Version {stakingWallet.version}
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
  updateTimeWindow: (TimeWindow: TimeWindow) => void;
}

function ControlledLineChart({
  timeseriesList,
  formatter,
  updateTimeWindow,
}: ControllerLineChartProps) {
  const [timeWindow, setTimeWindow] = useState<TimeWindow>(TimeWindow.MAX);

  useEffect(() => {
    if (timeWindow) {
      updateTimeWindow(timeWindow);
    }
  }, [timeWindow]);

  return (
    <LineChart
      timeseriesList={timeseriesList}
      timeWindow={timeWindow}
      timeWindowOptions={[
        TimeWindow.ONE_DAY,
        TimeWindow.SEVEN_DAYS,
        TimeWindow.ONE_MONTH,
        TimeWindow.ONE_YEAR,
        TimeWindow.YEAR_TO_DATE,
        TimeWindow.MAX,
      ].map((timeWindow) => ({
        value: timeWindow,
        label: getTimeWindowLabel(timeWindow),
      }))}
      onTimeWindowChange={setTimeWindow}
      formatter={formatter}
    />
  );
}

export default function TokenPage() {
  const {
    marketData,
    stakingWallets,
    tokenDistribution,
    tokenUnlockSchedule,
    pagination,
    updateMarketDataTimeWindow,
    refetchStakingWallets,
  } = useTokenPageData();

  const tokenPriceTimeseries: Timeseries[] = [
    {
      name: 'Token price',
      data: marketData?.historicalMarketData?.prices || [],
      yAxis: 0,
    },
    {
      name: 'Market cap',
      data: marketData?.historicalMarketData?.marketCaps || [],
      yAxis: 1,
    },
  ];

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
          margin-bottom: 10px;
          align-content: center;
          align-items: center;
          justify-content: flex-start;
        `}
      >
        <RoundedImageIcon src="/vendors/1inch/1inch_logo.svg" size="medium" />
        <Typography variant="h1">1INCH Token</Typography>
      </div>
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
            gap: 20px;
          `}
        >
          <StatsSingleContainer
            title={
              <div
                css={css`
                  display: flex;
                  flex-flow: row;
                  gap: 5px;
                `}
              >
                <QueryStatsIcon />
                <Typography variant="h3">Market data</Typography>
              </div>
            }
            headerMetrics={[
              {
                title: '$1INCH',
                value: format(marketData?.currentMarketData.usd, {
                  symbol: 'USD',
                  abbreviate: true,
                }),
                subValue: (
                  <TrendLabelPercent
                    value={marketData?.currentMarketData.usd24hChange}
                  />
                ),
              },
              {
                title: 'Market cap',
                value: format(marketData?.currentMarketData?.usdMarketCap, {
                  symbol: 'USD',
                  abbreviate: true,
                }),
              },
              {
                title: '24H trading volatility',
                value: format(marketData?.currentMarketData?.usd24hVol, {
                  symbol: 'USD',
                  abbreviate: true,
                }),
              },
            ]}
            container={{
              title: 'Historical price and market cap',
              content: (
                <ControlledLineChart
                  timeseriesList={tokenPriceTimeseries}
                  updateTimeWindow={updateMarketDataTimeWindow}
                  formatter={(y) => format(y, { symbol: 'USD' })}
                />
              ),
            }}
          />
          <div
            css={(theme) => css`
              width: 100%;
              background-color: ${theme.palette.background.paper};
              border-radius: 24px;
            `}
          >
            <StakingWalletsTable
              stakingWallets={stakingWallets}
              pagination={pagination}
              refetchStakingWallets={refetchStakingWallets}
            />
          </div>
          <div
            css={css`
              width: 100%;
            `}
          >
            <StatsContainer
              title={
                <div
                  css={css`
                    display: flex;
                    flex-flow: row;
                    gap: 5px;
                  `}
                >
                  <PieChartIcon />
                  <Typography variant="h3">
                    Token general information
                  </Typography>
                </div>
              }
              headerMetrics={[
                {
                  title: 'Total supply',
                  value: format(1500000000, { abbreviate: true }),
                },
              ]}
              rightContainer={{
                title: 'Token unlock schedule',
                content: (
                  <HistogramChart
                    timeseriesList={tokenUnlockSchedule}
                    timeWindow={TimeWindow.MAX}
                    timeInterval={TimeInterval.MONTHLY}
                    onTimeWindowChange={() => {}}
                    onTimeIntervalChange={() => {}}
                    formatter={(y?: number | null) =>
                      format(y, { abbreviate: true })
                    }
                  />
                ),
              }}
              leftContainer={{
                title: 'Token distribution',
                content: (
                  <DonutChart
                    data={tokenDistribution}
                    seriesName="Token distribution (%)"
                    labelFormatter={(y?: number | null) => `${y}%`}
                    tooltipFormatter={(y?: number | null) => `${y}%`}
                  />
                ),
              }}
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
