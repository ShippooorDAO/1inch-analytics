import styled from '@emotion/styled';
import {
  ToggleButton,
  ToggleButtonGroup,
  ToggleButtonGroupProps,
} from '@mui/material';

import { TimeWindow } from '@/shared/Model/Timeseries';

const FixedWidthToggleButton = styled(ToggleButton)`
  width: 45px;
`;

export function TimeWindowToggleButtonGroup(props: ToggleButtonGroupProps) {
  return (
    <ToggleButtonGroup {...props} exclusive>
      {/* <FixedWidthToggleButton size="small" value={TimeWindow.ONE_DAY}>
        1D
      </FixedWidthToggleButton>
      <FixedWidthToggleButton size="small" value={TimeWindow.SEVEN_DAYS}>
        7D
      </FixedWidthToggleButton>
      */}
      <FixedWidthToggleButton size="small" value={TimeWindow.ONE_MONTH}>
        1M
      </FixedWidthToggleButton>
      <FixedWidthToggleButton size="small" value={TimeWindow.THREE_MONTHS}>
        3M
      </FixedWidthToggleButton>
      <FixedWidthToggleButton size="small" value={TimeWindow.ONE_YEAR}>
        1Y
      </FixedWidthToggleButton>
      <FixedWidthToggleButton size="small" value={TimeWindow.YEAR_TO_DAY}>
        YTD
      </FixedWidthToggleButton>
      {/* <FixedWidthToggleButton size="small" value="none" disabled>
        <CalendarTodayIcon />
      </FixedWidthToggleButton> */}
    </ToggleButtonGroup>
  );
}
