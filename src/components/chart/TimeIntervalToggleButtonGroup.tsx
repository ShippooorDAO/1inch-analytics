import { css } from '@emotion/react';
import {
  ToggleButton,
  ToggleButtonGroup,
  ToggleButtonGroupProps,
} from '@mui/material';

import { TimeInterval } from '@/shared/Model/Timeseries';

export interface TimeIntervalToggleButtonGroupProps
  extends ToggleButtonGroupProps {
  options: { value: TimeInterval; label: string }[];
}

export function TimeIntervalToggleButtonGroup({
  options,
  ...props
}: TimeIntervalToggleButtonGroupProps) {
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
          `}
        >
          {label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
