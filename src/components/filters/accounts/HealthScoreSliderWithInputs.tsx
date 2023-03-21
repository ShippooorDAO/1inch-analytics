import { css } from '@emotion/react';
import { TextField } from '@mui/material';

import { HealthScoreSlider } from './HealthScoreSlider';

export interface HealthScoreSliderWithInputsProps {
  onChange?: ({
    minHealthScore,
    maxHealthScore,
  }: {
    minHealthScore?: number;
    maxHealthScore?: number;
  }) => void;
  onChangeCommitted?: () => void;
  value?: { minHealthScore?: number; maxHealthScore?: number };
}

export function HealthScoreSliderWithInputs({
  onChange,
  onChangeCommitted,
  value,
}: HealthScoreSliderWithInputsProps) {
  return (
    <div
      css={css`
        display: flex;
        flex-flow: row;
        align-items: flex-end;
        gap: 40px;
      `}
    >
      <TextField
        inputProps={{
          css: css`
            text-align: center;
          `,
        }}
        size="small"
        variant="outlined"
        value={value?.minHealthScore ?? ''}
        onChange={(e) => {
          onChange?.({
            ...value,
            minHealthScore: Number(e.target.value),
          });
          onChangeCommitted?.();
        }}
      />
      <HealthScoreSlider
        onChange={onChange}
        onChangeCommitted={onChangeCommitted}
        value={value}
      />
      <TextField
        inputProps={{
          css: css`
            text-align: center;
            border-radius: 999px;
          `,
        }}
        size="small"
        variant="outlined"
        value={value?.maxHealthScore ?? ''}
        css={css`
          border-radius: 999px;
        `}
        onChange={(e) => {
          onChange?.({
            ...value,
            maxHealthScore: Number(e.target.value),
          });
          onChangeCommitted?.();
        }}
      />
    </div>
  );
}
