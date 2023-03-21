import { css } from '@emotion/react';
import { ToggleButton, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

export interface CollapsibleListProps {
  collapsible?: boolean;
  maxVisibleOptions?: number;
  elements: Array<React.ReactNode>;
  onClear: () => void;
}

export function CollapsibleList({
  collapsible,
  maxVisibleOptions,
  elements,
  onClear,
}: CollapsibleListProps) {
  const [collapsed, setCollapsed] = useState<boolean>(collapsible ?? false);
  const visibleElements =
    collapsible && collapsed && maxVisibleOptions
      ? elements?.slice(0, maxVisibleOptions)
      : elements;

  useEffect(() => {
    if (
      !collapsed &&
      maxVisibleOptions &&
      maxVisibleOptions >= elements.length
    ) {
      setCollapsed(true);
    }
  }, [elements, maxVisibleOptions, collapsed]);

  return (
    <React.Fragment>
      {visibleElements}
      {collapsible && collapsed && visibleElements.length < elements.length && (
        <ToggleButton
          value="1234"
          onClick={() => setCollapsed(false)}
          size="small"
          css={css`
            border-radius: 999px;
            width: 45px;
          `}
        >
          <Typography variant="body2">
            +{elements.length - visibleElements.length}
          </Typography>
        </ToggleButton>
      )}
      {collapsible && !collapsed && (
        <React.Fragment>
          <ToggleButton
            value="1234"
            onClick={() => setCollapsed(true)}
            size="small"
            css={css`
              border-radius: 999px;
              padding: 0 20px;
              height: 45px;
            `}
          >
            <Typography variant="body2">Show less</Typography>
          </ToggleButton>
          <ToggleButton
            value="1234"
            onClick={() => onClear()}
            size="small"
            css={css`
              border-radius: 999px;
              padding: 0 20px;
              height: 45px;
            `}
          >
            <Typography variant="body2">Clear</Typography>
          </ToggleButton>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}
