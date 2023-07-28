import { css } from '@emotion/react';
import { Typography } from '@mui/material';
import { lighten, rgba } from 'polished';

import { AutoSkeleton } from '@/components/loading/AutoSkeleton';
import { TreasuryBalances } from '@/shared/Model/TreasuryBalances';
import { format } from '@/shared/Utils/Format';

import { SlimAssetTableCell } from './SlimAssetTableCell';

interface TreasuryBalancesTableProps {
  data?: TreasuryBalances;
  mockData?: TreasuryBalances;
  loading?: boolean;
}

export function TreasuryBalancesTable({
  data,
  mockData,
  loading,
}: TreasuryBalancesTableProps) {
  const displayedRows =
    !loading && data?.positions ? data.positions : mockData?.positions;

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
          //   padding: 10px;
          height: 100%;
        `}
      >
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
              <AutoSkeleton loading={loading || !row.asset}>
                <SlimAssetTableCell asset={row.asset!} />
              </AutoSkeleton>
            </div>
            <div
              css={(theme) => css`
                width: 300px;
                ${theme.breakpoints.down('lg')} {
                  display: none;
                }
              `}
            >
              <AutoSkeleton loading={loading}>
                <Typography variant="body2" align="right">
                  {row.amount?.toDisplayString()}
                </Typography>
              </AutoSkeleton>
            </div>
            <div
              css={css`
                width: 140px;
              `}
            >
              <AutoSkeleton loading={loading}>
                <Typography variant="body2" align="right">
                  {row.amountUsd?.toDisplayString()}
                </Typography>
              </AutoSkeleton>
            </div>
            <div
              css={css`
                width: 60px;
                position: relative;
                display: flex;
                flex-flow: row;
                justify-content: flex-end;
              `}
            >
              <div
                css={(theme) =>
                  css`
                    display: flex;
                    border-radius: 10px;
                    padding: 6px;
                    margin: -8px;
                    background-color: ${theme.palette.background.paper};
                    z-index: 2;
                  `
                }
              >
                <AutoSkeleton loading={loading}>
                  <Typography variant="body2" align="right">
                    {format(row.share, { symbol: '%', decimals: 1 })}
                  </Typography>
                </AutoSkeleton>
              </div>
            </div>
            {!loading && (
              <>
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
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
