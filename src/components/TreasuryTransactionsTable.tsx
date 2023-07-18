import { css } from '@emotion/react';
import { ArrowBack, ArrowForward, Sort } from '@mui/icons-material';
import VerticalAlignBottomIcon from '@mui/icons-material/VerticalAlignBottom';
import { Button, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import moment from 'moment';
import { lighten } from 'polished';
import { useEffect, useMemo, useState } from 'react';

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
  getEtherscanAddressLink,
  getEtherscanTransactionLink,
} from '@/shared/Utils/Etherscan';
import { getWalletDisplayName } from '@/shared/Utils/Format';

export function TreasuryTransactionsTable() {
  const assetService = useAssetService();
  const [selectedAssets, setSelectedAssets] = useState<Asset[]>([]);
  const [sortBy, setSortBy] = useState<'timestamp' | 'amountUsd'>('timestamp');

  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(7);
  const { transactions, mock, loading } = useTreasuryTransactions({
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
          <Typography variant="h3">Transactions</Typography>
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
                align-items: center;
                justify-content: flex-start;
                width: 100px;
                gap: 5px;
              `}
            >
              <VerticalAlignBottomIcon />
              <Typography variant="body2">Deposit</Typography>
            </div>
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
                    {moment.unix(row.timestamp).fromNow()}
                  </Typography>
                </AutoSkeleton>
              </div>
            </div>

            <div
              css={(theme) => css`
                display: flex;
                flex-flow: row;
                width: 300px;
                gap: 10px;
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
                    Receiver
                  </Typography>
                </AutoSkeleton>
              </div>
            </div>

            {/* <div
              css={css`
                display: flex;
                flex-flow: column;
                align-items: flex-end;
                width: 200px;
              `}
            >
              <AutoSkeleton loading={loading}>
                <Typography variant="body2">
                  {row.amountUsd.toDisplayString()}
                </Typography>
              </AutoSkeleton>
              <AutoSkeleton loading={loading}>
                <Typography variant="body1" color="textSecondary">
                  {row.amount.toDisplayString()}
                </Typography>
              </AutoSkeleton>
            </div> */}
            <div
              css={css`
                display: flex;
                flex-flow: row;
                align-items: flex-end;
                gap: 10px;
                width: 200px;
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
