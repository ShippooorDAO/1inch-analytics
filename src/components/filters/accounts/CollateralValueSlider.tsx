import { css } from '@emotion/react';
import { Slider } from '@mui/material';

import { format } from '@/shared/Utils/Format';

const minSliderTick = 0;
const maxSliderTick = 100;

function valueLabelFormat(value: number) {
  if (value === maxSliderTick) {
    return '>$100m';
  }

  if (value === minSliderTick) {
    return '<$0';
  }

  return format(calculateFilterValue(value), {
    abbreviate: true,
    symbol: 'USD',
  });
}

function calculateFilterValue(value: number) {
  return 10000 * value ** 2;
}

function calculateSliderValue(value: number) {
  return Math.sqrt(value / 10000);
}

export interface CollateralValueSliderProps {
  onChange?: ({
    minCollateralValueUsd,
    maxCollateralValueUsd,
  }: {
    minCollateralValueUsd?: number;
    maxCollateralValueUsd?: number;
  }) => void;
  onChangeCommitted?: () => void;
  value?: {
    minCollateralValueUsd?: number;
    maxCollateralValueUsd?: number;
  };
}

export function CollateralValueSlider({
  onChange,
  onChangeCommitted,
  value,
}: CollateralValueSliderProps) {
  const handleSliderChange = (event: any, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      return;
    }

    const [min, max] = newValue;
    const minCollateralValueUsd =
      min === minSliderTick ? undefined : calculateFilterValue(min);
    const maxCollateralValueUsd =
      max === maxSliderTick ? undefined : calculateFilterValue(max);

    onChange?.({ minCollateralValueUsd, maxCollateralValueUsd });
  };

  const sliderMinValue = value?.minCollateralValueUsd
    ? calculateSliderValue(value.minCollateralValueUsd)
    : minSliderTick;
  const sliderMaxValue = value?.maxCollateralValueUsd
    ? calculateSliderValue(value.maxCollateralValueUsd)
    : maxSliderTick;

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
        <div>Collateral Value</div>
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
        step={1}
        value={[sliderMinValue, sliderMaxValue]}
        valueLabelFormat={valueLabelFormat}
        min={minSliderTick}
        max={maxSliderTick}
        onChangeCommitted={onChangeCommitted}
      />
    </div>
  );
}
