import { css } from '@emotion/react';
import { ContentCopy } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import { useState } from 'react';

export interface AddressCopyButtonProps {
  address: string;
  size?: 'small' | 'medium' | 'large';
}

export function AddressCopyButton({ address, size }: AddressCopyButtonProps) {
  const [tooltipText, setTooltipText] = useState<string>(
    'Click to copy address'
  );

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
          setTimeout(() => setTooltipText('Click to copy'), 5000)
        }
      >
        <ContentCopy fontSize={size} />
      </IconButton>
    </Tooltip>
  );
}
