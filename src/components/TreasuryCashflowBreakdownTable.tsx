import { css } from '@emotion/react';
import { Typography } from '@mui/material';

import { TreasuryCashflowBreakdown } from '@/shared/Model/TreasuryCashflowBreakdown';
import { format } from '@/shared/Utils/Format';

import { AutoSkeleton } from './loading/AutoSkeleton';

const INDENT_SIZE = 24;

interface TreasuryCashflowBreakdownTableProps {
  data?: TreasuryCashflowBreakdown | null;
  loading?: boolean;
}

export function TreasuryCashflowBreakdownTable({
  data,
  loading: loading_,
}: TreasuryCashflowBreakdownTableProps) {
  const loading = loading_ || !data;

  return (
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
          justify-content: space-between;
        `}
      >
        <AutoSkeleton loading={loading}>
          <Typography variant="h4" color="textPrimary" whiteSpace="nowrap">
            Inflows
          </Typography>
        </AutoSkeleton>
        <AutoSkeleton loading={loading}>
          <Typography variant="h4" color="textPrimary" whiteSpace="nowrap">
            {format(data?.inflow, { abbreviate: true, symbol: 'USD' })}
          </Typography>
        </AutoSkeleton>
      </div>
      <div
        css={css`
          display: flex;
          flex-flow: row;
          justify-content: space-between;
          margin-left: ${INDENT_SIZE}px;
        `}
      >
        <AutoSkeleton loading={loading}>
          <Typography variant="h5" color="textPrimary" whiteSpace="nowrap">
            Staking fees
          </Typography>
        </AutoSkeleton>
        <AutoSkeleton loading={loading}>
          <Typography variant="h5" color="textPrimary" whiteSpace="nowrap">
            {format(data?.stakingFees.inflow, {
              abbreviate: true,
              symbol: 'USD',
            })}
          </Typography>
        </AutoSkeleton>
      </div>
      <div
        css={css`
          display: flex;
          flex-flow: row;
          justify-content: space-between;
          margin-left: ${INDENT_SIZE}px;
        `}
      >
        <AutoSkeleton loading={loading}>
          <Typography variant="h5" color="textPrimary" whiteSpace="nowrap">
            Spread surplus
          </Typography>
        </AutoSkeleton>
        <AutoSkeleton loading={loading}>
          <Typography variant="h5" color="textPrimary" whiteSpace="nowrap">
            {format(data?.spreadSurplus.inflow, {
              abbreviate: true,
              symbol: 'USD',
            })}
          </Typography>
        </AutoSkeleton>
      </div>
      <div
        css={(theme) => css`
          border: 1px solid ${theme.palette.divider};
          height: 1px;
          margin: 5px 0;
        `}
      ></div>
      <div
        css={css`
          display: flex;
          flex-flow: row;
          justify-content: space-between;
        `}
      >
        <AutoSkeleton loading={loading}>
          <Typography variant="h4" color="textPrimary" whiteSpace="nowrap">
            Outflows
          </Typography>
        </AutoSkeleton>
        <AutoSkeleton loading={loading}>
          <Typography variant="h4" color="textPrimary" whiteSpace="nowrap">
            {format(data?.outflow, { abbreviate: true, symbol: 'USD' })}
          </Typography>
        </AutoSkeleton>
      </div>
      <div
        css={css`
          display: flex;
          flex-flow: row;
          justify-content: space-between;
          margin-left: ${INDENT_SIZE}px;
        `}
      >
        <AutoSkeleton loading={loading}>
          <Typography variant="h5" color="textPrimary" whiteSpace="nowrap">
            Operations
          </Typography>
        </AutoSkeleton>
        <AutoSkeleton loading={loading}>
          <Typography variant="h5" color="textPrimary" whiteSpace="nowrap">
            {format(data?.operations.outflow, {
              abbreviate: true,
              symbol: 'USD',
            })}
          </Typography>
        </AutoSkeleton>
      </div>
      <div
        css={css`
          display: flex;
          flex-flow: row;
          justify-content: space-between;
          margin-left: ${INDENT_SIZE}px;
        `}
      >
        <AutoSkeleton loading={loading}>
          <Typography variant="h5" color="textPrimary" whiteSpace="nowrap">
            Operations Fund
          </Typography>
        </AutoSkeleton>
        <AutoSkeleton loading={loading}>
          <Typography variant="h5" color="textPrimary" whiteSpace="nowrap">
            {format(data?.operationsFund.outflow, {
              abbreviate: true,
              symbol: 'USD',
            })}
          </Typography>
        </AutoSkeleton>
      </div>
      <div
        css={css`
          display: flex;
          flex-flow: row;
          justify-content: space-between;
          margin-left: ${INDENT_SIZE}px;
        `}
      >
        <AutoSkeleton loading={loading}>
          <Typography variant="h5" color="textPrimary" whiteSpace="nowrap">
            Other Expenses
          </Typography>
        </AutoSkeleton>
        <AutoSkeleton loading={loading}>
          <Typography variant="h5" color="textPrimary" whiteSpace="nowrap">
            {format(data?.otherTransfersOut.outflow, {
              abbreviate: true,
              symbol: 'USD',
            })}
          </Typography>
        </AutoSkeleton>
      </div>
    </div>
  );
}
