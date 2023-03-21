import { css } from '@emotion/react';
import { Typography, useTheme } from '@mui/material';
import { green, red, yellow } from '@mui/material/colors';
import { rgba } from 'polished';

import { format } from '@/shared/Utils/Format';

const MIN_GAUGE_POSITION = 0.08;
const MAX_GAUGE_POSITION = 1;

interface HealthScoreGaugeProps {
  healthScore?: number | null;
  simulatedHealthScore?: number | null;
}

function calculatePosition(healthScore?: number | null) {
  if (healthScore === undefined || healthScore === null) {
    return MIN_GAUGE_POSITION;
  }
  if (healthScore === Number.POSITIVE_INFINITY) {
    return MAX_GAUGE_POSITION;
  }
  if (healthScore === 0) {
    return MIN_GAUGE_POSITION;
  }
  return MAX_GAUGE_POSITION / (1 + Math.exp(-1 * (healthScore * 2.2 - 3.5)));
}

function getGaugeColor(healthScore?: number | null) {
  if (healthScore === undefined || healthScore === null) {
    return red[900];
  }

  if (healthScore < 1.2) {
    return red[900];
  }

  if (healthScore < 1.5) {
    return yellow[200];
  }

  return green[300];
}

export function HealthScoreGauge({
  healthScore,
  simulatedHealthScore,
}: HealthScoreGaugeProps) {
  const theme = useTheme();

  const gaugePosition = calculatePosition(healthScore);
  const simulatedGaugePosition = calculatePosition(simulatedHealthScore);

  const gaugeWidth = Math.floor(gaugePosition * 100);
  const simulatedGaugeWidth = Math.floor(simulatedGaugePosition * 100);

  return (
    <div
      css={css`
        background-color: ${theme.palette.background.default};
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
        height: 40px;
        width: 100%;
      `}
    >
      <div
        css={css`
          background: linear-gradient(
            90deg,
            ${rgba(getGaugeColor(healthScore), 0.1)} 0%,
            ${rgba(getGaugeColor(healthScore), 0.5)} 100%
          );

          border-top-right-radius: 10px;
          border-bottom-right-radius: 10px;
          display: flex;
          justify-content: flex-end;
          padding-right: 20px;
          height: ${simulatedHealthScore ? '50%' : '100%'};
          width: ${gaugeWidth}%;
          align-items: center;
        `}
      >
        <Typography variant="body2" fontWeight={900}>
          {format(healthScore)}
        </Typography>
      </div>
      {simulatedHealthScore && (
        <div
          css={css`
            background: linear-gradient(
              90deg,
              ${rgba(theme.palette.primary.main, 0.1)} 0%,
              ${rgba(theme.palette.primary.main, 1)} 100%
            );
            border-top-right-radius: 10px;
            border-bottom-right-radius: 10px;
            display: flex;
            justify-content: flex-end;
            padding-right: 20px;
            height: 50%;
            width: ${simulatedGaugeWidth}%;
            align-items: center;
          `}
        >
          <Typography variant="body2" fontWeight={900}>
            Simulated:{' '}
            {simulatedHealthScore !== 0 ? simulatedHealthScore.toFixed(2) : ''}
          </Typography>
        </div>
      )}
    </div>
  );
}
