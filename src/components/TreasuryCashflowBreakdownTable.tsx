import { css } from '@emotion/react';
import { Typography } from '@mui/material';

import { TreasuryCashflowBreakdown } from '@/shared/Model/TreasuryCashflowBreakdown';
import { format } from '@/shared/Utils/Format';

import { AutoSkeleton } from './AutoSkeleton';

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
        height: 100%;
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
            Deposits
          </Typography>
        </AutoSkeleton>
        <AutoSkeleton loading={loading}>
          <Typography variant="h4" color="textPrimary" whiteSpace="nowrap">
            {format(data?.deposits, { abbreviate: true, symbol: 'USD' })}
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
            Revenues
          </Typography>
        </AutoSkeleton>
        <AutoSkeleton loading={loading}>
          <Typography variant="h5" color="textPrimary" whiteSpace="nowrap">
            {format(data?.revenues, { abbreviate: true, symbol: 'USD' })}
          </Typography>
        </AutoSkeleton>
      </div>
      <div
        css={css`
          margin-left: ${INDENT_SIZE * 2}px;
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
            <Typography variant="body2" color="textSecondary">
              Staking fees
            </Typography>
          </AutoSkeleton>
          <AutoSkeleton loading={loading}>
            <Typography variant="body2" color="textSecondary">
              {format(data?.stakingFees, { abbreviate: true, symbol: 'USD' })}
            </Typography>
          </AutoSkeleton>
        </div>
        <div
          css={css`
            display: flex;
            flex-flow: row;
            justify-content: space-between;
          `}
        >
          <AutoSkeleton loading={loading}>
            <Typography variant="body2" color="textSecondary">
              Spread surplus
            </Typography>
          </AutoSkeleton>
          <AutoSkeleton loading={loading}>
            <Typography variant="body2" color="textSecondary">
              {format(data?.spreadSurplus, { abbreviate: true, symbol: 'USD' })}
            </Typography>
          </AutoSkeleton>
        </div>
      </div>
      {/* <div
        css={css`
          display: flex;
          flex-flow: row;
          justify-content: space-between;
          margin-left: ${INDENT_SIZE}px;
        `}
      >
        <Typography variant="h5" color="textPrimary" whiteSpace="nowrap">
          Transfers
        </Typography>
        <Typography variant="h5" color="textPrimary" whiteSpace="nowrap">
          {format(data.transfersIn, { abbreviate: true, symbol: 'USD' })}
        </Typography>
      </div>
      <div
        css={css`
          margin-left: ${INDENT_SIZE * 2}px;
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
          <Typography variant="body2" color="textSecondary">
            Staking fees
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {}
          </Typography>
        </div>
        <div
          css={css`
            display: flex;
            flex-flow: row;
            justify-content: space-between;
          `}
        >
          <Typography variant="body2" color="textSecondary">
            Spread surplus
          </Typography>
          <Typography variant="body2" color="textSecondary">
            0.00
          </Typography>
        </div>
      </div> */}
      <div
        css={(theme) => css`
          border: 1px solid ${theme.palette.divider};
          height: 1px;
          margin: 10px 0;
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
            Withdrawals
          </Typography>
        </AutoSkeleton>
        <AutoSkeleton loading={loading}>
          <Typography variant="h4" color="textPrimary" whiteSpace="nowrap">
            {format(data?.withdrawals, { abbreviate: true, symbol: 'USD' })}
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
            Expenses
          </Typography>
        </AutoSkeleton>
        <AutoSkeleton loading={loading}>
          <Typography variant="h5" color="textPrimary" whiteSpace="nowrap">
            {format(data?.expenses, { abbreviate: true, symbol: 'USD' })}
          </Typography>
        </AutoSkeleton>
      </div>
      <div
        css={css`
          display: flex;
          flex-flow: column;
          gap: 10px;
          margin-left: ${INDENT_SIZE * 2}px;
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
            <Typography variant="body2" color="textSecondary">
              Grants
            </Typography>
          </AutoSkeleton>
          <AutoSkeleton loading={loading}>
            <Typography variant="body2" color="textSecondary">
              {format(data?.grants, { abbreviate: true, symbol: 'USD' })}
            </Typography>
          </AutoSkeleton>
        </div>
        <div
          css={css`
            display: flex;
            flex-flow: row;
            justify-content: space-between;
          `}
        >
          <AutoSkeleton loading={loading}>
            <Typography variant="body2" color="textSecondary">
              Other spending
            </Typography>
          </AutoSkeleton>
          <AutoSkeleton loading={loading}>
            <Typography variant="body2" color="textSecondary">
              {format(data?.otherSpending, { abbreviate: true, symbol: 'USD' })}
            </Typography>
          </AutoSkeleton>
        </div>
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
          <Typography variant="h4" color="textPrimary" whiteSpace="nowrap">
            Others
          </Typography>
        </AutoSkeleton>
        <AutoSkeleton loading={loading}>
          <Typography variant="h4" color="textPrimary" whiteSpace="nowrap">
            {format(data?.otherWithdrawals, {
              abbreviate: true,
              symbol: 'USD',
            })}
          </Typography>
        </AutoSkeleton>
      </div>
      <div
        css={css`
          margin-left: ${INDENT_SIZE * 2}px;
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
          <Typography variant="body2" color="textSecondary">
            Transfer to cold wallet
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {format(data?.transferOutToColdWallet, {
              abbreviate: true,
              symbol: 'USD',
            })}
          </Typography>
        </div>
        <div
          css={css`
            display: flex;
            flex-flow: row;
            justify-content: space-between;
          `}
        >
          <Typography variant="body2" color="textSecondary">
            Lending on AAVE
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {format(data?.depositOnAave, {
              abbreviate: true,
              symbol: 'USD',
            })}
          </Typography>
        </div>
      </div>
      <div
        css={(theme) => css`
          border: 1px solid ${theme.palette.divider};
          height: 1px;
          margin: 10px 0;
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
            Net cash flow
          </Typography>
        </AutoSkeleton>
        <AutoSkeleton loading={loading}>
          <Typography variant="h4" color="textPrimary" whiteSpace="nowrap">
            {format(data?.netCashflow, { abbreviate: true, symbol: 'USD' })}
          </Typography>
        </AutoSkeleton>
      </div>
    </div>
  );
}
