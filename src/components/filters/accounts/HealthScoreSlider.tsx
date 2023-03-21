import { css } from '@emotion/react';
import { Slider } from '@mui/material';

const minSliderTick = 0;
const maxSliderTick = 10;

function valueLabelFormat(value: number) {
  if (value === maxSliderTick) {
    return `>${value.toFixed(2)}`;
  }

  if (value === minSliderTick) {
    return `<${value.toFixed(2)}`;
  }

  return value.toFixed(2);
}

export interface HealthScoreSliderProps {
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

export function HealthScoreSlider({
  onChange,
  onChangeCommitted,
  value,
}: HealthScoreSliderProps) {
  const handleSliderChange = (event: any, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      return;
    }

    const [min, max] = newValue;
    const minHealthScore = min === minSliderTick ? undefined : min;
    const maxHealthScore = max === maxSliderTick ? undefined : max;

    onChange?.({ minHealthScore, maxHealthScore });
  };

  const sliderMinValue = value?.minHealthScore ?? minSliderTick;
  const sliderMaxValue = value?.maxHealthScore ?? maxSliderTick;

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
        <div>Health Score</div>
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
