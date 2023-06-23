import { css } from '@emotion/react';
import { IconButton, Tooltip } from '@mui/material';

import { ChainId } from '@/shared/Model/Chain';
import {
  EtherscanLinkType,
  getBlockExplorerName,
  getEtherscanIcon,
  getEtherscanLink,
} from '@/shared/Utils/Etherscan';

export interface EtherscanButtonProps {
  address: string;
  chainId?: ChainId;
  linkType?: EtherscanLinkType;
  size?: 'small' | 'medium' | 'large';
}

export function EtherscanButton({
  address,
  linkType,
  chainId,
  size,
}: EtherscanButtonProps) {
  const imageHeight = size === 'small' ? '20px' : '30px';

  const link = getEtherscanLink(address, chainId, linkType);
  const blockExplorerName = getBlockExplorerName(chainId);

  return (
    <Tooltip title={`Open on ${blockExplorerName}`} placement="bottom">
      <a href={link} target="_blank" rel="noreferrer">
        <IconButton
          size={size}
          css={css`
            color: grey;
            padding: 0;
          `}
        >
          <img
            height={imageHeight}
            css={(theme) => css`
              border-radius: 9999px;
              background-color: ${chainId === undefined ||
              chainId === ChainId.ETHEREUM
                ? theme.palette.text.secondary
                : 'none'};
            `}
            src={getEtherscanIcon(chainId)}
            alt=""
          />
        </IconButton>
      </a>
    </Tooltip>
  );
}
