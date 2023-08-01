import { css } from '@emotion/react';
import {
  AccountBalance,
  AcUnit,
  ArrowBack,
  ArrowForward,
  AttachMoney,
  Engineering,
  Group,
  NorthEast,
  ReceiptLong,
  Sort,
  SouthEast,
} from '@mui/icons-material';
import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  NoSsr,
  Typography,
} from '@mui/material';
import moment from 'moment';
import Image from 'next/image';
import { lighten } from 'polished';
import { useEffect, useMemo, useState } from 'react';
import TimeAgo from 'react-timeago';

import { AddressCopyButton } from '@/components/AddressCopyButton';
import { AssetMultiSelect } from '@/components/filters/AssetMultiSelect';
import { AddressIcon } from '@/components/icons/AddressIcon';
import { AssetIcon } from '@/components/icons/AssetIcon';
import { AutoSkeleton } from '@/components/loading/AutoSkeleton';
import { useAssetService } from '@/hooks/useAssetService';
import { useChainStore } from '@/hooks/useChainStore';
import { useTreasuryTransactions } from '@/hooks/useTreasuryTransactions';
import { Asset } from '@/shared/Model/Asset';
import { Chain, ChainId } from '@/shared/Model/Chain';
import { TreasuryTransactionType } from '@/shared/Model/TreasuryTransaction';
import {
  getEtherscanAddressLink,
  getEtherscanTransactionLink,
} from '@/shared/Utils/Etherscan';
import { getWalletDisplayName } from '@/shared/Utils/Format';

import { DateRangePicker } from './DateRangePicker';
import { ChainMultiSelect } from './filters/ChainMultiSelect';
import { SelectOptionLabel } from './filters/SelectOptionLabel';
import {
  SelectWithSearch,
  SelectWithSearchProps,
} from './filters/SelectWithSearch';

function TransactionTypeIcon({ type }: { type: TreasuryTransactionType }) {
  switch (type) {
    case TreasuryTransactionType.SPREAD_SURPLUS:
      return <AttachMoney />;
    case TreasuryTransactionType.STAKING_FEES:
      return (
        <div
          css={(theme) => css`
            display: flex;
            flex-flow: row;
            justify-content: center;
            align-items: center;
            width: 27px;
            height: 27px;
            color: ${theme.palette.primary.main};
          `}
        >
          <Image
            src="/1inch-staking.svg"
            height="20px"
            width="20px"
            alt="aave"
          />
        </div>
      );
    case TreasuryTransactionType.SPENDING:
      return <ReceiptLong />;
    case TreasuryTransactionType.GRANT_PAYMENT:
      return <Group />;
    case TreasuryTransactionType.COLD_WALLET:
      return <AcUnit />;
    case TreasuryTransactionType.AAVE:
      return (
        <div
          css={css`
            display: flex;
            flex-flow: row;
            justify-content: center;
            align-items: center;
            width: 27px;
            height: 27px;
          `}
        >
          <Image src="/aave-icon.png" height="24px" width="18px" alt="aave" />
        </div>
      );
    case TreasuryTransactionType.DEPOSIT:
      return <SouthEast />;
    case TreasuryTransactionType.WITHDRAW:
      return <NorthEast />;
    case TreasuryTransactionType.OTHER:
      return <AttachMoney />;
    case TreasuryTransactionType.OPERATIONS:
      return <Engineering />;
    case TreasuryTransactionType.OPERATIONS_FUND:
      return <AccountBalance />;
    default:
      return null;
  }
}

function getSecondaryTransactionLabel(
  transactionType: TreasuryTransactionType
) {
  switch (transactionType) {
    case TreasuryTransactionType.SPREAD_SURPLUS:
    case TreasuryTransactionType.STAKING_FEES:
    case TreasuryTransactionType.DEPOSIT:
      return 'Deposit';
    case TreasuryTransactionType.AAVE:
      return 'Lend';
    case TreasuryTransactionType.GRANT_PAYMENT:
    case TreasuryTransactionType.COLD_WALLET:
    case TreasuryTransactionType.SPENDING:
    case TreasuryTransactionType.WITHDRAW:
    case TreasuryTransactionType.OPERATIONS_FUND:
    case TreasuryTransactionType.OPERATIONS:
    case TreasuryTransactionType.OTHER_EXPENSE:
      return 'Withdraw';
    case TreasuryTransactionType.OTHER:
    default:
      return 'Other';
  }
}
function getPrimaryTransactionLabel(transactionType: TreasuryTransactionType) {
  switch (transactionType) {
    case TreasuryTransactionType.SPREAD_SURPLUS:
      return 'Spread surplus';
    case TreasuryTransactionType.STAKING_FEES:
      return 'Staking v2 fees';
    case TreasuryTransactionType.SPENDING:
      return 'Spending';
    case TreasuryTransactionType.GRANT_PAYMENT:
      return 'Grant payment';
    case TreasuryTransactionType.COLD_WALLET:
      return 'Transfer to cold wallet';
    case TreasuryTransactionType.OPERATIONS:
      return 'Operations';
    case TreasuryTransactionType.OPERATIONS_FUND:
      return 'Operations Fund';
    case TreasuryTransactionType.OTHER_EXPENSE:
      return 'Other Expense';
    case TreasuryTransactionType.AAVE:
      return 'Lend on AAVE';
    case TreasuryTransactionType.DEPOSIT:
      return 'Other transfer in';
    case TreasuryTransactionType.WITHDRAW:
      return 'Other transfer out';
    case TreasuryTransactionType.OTHER:
    default:
      return 'Unknown type';
  }
}

interface TransactionTypeMultiSelectProps
  extends Omit<
    SelectWithSearchProps<Asset>,
    'onChange' | 'options' | 'searchPredicate' | 'value'
  > {
  options: TreasuryTransactionType[];
  value: TreasuryTransactionType[];
  onChange: (transactionTypes: TreasuryTransactionType[]) => void;
  placeholder?: string;
}

function TransactionTypeMultiSelect({
  options,
  value,
  onChange,
  placeholder,
  ...props
}: TransactionTypeMultiSelectProps) {
  const optionsInternal = options.map((txType) => {
    return {
      key: TreasuryTransactionType[txType],
      value: txType,
      label: (
        <SelectOptionLabel
          name={getPrimaryTransactionLabel(txType)}
          description={getSecondaryTransactionLabel(txType)}
          icon={<TransactionTypeIcon type={txType} />}
        />
      ),
    };
  });

  const onChangeInternal = (
    values: TreasuryTransactionType[] | TreasuryTransactionType | null
  ) => {
    if (!values) {
      onChange([]);
      return;
    }

    if (!Array.isArray(values)) {
      values = [values];
    }

    onChange(values);
  };

  const label = (() => {
    if (value.length === 0) {
      return placeholder ?? 'Filter by transaction type';
    }
    if (value.length === 1) {
      return (
        optionsInternal.find((o) => o.value === value[0])?.label ??
        placeholder ??
        'Filter by transaction type'
      );
    }

    if (value.length > 1) {
      return `Filtered by ${value.length} transaction types`;
    }
    if (value.length === optionsInternal.length) {
      return 'All transaction types selected';
    }
  })();

  return (
    <SelectWithSearch
      {...props}
      label={label}
      value={value}
      getKey={(option) => TreasuryTransactionType[option]}
      multiple={true}
      options={optionsInternal ?? []}
      disableSearch={true}
      onChange={onChangeInternal}
      css={css`
        width: 400px;
      `}
    />
  );
}

function TransactionTypeCell({ type }: { type: TreasuryTransactionType }) {
  const primaryLabel = getPrimaryTransactionLabel(type);
  const secondaryLabel = getSecondaryTransactionLabel(type);

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
      <TransactionTypeIcon type={type} />
      <div>
        <Typography variant="body2">{primaryLabel}</Typography>
        <Typography variant="body1" color="textSecondary">
          {secondaryLabel}
        </Typography>
      </div>
    </div>
  );
}

export function TreasuryTransactionsTable() {
  const assetService = useAssetService();
  const chainStore = useChainStore();

  const [selectedAssets, setSelectedAssets] = useState<Asset[]>([]);
  const [selectedChains, setSelectedChains] = useState<Chain[]>([]);
  const [selectedTransactionTypes, setSelectedTransactionTypes] = useState<
    TreasuryTransactionType[]
  >([]);
  const [selectedDateRange, setSelectedDateRange] = useState<{
    start?: Date;
    end?: Date;
  }>({});
  const [sortBy, setSortBy] = useState<'timestamp' | 'amountUsd'>('timestamp');
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(9);

  const { transactions, mock, loading } = useTreasuryTransactions({
    transactionTypes: selectedTransactionTypes,
    pageSize: pageSize * 100,
    pageNumber: 1,
    sortBy,
    chainIds: selectedChains.map((c) => c.id),
    assetIds: selectedAssets.map((asset) => asset.id),
    startDate: selectedDateRange.start,
    endDate: selectedDateRange.end,
  });

  const rows = !loading && transactions ? transactions : mock;

  const chainOptions = useMemo(() => {
    if (!chainStore) {
      return;
    }

    return [
      chainStore.getByChainId(ChainId.ETHEREUM)!,
      chainStore.getByChainId(ChainId.ARBITRUM)!,
    ];
  }, [chainStore]);

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
            gap: 10px;
            white-space: nowrap;
            padding: 10px 10px 0 10px;
            width: 100%;
          `}
        >
          <Typography variant="h3">Transactions</Typography>
          <AutoSkeleton>
            <DateRangePicker
              value={selectedDateRange}
              onChange={setSelectedDateRange}
            />
          </AutoSkeleton>
          <AutoSkeleton loading={!assetOptions}>
            <AssetMultiSelect
              placeholder="Filter by assets"
              assets={assetOptions ?? []}
              values={selectedAssets}
              onChange={setSelectedAssets}
            />
          </AutoSkeleton>
          <AutoSkeleton loading={!assetOptions}>
            <TransactionTypeMultiSelect
              onChange={setSelectedTransactionTypes}
              value={selectedTransactionTypes}
              options={[
                TreasuryTransactionType.SPREAD_SURPLUS,
                TreasuryTransactionType.STAKING_FEES,
                TreasuryTransactionType.AAVE,
                TreasuryTransactionType.OPERATIONS,
                TreasuryTransactionType.OPERATIONS_FUND,
              ]}
            />
          </AutoSkeleton>

          <AutoSkeleton>
            <ChainMultiSelect
              options={chainOptions ?? []}
              value={selectedChains}
              onChange={setSelectedChains}
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
              <TransactionTypeCell type={row.type} />
            </div>
            <div
              css={(theme) => css`
                display: flex;
                flex-flow: row;
                gap: 10px;
                width: 300px;
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
