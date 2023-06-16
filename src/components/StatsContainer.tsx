import { css } from '@emotion/react';
import { Typography } from '@mui/material';
import { lighten, rgba } from 'polished';

import { SlimMetricsCard, SlimMetricsCardProps } from './MetricsCard';

export interface StatsContainerProps {
  title?: React.ReactNode;
  headerMetrics?: SlimMetricsCardProps[];
  headerMetricsPerRow?: number;
  backgroundImageUrl?: string;
  leftContainer: {
    title: React.ReactNode;
    content: React.ReactNode;
  };
  rightContainer: {
    title: React.ReactNode;
    content: React.ReactNode;
  };
  reversed?: boolean;
}

export function StatsContainer({
  title,
  backgroundImageUrl,
  headerMetrics,
  headerMetricsPerRow: headerMetricsPerRow_,
  leftContainer,
  rightContainer,
  reversed,
}: StatsContainerProps) {
  const headerMetricsPerRow =
    headerMetricsPerRow_ ?? headerMetrics?.length ?? 0;
  const leftContainerNode = (
    <div
      css={(theme) => css`
        display: flex;
        flex-flow: column;
        gap: 20px;
        border: 1px solid ${theme.palette.divider};
        border-radius: 24px;
        background-color: ${lighten(0.05, theme.palette.background.paper)};
        padding: 16px;
        width: calc(100% - 420px);
        ${theme.breakpoints.down('lg')} {
          width: 100%;
        }
      `}
    >
      <Typography variant="h3">{leftContainer.title}</Typography>
      <div
        css={css`
          width: 100%;
        `}
      >
        {leftContainer.content}
      </div>
    </div>
  );

  const rightContainerNode = (
    <div
      css={(theme) => css`
        display: flex;
        flex-flow: column;
        gap: 20px;
        background-color: ${lighten(0.05, theme.palette.background.paper)};
        border: 1px solid ${theme.palette.divider};
        border-radius: 24px;
        justify-content: space-between;
        padding: 16px;
        width: 400px;
        ${theme.breakpoints.down('lg')} {
          width: 100%;
        }
      `}
    >
      <Typography variant="h3">{rightContainer.title}</Typography>
      {rightContainer.content}
    </div>
  );

  return (
    <div
      css={(theme) => css`
        position: relative;
        border-radius: 24px;
        background-color: ${rgba(theme.palette.background.paper, 1)};
        z-index: 2;
      `}
    >
      {backgroundImageUrl && (
        <img
          alt="none"
          src={backgroundImageUrl}
          css={css`
            position: absolute;
            border-radius: 24px;
            left: 0;
            top: 0;
            width: 100%;
            z-index: -1;
            opacity: 0.5;
          `}
        />
      )}
      {headerMetrics && title && (
        <div
          css={(theme) => css`
            display: flex;
            flex-flow: row;
            ${theme.breakpoints.down('md')} {
              flex-flow: column;
            }
            padding: 20px 20px 0 20px;
            gap: 20px;
            justify-content: space-between;
            border-top-left-radius: 24px;
            border-top-right-radius: 24px;
            align-items: flex-start;
          `}
        >
          {title || <div></div>}
          <div
            css={css`
              display: flex;
              flex-flow: column;
              gap: 20px;
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
                  gap: 20px;
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
          <div></div>
        </div>
      )}
      <div
        css={css`
          display: flex;
          flex-flow: row;
          justify-content: flex-start;
          gap: 20px;
          flex-wrap: wrap;
          padding: 20px 20px 20px 20px;
        `}
      >
        {!reversed ? (
          <>
            {leftContainerNode}
            {rightContainerNode}
          </>
        ) : (
          <>
            {rightContainerNode}
            {leftContainerNode}
          </>
        )}
      </div>
    </div>
  );
}
