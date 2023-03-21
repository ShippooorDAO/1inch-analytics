import { css } from '@emotion/react';
import { Badge, Box } from '@mui/material';
import { X as ClearIcon } from 'react-feather';

interface RemoveFiltersButtonComponentProps {
  reset: () => void;
}

export const RemoveFiltersButton = ({
  reset,
}: RemoveFiltersButtonComponentProps) => {
  return (
    <Badge
      onClick={reset}
      anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
      css={css`
        z-index: 5;
        position: absolute;
        align-items: center;
        justify-content: center;
        top: -10px;
        left: -10px;
        height: 20px;
        min-width: 20px;
        background-color: #f44336;
        white-space: nowrap;
        text-align: center;
        border-radius: 12px;
        cursor: pointer;
      `}
    >
      <Box
        css={css`
          display: flex;
          color: #fff;
        `}
      >
        <ClearIcon
          css={css`
            width: 15px;
            height: 15px;
          `}
        />
      </Box>
    </Badge>
  );
};
