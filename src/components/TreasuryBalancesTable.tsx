import { css } from '@emotion/react';
import { Typography } from '@mui/material';
import { lighten, rgba } from 'polished';

import { AutoSkeleton } from '@/components/AutoSkeleton';
import { useTreasuryBalances } from '@/hooks/useTreasuryBalances';
import { format } from '@/shared/Utils/Format';

import { SlimAssetTableCell } from './table/SlimAssetTableCell';

export function TreasuryBalancesTable() {
  const { treasury, loading, mock } = useTreasuryBalances();

  const displayedRows =
    !loading && treasury?.positions ? treasury.positions : mock?.positions;

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
          padding: 10px;
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
          <Typography variant="h4">Portfolio</Typography>
          <Typography variant="body2" color="textSecondary">
            Total Value: &nbsp;
            {treasury?.totalValueUsd?.toDisplayString({ abbreviate: true })}
          </Typography>
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
            <Typography variant="subtitle1" color="textSecondary">
              No positions found
            </Typography>
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
              overflow: hidden;
              justify-content: space-between;
              padding: 10px 20px;
              border-radius: 16px;
              position: relative;
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
              <AutoSkeleton loading={!row.asset}>
                <SlimAssetTableCell asset={row.asset!} />
              </AutoSkeleton>
            </div>
            <div
              css={css`
                width: 200px;
              `}
            >
              <Typography variant="body2" align="right">
                {row.amount?.toDisplayString()}
              </Typography>
            </div>
            <div
              css={css`
                width: 200px;
              `}
            >
              <Typography variant="body2" align="right">
                {row.amountUsd?.toDisplayString()}
              </Typography>
            </div>

            <div
              css={css`
                width: 160px;
                position: relative;
              `}
            >
              <Typography variant="body2" align="right">
                {format(row.share, { symbol: '%' })}
              </Typography>
            </div>
            <div
              css={(theme) => css`
                position: absolute;
                background-color: ${rgba(theme.palette.primary.main, 0.07)};
                bottom: 0;
                overflow: hidden;
                right: 0;
                width: calc(${row.share * 100}%);
                height: 100%;
                border-radius: 4px;
              `}
            >
              <div
                css={(theme) => css`
                  position: absolute;
                  background-color: ${theme.palette.primary.main};
                  bottom: 0;
                  right: 0;
                  width: 100%;
                  height: 5px;
                `}
              ></div>
            </div>
            <div
              css={(theme) => css`
                position: absolute;
                background-color: ${rgba(theme.palette.primary.main, 0.07)};
                bottom: 0;
                right: 0;
                width: 100%;
                height: 5px;
                border-radius: 5px;
              `}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
}
