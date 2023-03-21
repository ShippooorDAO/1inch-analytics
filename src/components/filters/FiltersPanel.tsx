import { css } from '@emotion/react';
import { Close } from '@mui/icons-material';
import {
  Button,
  Card,
  Dialog,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React from 'react';

export interface FiltersPanelProps {
  children: React.ReactNode;
  open: boolean;
  onClose: () => void;
  onClear?: () => void;
  onApply?: () => void;
  title?: string;
}

export function FiltersPanel({
  children,
  onClear,
  onApply,
  onClose,
  open,
  title,
}: FiltersPanelProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Dialog
      fullWidth={true}
      maxWidth={'md'}
      open={open}
      fullScreen={fullScreen}
      onClose={onClose}
    >
      <Card
        css={css`
          display: flex;
          flex-flow: column;
          justify-content: stretch;
          gap: 20px;
          padding: 20px 0;
          position: relative;
        `}
      >
        <IconButton
          css={css`
            position: absolute;
            top: 10px;
            left: 10px;
          `}
          onClick={onClose}
        >
          <Close />
        </IconButton>
        <div
          css={css`
            padding: 0 20px;
            display: flex;
            justify-content: center;
            align-items: center;
          `}
        >
          <Typography variant="h4">{title ?? 'Filters'}</Typography>
        </div>
        <div
          css={css`
            padding: 20px 20px;
            max-height: 800px;
            overflow-x: hidden;
            overflow-y: auto;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            border-top: 1px solid rgba(255, 255, 255, 0.1);
          `}
        >
          {children}
        </div>
        <div
          css={css`
            display: flex;
            justify-content: space-between;
            width: 100%;
            padding: 0 20px;
          `}
        >
          <Button
            css={
              !onClear
                ? css`
                    visibility: hidden;
                  `
                : undefined
            }
            color="primary"
            variant="text"
            onClick={onClear}
          >
            Clear all
          </Button>
          {onApply && (
            <Button color="primary" variant="contained" onClick={onApply}>
              Show results
            </Button>
          )}
        </div>
      </Card>
    </Dialog>
  );
}
