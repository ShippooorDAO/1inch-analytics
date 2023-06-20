import { css } from '@emotion/react';
import { IconButton } from '@mui/material';

export interface EtherscanButtonProps {
  address: string;
  size?: 'small' | 'medium' | 'large';
}

export function EtherscanButton({ address, size }: EtherscanButtonProps) {
  const imageHeight = (() => {
    switch (size) {
      case 'small':
        return '16px';
      case 'medium':
        return '20px';
      case 'large':
      default:
        return '30px';
    }
  })();

  return (
    <IconButton
      size={size}
      css={css`
        color: grey;
        padding: 0;
      `}
      onClick={() => {
        if (!address) {
          return;
        }
        window.open(`https://etherscan.io/address/${address}`);
      }}
    >
      <img
        height={imageHeight}
        css={(theme) => css`
          border-radius: 9999px;
          background-color: ${theme.palette.text.secondary};
        `}
        src="/vendors/etherscan.svg"
        alt=""
      />
    </IconButton>
  );
}
