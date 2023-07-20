import { css } from '@emotion/react';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { Button, IconButton, Typography } from '@mui/material';
import { lighten } from 'polished';
import { useState } from 'react';

import { AutoSkeleton } from '@/components/AutoSkeleton';
import { useTreasuryBalances } from '@/hooks/useTreasuryBalances';

import { AssetAmountTableCell } from './table/AssetAmountTableCell';
import { AssetTableCell } from './table/AssetTableCell';

export function TreasuryBalancesTable() {
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const { treasuryBalances, loading, mock } = useTreasuryBalances();

  const rows = !loading && treasuryBalances ? treasuryBalances : mock;

  //   useEffect(() => {
  //     setPageNumber(0);
  //   }, [sortBy, selectedTransactionTypes, selectedAssets]);

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

  const resetFilters = () => {
    // setSelectedAssets([]);
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
          <Typography variant="h3">Portfolio</Typography>
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
              <AutoSkeleton loading={!row.asset}>
                <AssetTableCell asset={row.asset!} />
              </AutoSkeleton>
            </div>
            <div>
              <AutoSkeleton loading={!row.amount || !row.amountUsd}>
                <AssetAmountTableCell
                  amount={row.amount!}
                  amountUsd={row.amountUsd!}
                />
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
