import { css } from '@emotion/react';
import { Checkbox, ToggleButton } from '@mui/material';
import React, { useEffect, useState } from 'react';

import { CollapsibleList } from './CollapsibleList';

export interface BaseToggleButtonsProps<T>
  extends React.HTMLAttributes<HTMLDivElement> {
  collapsible?: boolean;
  maxVisibleOptions?: number;
  values: T[];
  onValuesChange: (value: T[]) => void;
  options: Array<{ key: string; label: React.ReactNode; value: T }>;
}

export function BaseToggleButtons<T>({
  options,
  onValuesChange,
  values,
  collapsible,
  maxVisibleOptions,
  ...props
}: BaseToggleButtonsProps<T>) {
  const [collapsed, setCollapsed] = useState<boolean>(collapsible ?? false);
  const handleClick = (option: { key: string; value: T }) => {
    if (values.includes(option.value)) {
      onValuesChange(
        values.filter((individualValue) => option.value !== individualValue)
      );
    } else {
      onValuesChange([...values, option.value]);
    }
  };

  const visibleOptions =
    collapsible && collapsed && maxVisibleOptions
      ? options?.slice(0, maxVisibleOptions)
      : options;

  useEffect(() => {
    if (!collapsed && maxVisibleOptions && maxVisibleOptions >= values.length) {
      setCollapsed(true);
    }
  }, [values, maxVisibleOptions, collapsed]);

  return (
    <div
      css={css`
        display: flex;
        flex-flow: row;
        flex-wrap: wrap;
        gap: 10px;
        justify-content: center;
        flex-wrap: nowrap;
      `}
      {...props}
    >
      <CollapsibleList
        collapsible={collapsible}
        maxVisibleOptions={maxVisibleOptions}
        onClear={() => onValuesChange([])}
        elements={visibleOptions?.map((option) => (
          <ToggleButton
            key={option.key}
            value={option.key}
            size="small"
            color="primary"
            selected={values.includes(option.value)}
            onClick={() => handleClick(option)}
            css={css`
              border-radius: 10px;
              padding-left: 15px;
              padding-right: 20px;
              text-transform: capitalize;
            `}
          >
            <div
              css={css`
                display: flex;
                flex-flow: row;
                align-items: center;
                justify-content: center;
              `}
            >
              <Checkbox
                css={css`
                  padding: 0;
                  margin-left: -8px;
                  margin-right: 3px;
                `}
                checked={values.includes(option.value)}
              />
              {option.label}
            </div>
          </ToggleButton>
        ))}
      />
    </div>
  );
}
