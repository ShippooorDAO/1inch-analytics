import { css } from '@emotion/react';
import {
  ArrowBack,
  ArrowForward,
  AttachMoney,
  NorthEast,
  Sort,
} from '@mui/icons-material';
import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  NoSsr,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import moment from 'moment';
import { lighten } from 'polished';
import { useEffect, useMemo, useState } from 'react';
import TimeAgo from 'react-timeago';

import { AddressCopyButton } from '@/components/AddressCopyButton';
import { AutoSkeleton } from '@/components/AutoSkeleton';
import { AssetMultiSelect } from '@/components/filters/AssetMultiSelect';
import { AddressIcon } from '@/components/icons/AddressIcon';
import { AssetIcon } from '@/components/icons/AssetIcon';
import { useAssetService } from '@/hooks/useAssetService';
import { useTreasuryTransactions } from '@/hooks/useTreasuryTransactions';
import { Asset } from '@/shared/Model/Asset';
import { ChainId } from '@/shared/Model/Chain';
import {
  TreasuryTransactionSubType,
  TreasuryTransactionType,
} from '@/shared/Model/TreasuryTransaction';
import {
  getEtherscanAddressLink,
  getEtherscanTransactionLink,
} from '@/shared/Utils/Etherscan';
import { getWalletDisplayName } from '@/shared/Utils/Format';

function TransactionTypeCell({
  type,
  subType,
  fromLabel,
  toLabel,
}: {
  type: TreasuryTransactionType;
  subType: TreasuryTransactionSubType;
  fromLabel?: string | null;
  toLabel?: string | null;
}) {
  const logo = (() => {
    if (fromLabel === '1inch: Spread Surplus') {
      return <AttachMoney />;
    }

    if (fromLabel === '1inch: Staking v2 fees') {
      return <AttachMoney />;
    }

    if (toLabel === '1inch: Spending') {
      return <NorthEast />; // TODO
    }

    if (toLabel === '1inch: Grant') {
      return <NorthEast />; // TODO
    }

    if (toLabel === '1inch: Cold wallet') {
      return <NorthEast />; // TODO
    }

    if (toLabel === 'Aave: USDC V3') {
      return <NorthEast />; // TODO
    }

    if (fromLabel === '1inch: Treasury') {
      return <AttachMoney />;
    }

    if (toLabel === '1inch: Treasury') {
      return <NorthEast />; // TODO
    }
  })();

  const mainLabel = (() => {
    if (fromLabel === '1inch: Spread Surplus') {
      return 'Deposit';
    }

    if (fromLabel === '1inch: Staking v2 fees') {
      return 'Deposit';
    }

    if (toLabel === '1inch: Spending') {
      return 'Withdraw';
    }

    if (toLabel === '1inch: Grant') {
      return 'Withdraw';
    }

    if (toLabel === '1inch: Cold wallet') {
      return 'Transfer';
    }

    if (toLabel === 'Aave: USDC V3') {
      return 'Lend';
    }

    if (fromLabel === '1inch: Treasury') {
      return 'Deposit';
    }

    if (toLabel === '1inch: Treasury') {
      return 'Withdraw';
    }
  })();

  const secondaryLabel = (() => {
    if (fromLabel === '1inch: Spread Surplus') {
      return 'Spread surplus';
    }

    if (fromLabel === '1inch: Staking v2 fees') {
      return 'Staking v2 fees';
    }

    if (toLabel === '1inch: Spending') {
      return 'Spending';
    }

    if (toLabel === '1inch: Grant') {
      return 'Grant payment';
    }

    if (toLabel === '1inch: Cold wallet') {
      return 'Transfer to cold wallet';
    }

    if (toLabel === 'Aave: USDC V3') {
      return 'Lend on AAVE v3';
    }

    return 'Other';
  })();

  return (
    <div
      css={css`
        display: flex;
        flex-flow: row;
        align-items: center;
        justify-content: flex-start;
        gap: 5px;
      `}
    >
      {logo}
      <div>
        <Typography variant="body2">{mainLabel}</Typography>
        <Typography variant="body1" color="textSecondary">
          {secondaryLabel}
        </Typography>
      </div>
    </div>
  );
}

export function TreasuryTransactionsTable() {
  const assetService = useAssetService();
  const [selectedAssets, setSelectedAssets] = useState<Asset[]>([]);
  const [sortBy, setSortBy] = useState<'timestamp' | 'amountUsd'>('timestamp');

  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(7);
  const [selectedTransactionTypes, setSelectedTransactionTypes] = useState<
    string[]
  >([]);
  const { transactions, mock, loading } = useTreasuryTransactions({
    includeSpreadSurplus: selectedTransactionTypes.includes(
      'includeSpreadSurplus'
    ),
    includeStakingFees: selectedTransactionTypes.includes('includeStakingFees'),
    includeSpending: selectedTransactionTypes.includes('includeSpending'),
    includeGrantPayments: selectedTransactionTypes.includes(
      'includeGrantPayments'
    ),
    includeColdWalletTransfers: selectedTransactionTypes.includes(
      'includeColdWalletTransfers'
    ),
    includeAave: selectedTransactionTypes.includes('includeAave'),
    pageSize: pageSize * 100,
    pageNumber: 1,
    sortBy,
    assetIds: selectedAssets.map((asset) => asset.id),
  });

  const rows = !loading && transactions ? transactions : mock;

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
  }, [sortBy, selectedTransactionTypes, selectedAssets]);

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

  const handleTransactionTypeFilterChange = (
    event: React.MouseEvent<HTMLElement>,
    newTransactionTypes: string[] | null
  ) => {
    setSelectedTransactionTypes(newTransactionTypes ?? []);
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
          <Typography variant="h3">Transactions</Typography>
          <AutoSkeleton loading={!assetOptions}>
            <AssetMultiSelect
              placeholder="Filter by assets"
              assets={assetOptions ?? []}
              values={selectedAssets}
              onChange={setSelectedAssets}
            />
          </AutoSkeleton>
          <ToggleButtonGroup
            size="small"
            value={selectedTransactionTypes}
            color="primary"
            onChange={handleTransactionTypeFilterChange}
            aria-label="text formatting"
            exclusive
          >
            <ToggleButton
              value="includeStakingFees"
              aria-label="staking fees"
              size="small"
            >
              Staking fees
            </ToggleButton>
            <ToggleButton
              value="includeSpreadSurplus"
              aria-label="spread surplus"
            >
              Spread surplus
            </ToggleButton>
            <ToggleButton value="includeGrantPayments" aria-label="grants">
              Grants
            </ToggleButton>
            <ToggleButton
              value="includeSpending"
              aria-label="spending"
              size="small"
            >
              Spending
            </ToggleButton>
            <ToggleButton
              value="includeColdWalletTransfers"
              aria-label="cold wallet"
            >
              Cold wallet
            </ToggleButton>
            <ToggleButton value="includeAave" aria-label="aave">
              AAVE
            </ToggleButton>
          </ToggleButtonGroup>
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
              selected={sortBy === 'amountUsd'}
              onClick={() => {
                setSortBy('amountUsd');
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
            <Typography variant="h4">No trades found</Typography>
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
                width: 160px;
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
                    <a href={getEtherscanTransactionLink(row.transactionHash)}>
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
              css={css`
                width: 160px;
              `}
            >
              <TransactionTypeCell
                type={row.type}
                subType={row.subType}
                fromLabel={row.fromLabel}
                toLabel={row.toLabel}
              />
            </div>
            <div
              css={(theme) => css`
                display: flex;
                flex-flow: row;
                gap: 10px;
                width: 360px;
                ${theme.breakpoints.down('md')} {
                  display: none;
                }
              `}
            >
              <AutoSkeleton loading={loading}>
                <AddressIcon address={row.from} />
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
                    <a href={getEtherscanAddressLink(row.from)}>
                      <Typography variant="body2">
                        {getWalletDisplayName(row.from)}
                      </Typography>
                    </a>
                    <AddressCopyButton size="small" address={row.from} />
                  </div>
                </AutoSkeleton>
                <AutoSkeleton loading={loading}>
                  <Typography variant="body1" color="textSecondary">
                    From
                  </Typography>
                </AutoSkeleton>
              </div>
            </div>
            <div
              css={(theme) => css`
                display: flex;
                flex-flow: row;
                justify-content: flex-start;
                gap: 10px;
                flex-grow: 2;
                ${theme.breakpoints.down('lg')} {
                  display: none;
                }
              `}
            >
              <AutoSkeleton loading={loading}>
                <AddressIcon address={row.to} />
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
                    <a href={getEtherscanAddressLink(row.to)}>
                      <Typography variant="body2">
                        {getWalletDisplayName(row.to)}
                      </Typography>
                    </a>
                    <AddressCopyButton size="small" address={row.to} />
                  </div>
                </AutoSkeleton>
                <AutoSkeleton loading={loading}>
                  <Typography variant="body1" color="textSecondary">
                    To
                  </Typography>
                </AutoSkeleton>
              </div>
            </div>
            <div
              css={css`
                display: flex;
                flex-flow: row;
                align-items: center;
                justify-content: flex-end;
                gap: 10px;
                margin-left: auto;
                flex-grow: 3;
              `}
            >
              <div
                css={css`
                  display: flex;
                  flex-flow: column;
                  align-items: flex-end;
                `}
              >
                <AutoSkeleton loading={loading}>
                  <Typography variant="body2">
                    {row.amount.toDisplayString()}
                  </Typography>
                </AutoSkeleton>
                <AutoSkeleton loading={loading}>
                  <Typography variant="body1" color="textSecondary">
                    {row.amountUsd.toDisplayString()}
                  </Typography>
                </AutoSkeleton>
              </div>
              <AutoSkeleton loading={loading}>
                <AssetIcon asset={row.asset} />
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
