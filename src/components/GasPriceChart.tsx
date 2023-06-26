import { css } from '@emotion/react';
import { Typography, useTheme } from '@mui/material';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Line, LineChart, Tooltip } from 'recharts';

import { TimedGasPrice } from '@/shared/UniswapV3Subgraph/UniswapV3SubgraphProvider';

import { AutoSkeleton } from './AutoSkeleton';

export interface GasPriceChartProps {
  data?: TimedGasPrice[];
}

export function GasPriceChart({ data }: GasPriceChartProps) {
  const muiTheme = useTheme();
  const latestGasPrice = data?.[data.length - 1] ?? {
    timestamp: 0,
    gasPrice: 0,
  };
  const [position, setPosition] = useState<TimedGasPrice>();

  useEffect(() => {
    if (!data) {
      return;
    }
    setPosition(latestGasPrice);
  }, [data, latestGasPrice]);

  const loading = data === undefined || data?.length === 0;

  return (
    <div
      css={css`
        position: relative;
      `}
    >
      <div
        css={css`
          display: flex;
          justify-content: space-between;
        `}
      >
        <div
          css={css`
            display: flex;
            flex-flow: column;
            min-height: 40px;
          `}
        >
          <AutoSkeleton loading={loading}>
            <Typography variant="body1">
              {position ? `${position.gasPrice.toFixed(0)} gwei` : ''}
            </Typography>
          </AutoSkeleton>
          <AutoSkeleton loading={loading}>
            <Typography variant="body1">
              {position
                ? `${moment.unix(position.timestamp).format('HH:mm:ss')}`
                : ''}
            </Typography>
          </AutoSkeleton>
        </div>
        <AutoSkeleton loading={loading}>
          <Typography variant="body1" color="textSecondary">
            Average
          </Typography>
        </AutoSkeleton>
      </div>
      <AutoSkeleton loading={loading}>
        <LineChart
          width={230}
          height={100}
          data={data}
          onMouseMove={(mouseMove: any) => {
            setPosition(
              data?.[mouseMove.activeTooltipIndex] ?? {
                timestamp: 0,
                gasPrice: 0,
              }
            );
          }}
          onMouseLeave={() => setPosition(latestGasPrice)}
        >
          <Tooltip content={<div />} />
          <Line
            type="monotone"
            dataKey="gasPrice"
            stroke={muiTheme.palette.primary.main}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </AutoSkeleton>
    </div>
  );
}
