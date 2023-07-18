import { css } from '@emotion/react';
import { IconButton, Tooltip } from '@mui/material';
import { useState } from 'react';

export interface AddressCopyButtonProps {
  address: string;
  size?: 'small' | 'medium' | 'large';
  contentType?: 'address' | 'transaction';
}

export function AddressCopyButton({
  address,
  size,
  contentType,
}: AddressCopyButtonProps) {
  const { clickToCopyLabel, successMessage } = (() => {
    switch (contentType) {
      case 'address':
        return {
          clickToCopyLabel: 'Click to copy address',
          successMessage: 'Address copied!',
        };
      case 'transaction':
        return {
          clickToCopyLabel: 'Click to copy transaction hash',
          successMessage: 'Transaction hash copied!',
        };
      default:
        return {
          clickToCopyLabel: 'Click to copy',
          successMessage: 'Copied!',
        };
    }
  })();

  const [tooltipText, setTooltipText] = useState<string>(clickToCopyLabel);

  const handleCopyButton = () => {
    if (!address) {
      return;
    }
    navigator.clipboard.writeText(address);
    setTooltipText('Address copied!');
  };

  return (
    <Tooltip title={tooltipText} placement="bottom">
      <IconButton
        size={size}
        css={(theme) => css`
          color: ${theme.palette.text.secondary};
          padding: 0;
        `}
        onClick={() => handleCopyButton()}
        onMouseOut={() =>
          setTimeout(() => setTooltipText(successMessage), 5000)
        }
      >
        <img height="24px" width="24px" src="/copy.svg" alt="copy" />
      </IconButton>
    </Tooltip>
  );
}
