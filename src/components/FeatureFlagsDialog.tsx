import { css } from '@emotion/react';
import { Close } from '@mui/icons-material';
import { Button, IconButton, Typography } from '@mui/material';

import { staticFeatureFlags } from '@/shared/FeatureFlags/StaticFeatureFlags';

import { Card } from './HoverCard';

export interface FeatureFlagsDialogProps
  extends React.HTMLAttributes<HTMLDivElement> {
  featureFlags: Record<string, boolean | undefined>;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onClear: () => void;
}

export function FeatureFlagsDialog({
  open,
  onClose,
  onOpen,
  onClear,
  featureFlags,
}: FeatureFlagsDialogProps) {
  if (!open) {
    return (
      <Button variant="contained" color="info" onClick={onOpen}>
        <Typography variant="body2">Show Feature Flags</Typography>
      </Button>
    );
  }

  return (
    <Card
      css={css`
        padding: 20px;
        min-width: 300px;
      `}
    >
      <div
        css={css`
          display: flex;
          flex-flow: column;
          gap: 20px;
        `}
      >
        <div
          css={css`
            display: flex;
            flex-flow: row;
            justify-content: space-between;
            gap: 40px;
          `}
        >
          <Typography variant="h3">Feature Flags</Typography>
          <IconButton
            onClick={onClose}
            css={css`
              position: absolute;
              right: 10px;
              top: 10px;
            `}
          >
            <Close />
          </IconButton>
        </div>
        <div>
          {Object.entries(featureFlags).map(([key, value]) => {
            // @ts-ignore
            const staticFeatureFlagValue = staticFeatureFlags[key];
            if (!!staticFeatureFlagValue === !!value) {
              return (
                <Typography variant="body2" key={key} color="textSecondary">
                  {key}: {value ? 'true' : 'false'} (default)
                </Typography>
              );
            }

            return (
              <Typography variant="body2" key={key}>
                {key}: {staticFeatureFlagValue ? 'true' : 'false'} →{' '}
                {value ? 'true' : 'false'}
              </Typography>
            );
          })}
        </div>
        <Button variant="outlined" onClick={onClear}>
          Reset to Prod-like
        </Button>
      </div>
    </Card>
  );
}
