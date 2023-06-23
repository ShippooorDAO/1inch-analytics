import { css } from '@emotion/react';
import { Typography } from '@mui/material';
import { lighten, rgba } from 'polished';

import { SlimMetricsCard, SlimMetricsCardProps } from './MetricsCard';

export interface StatsSingleContainerProps {
  title?: React.ReactNode;
  headerMetrics?: SlimMetricsCardProps[];
  headerMetricsPerRow?: number;
  backgroundImageUrl?: string;
  container: {
    title: React.ReactNode;
    content: React.ReactNode;
  };
}

export function StatsSingleContainer({
  title,
  backgroundImageUrl,
  headerMetrics,
  headerMetricsPerRow: headerMetricsPerRow_,
  container,
}: StatsSingleContainerProps) {
  const headerMetricsPerRow =
    headerMetricsPerRow_ ?? headerMetrics?.length ?? 0;

  return (
    <div
      css={(theme) => css`
        width: 100%;
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
        <div
          css={(theme) => css`
            display: flex;
            flex-flow: column;
            gap: 20px;
            border-radius: 24px;
            background-color: ${lighten(0.05, theme.palette.background.paper)};
            padding: 16px;
            width: 100%;
            ${theme.breakpoints.down('md')} {
              width: 100%;
            }
          `}
        >
          <Typography variant="h3">{container.title}</Typography>
          <div
            css={css`
              width: 100%;
            `}
          >
            {container.content}
          </div>
        </div>
      </div>
    </div>
  );
}
