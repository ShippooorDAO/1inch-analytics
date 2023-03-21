import { css } from '@emotion/react';
import { Slider } from '@mui/material';

const minSliderTick = 0;
const maxSliderTick = 3;

function valueLabelFormat(value: number) {
  if (value === maxSliderTick) {
    return `>${value.toFixed(2)}`;
  }

  if (value === minSliderTick) {
    return `<${value.toFixed(2)}`;
  }
  return value.toFixed(2);
}

export interface LoanToValueSliderProps {
  onChange?: ({ minLtv, maxLtv }: { minLtv?: number; maxLtv?: number }) => void;
  onChangeCommitted?: () => void;
  value?: { minLtv?: number; maxLtv?: number };
}

export function LoanToValueSlider({
  onChange,
  onChangeCommitted,
  value,
}: LoanToValueSliderProps) {
  const handleSliderChange = (event: any, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      return;
    }

    const [min, max] = newValue;
    const minLtv = min === minSliderTick ? undefined : min;
    const maxLtv = max === maxSliderTick ? undefined : max;

    onChange?.({ minLtv, maxLtv });
  };

  const sliderMinValue = value?.minLtv ?? minSliderTick;
  const sliderMaxValue = value?.maxLtv ?? maxSliderTick;

  return (
    <div
      css={css`
        display: flex;
        flex-flow: column;
        width: 100%;
      `}
    >
      <div
        css={css`
          display: flex;
          flex-flow: row;
          justify-content: space-between;
        `}
      >
        <div
          css={css`
            width: 40px;
          `}
        >
          {valueLabelFormat(sliderMinValue)}
        </div>
        <div>Loan to Value</div>
        <div
          css={css`
            width: 40px;
          `}
        >
          {valueLabelFormat(sliderMaxValue)}
        </div>
      </div>
      <Slider
        onChange={handleSliderChange}
        step={0.01}
        value={[sliderMinValue, sliderMaxValue]}
        valueLabelFormat={valueLabelFormat}
        min={minSliderTick}
        max={maxSliderTick}
        onChangeCommitted={onChangeCommitted}
      />
    </div>
  );
}
