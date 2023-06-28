import { css } from '@emotion/react';
import { Typography } from '@mui/material';
import { rgba } from 'polished';

import { SlimMetricsCard, SlimMetricsCardProps } from './MetricsCard';

export enum StatsContainerLayout {
  SINGLE,
  ONE_HALF_ONE_HALF,
  ONE_THIRD_TWO_THIRDS,
  TWO_THIRDS_ONE_THIRD,
}

export interface StatsContainerProps {
  title?: React.ReactNode;
  headerMetrics?: SlimMetricsCardProps[];
  headerMetricsPerRow?: number;
  leftContainer?: {
    title?: React.ReactNode;
    content: React.ReactNode;
  };
  rightContainer?: {
    title?: React.ReactNode;
    content: React.ReactNode;
  };
  layout?: StatsContainerLayout;
}

export function StatsContainer({
  title,
  headerMetrics,
  headerMetricsPerRow: headerMetricsPerRow_,
  leftContainer,
  rightContainer,
  layout = StatsContainerLayout.TWO_THIRDS_ONE_THIRD,
}: StatsContainerProps) {
  const headerMetricsPerRow =
    headerMetricsPerRow_ ?? headerMetrics?.length ?? 0;
  const leftContainerNode = leftContainer ? (
    <div
      css={(theme) => [
        css`
          display: flex;
          flex-flow: column;
          gap: 20px;
          border-radius: 24px;
          background-color: ${rgba(theme.palette.background.paper, 1)};
          padding: 16px;
          width: calc(100% - 420px);
          ${theme.breakpoints.down('md')} {
            width: 100%;
          }
        `,
        layout === StatsContainerLayout.SINGLE &&
          css`
            width: 100%;
          `,
        layout === StatsContainerLayout.ONE_THIRD_TWO_THIRDS &&
          css`
            width: 400px;
          `,
        layout === StatsContainerLayout.ONE_HALF_ONE_HALF &&
          css`
            width: calc(50% - 10px);
          `,
      ]}
    >
      {leftContainer.title && (
        <Typography variant="h3">{leftContainer.title}</Typography>
      )}
      <div
        css={css`
          width: 100%;
        `}
      >
        {leftContainer.content}
      </div>
    </div>
  ) : (
    <> </>
  );

  const rightContainerNode = rightContainer ? (
    <div
      css={(theme) => [
        css`
          display: flex;
          flex-flow: column;
          gap: 20px;
          background-color: ${rgba(theme.palette.background.paper, 1)};
          border-radius: 24px;
          justify-content: space-between;
          padding: 16px;
          ${theme.breakpoints.down('md')} {
            width: 100%;
          }
        `,
        layout === StatsContainerLayout.SINGLE &&
          css`
            width: 100%;
          `,
        layout === StatsContainerLayout.TWO_THIRDS_ONE_THIRD &&
          css`
            width: 400px;
          `,
        layout === StatsContainerLayout.ONE_THIRD_TWO_THIRDS &&
          css`
            width: calc(100% - 420px);
          `,
        layout === StatsContainerLayout.ONE_HALF_ONE_HALF &&
          css`
            width: calc(50% - 10px);
          `,
      ]}
    >
      {rightContainer.title && (
        <Typography variant="h3">{rightContainer.title}</Typography>
      )}
      {rightContainer.content}
    </div>
  ) : (
    <> </>
  );

  return (
    <div
      css={css`
        display: flex;
        flex-flow: column;
        gap: 16px;
      `}
    >
      {headerMetrics && title && (
        <div
          css={(theme) => css`
            display: flex;
            flex-flow: row;
            ${theme.breakpoints.down('md')} {
              flex-flow: column;
            }
            padding: 10px 20px 0 20px;
            gap: 10px;
            justify-content: space-between;
            border-top-left-radius: 24px;
            border-top-right-radius: 24px;
            align-items: flex-start;
          `}
        >
          <div
            css={css`
              margin-top: 10px;
            `}
          >
            {title || <div></div>}
          </div>
          <div
            css={css`
              display: flex;
              flex-flow: column;
            `}
          >
            {Array.from({
              length: Math.ceil(
                (headerMetrics?.length ?? 0) / headerMetricsPerRow + 1
              ),
            }).map((_, i) => (
              <div
                key={i}
                css={css`
                  display: flex;
                  flex-flow: row;
                  align-items: center;
                  justify-content: center;
                  flex-wrap: wrap;
                  gap: 16px;
                  width: 100%;
                `}
              >
                {headerMetrics &&
                  headerMetrics
                    .slice(headerMetricsPerRow * i, headerMetricsPerRow)
                    .map((metricsProps, i) => (
                      <SlimMetricsCard key={i} {...metricsProps} />
                    ))}
              </div>
            ))}
          </div>
          <div
            css={(theme) => css`
              visibility: hidden;
              ${theme.breakpoints.down('md')} {
                display: none;
              }
            `}
          >
            {title}
          </div>
        </div>
      )}
      <div
        css={css`
          display: flex;
          flex-flow: row;
          justify-content: flex-start;
          gap: 16px;
          flex-wrap: wrap;
        `}
      >
        {leftContainerNode}
        {rightContainerNode}
      </div>
    </div>
  );
}
