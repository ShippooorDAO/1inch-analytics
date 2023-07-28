import { css } from '@emotion/react';
import {
  ToggleButton,
  ToggleButtonGroup,
  ToggleButtonGroupProps,
} from '@mui/material';

import { StakingWalletVersion } from '@/shared/Model/StakingWallet';

export interface StakingVersionToggleButtonGroupProps
  extends ToggleButtonGroupProps {
  options: { value: StakingWalletVersion; label: string }[];
}

export function StakingVersionToggleButtonGroup({
  options,
  ...props
}: StakingVersionToggleButtonGroupProps) {
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
