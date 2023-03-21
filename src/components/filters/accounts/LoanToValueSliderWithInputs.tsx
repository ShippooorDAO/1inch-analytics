import { css } from '@emotion/react';
import { TextField } from '@mui/material';

import { LoanToValueSlider } from './LoanToValueSlider';

export interface LoanToValueSliderWithInputsProps {
  onChange?: ({ minLtv, maxLtv }: { minLtv?: number; maxLtv?: number }) => void;
  onChangeCommitted?: () => void;
  value?: { minLtv?: number; maxLtv?: number };
}

export function LoanToValueSliderWithInputs({
  onChange,
  onChangeCommitted,
  value,
}: LoanToValueSliderWithInputsProps) {
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
        value={value?.minLtv ?? ''}
        onChange={(e) => {
          onChange?.({
            ...value,
            minLtv: Number(e.target.value),
          });
          onChangeCommitted?.();
        }}
      />
      <LoanToValueSlider
        onChange={onChange}
        value={value}
        onChangeCommitted={onChangeCommitted}
      />
      <TextField
        inputProps={{
          cs: css`
            text-align: center;
          `,
        }}
        size="small"
        variant="outlined"
        value={value?.maxLtv ?? ''}
        onChange={(e) => {
          onChange?.({
            ...value,
            maxLtv: Number(e.target.value),
          });
          onChangeCommitted?.();
        }}
      />
    </div>
  );
}
