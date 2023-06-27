import { css } from '@emotion/react';
import {
  ToggleButton,
  ToggleButtonGroup,
  ToggleButtonGroupProps,
} from '@mui/material';

import { TimeWindow } from '@/shared/Model/Timeseries';

export interface TimeWindowToggleButtonGroupProps
  extends ToggleButtonGroupProps {
  options: { value: TimeWindow; label: string }[];
}

export function TimeWindowToggleButtonGroup({
  options,
  ...props
}: TimeWindowToggleButtonGroupProps) {
  return (
    <ToggleButtonGroup {...props} exclusive>
      {options.map(({ value, label }) => (
        <ToggleButton
          key={value}
          value={value}
          size="small"
          css={css`
            padding-left: 10px;
            padding-right: 10px;
            white-space: nowrap;
          `}
        >
          {label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
