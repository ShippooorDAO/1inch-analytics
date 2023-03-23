import { css } from '@emotion/react';
import {
  ToggleButton,
  ToggleButtonGroup,
  ToggleButtonGroupProps,
} from '@mui/material';

import { TimeInterval } from '@/shared/Model/Timeseries';

export function TimeIntervalToggleButtonGroup(props: ToggleButtonGroupProps) {
  return (
    <ToggleButtonGroup {...props} exclusive>
      <ToggleButton
        css={css`
          padding-left: 10px;
          padding-right: 10px;
        `}
        size="small"
        value={TimeInterval.DAILY}
      >
        Daily
      </ToggleButton>
      <ToggleButton
        css={css`
          padding-left: 10px;
          padding-right: 10px;
        `}
        size="small"
        value={TimeInterval.WEEKLY}
      >
        Weekly
      </ToggleButton>
      <ToggleButton
        css={css`
          padding-left: 10px;
          padding-right: 10px;
        `}
        size="small"
        value={TimeInterval.MONTHLY}
      >
        Monthly
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
