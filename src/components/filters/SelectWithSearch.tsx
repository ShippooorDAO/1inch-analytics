import { css, Interpolation, Theme } from '@emotion/react';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import {
  Button,
  Card,
  Checkbox,
  Chip,
  ClickAwayListener,
  Fade,
  Popper,
  PopperPlacementType,
  Radio,
  Typography,
} from '@mui/material';
import { rgba } from 'polished';
import React, { useEffect, useRef, useState } from 'react';

import { SearchInput } from '@/components/filters/SearchInput';

interface OptionRowProps<T> {
  option: SelectWithSearchOption<T>;
  onClick: (option: SelectWithSearchOption<T>) => void;
  multiple: boolean;
  checked?: boolean;
  index: number;
}

function OptionRow<T>({
  option,
  onClick,
  multiple,
  checked,
  index,
}: OptionRowProps<T>) {
  return (
    <div
      key={option.key}
      css={(theme) => [
        css`
          display: flex;
          flex-flow: row;
          align-items: center;
          cursor: pointer;
          border-radius: 10px;
          gap: 5px;
          justify-content: flex-start;
          background-color: ${rgba(theme.palette.material.primary[500], 0.2)};
          &:hover {
            background-color: ${rgba(theme.palette.material.primary[500], 0.3)};
          }
        `,
        index % 2 === 0 &&
          css`
            background-color: ${rgba(theme.palette.material.primary[500], 0.1)};
          `,
      ]}
      onClick={() => {
        onClick(option);
      }}
    >
      {!multiple ? (
        <Radio key={option.key} checked={checked} />
      ) : (
        <Checkbox key={option.key} checked={checked} />
      )}
      {option.label}
    </div>
  );
}

export interface SelectWithSearchOption<T> {
  key: string;
  value: T;
  label: React.ReactNode;
}

export interface SelectWithSearchProps<T> {
  disabled?: boolean;
  disableSearch?: boolean;
  multiple?: boolean;
  label?: React.ReactNode;
  forceOpen?: boolean;
  options: SelectWithSearchOption<T>[];
  searchPlaceholder?: string;
  popperPlacement?: PopperPlacementType;
  disablePortal?: boolean;
  value?: T | T[] | null;
  getKey?: (value: T) => string;
  onChange: (newValue: T | T[] | null) => void;
  onSearchChange?: (search: string) => void;
  searchPredicate?: (search: string, value: T) => boolean;
  css?: Interpolation<Theme>;
}

export function SelectWithSearch<T>({
  disabled,
  disableSearch,
  multiple,
  label,
  forceOpen,
  options,
  searchPlaceholder,
  popperPlacement,
  disablePortal,
  getKey,
  onChange,
  onSearchChange,
  value,
  searchPredicate,
  css: cssProp,
}: SelectWithSearchProps<T>) {
  if (multiple && !Array.isArray(value)) {
    throw new Error('value must be an array when multiple is true');
  }

  if (!multiple && Array.isArray(value)) {
    throw new Error('value must not be an array when multiple is false');
  }

  const values = value instanceof Array ? value : [value];

  const [panelOpen, setPanelOpen] = useState<boolean>(false);
  const [showSelectedOptionsOnly, setShowSelectedOptionsOnly] =
    useState<boolean>(true);
  const panelAnchorEl = useRef<null | HTMLDivElement>(null);
  const [matchingOptions, setMatchingOptions] =
    useState<SelectWithSearchOption<T>[]>(options);

  const valuesAreEqual = (a: T | null | undefined, b: T | null | undefined) => {
    if (a === null || a === undefined || b === null || b === undefined) {
      return a === b;
    }

    if (getKey) {
      return getKey(a) === getKey(b);
    }

    return a === b;
  };

  useEffect(() => {
    setMatchingOptions(options);
  }, [options]);

  useEffect(() => {
    if (forceOpen) {
      openPopper();
    }
  }, [forceOpen]);

  const onSearchChangeInternal = (search: string) => {
    if (onSearchChange) {
      onSearchChange(search);
      return;
    }

    const matchingOptions_ = options.filter((option) => {
      if (searchPredicate) {
        return searchPredicate(search, option.value);
      }

      return (option.label ?? option.key ?? String(option.value))
        ?.toString()
        .toLowerCase()
        .includes(search);
    });

    setMatchingOptions(matchingOptions_);
  };

  const label_ = (() => {
    if (label) {
      return label;
    }

    if (values.length === 0) {
      return label;
    }

    if (values.length === 1) {
      const selectedValueLabel = options.find((option) =>
        valuesAreEqual(option.value, values[0])
      );
      return selectedValueLabel?.label ?? label;
    }

    return `${values.length} values selected`;
  })();

  const closePopper = () => {
    if (forceOpen) {
      return;
    }
    setPanelOpen(false);
    setTimeout(() => {
      onSearchChangeInternal('');
    }, 200);
  };

  const openPopper = () => {
    setPanelOpen(true);
  };

  const clear = () => {
    onChange(multiple ? [] : null);
  };

  const onChangeInternal = (newValue: T) => {
    if (multiple) {
      if (Array.isArray(value)) {
        if (value.includes(newValue)) {
          onChange(value.filter((v) => !valuesAreEqual(v, newValue)));
        } else {
          onChange([...value, newValue]);
        }
      } else {
        onChange([newValue]);
      }
    } else {
      onChange(newValue);
      closePopper();
    }
  };

  const selectedOptions = multiple
    ? options.filter((option) =>
        values.find((v) => valuesAreEqual(option.value, v))
      )
    : null;

  const availableOptions = showSelectedOptionsOnly
    ? matchingOptions
    : selectedOptions;

  const displayedAvailableOptions = availableOptions?.slice(0, 40);

  return (
    <div
      css={css`
        display: flex;
        flex-flow: column;
        gap: 10px;
      `}
    >
      <div
        tabIndex={0}
        ref={panelAnchorEl}
        onMouseUp={(e) => {
          if (disabled) {
            return;
          }
          openPopper();
          e.stopPropagation();
        }}
        onBlur={() => closePopper()}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            // ESC
            closePopper();
          }
        }}
      >
        <Chip
          variant="outlined"
          disabled={disabled}
          css={(theme) => [
            css`
              cursor: pointer;
              border-radius: 10px;
              height: 40px;
              min-width: 200px;
              & .MuiChip-label {
                padding-left: 10px;
                padding-right: 10px;
                width: 100%;
              }
              border: 1px solid ${theme.palette.divider};
              &:hover {
                background-color: ${theme.palette.action.hover};
              }
            `,
            panelOpen &&
              css`
                outline-style: solid;
                outline-color: ${theme.palette.divider};
                outline-width: 1px;
                background-color: ${theme.palette.action.hover};
              `,
            cssProp,
          ]}
          label={
            <div
              css={(theme) => css`
                align-items: center;
                display: flex;
                justify-content: space-between;
                flex-flow: row;
                gap: 10px;
                color: ${theme.palette.text.primary};
              `}
            >
              {label_}
              {panelOpen ? (
                <ExpandLess
                  css={(theme) => css`
                    color: ${theme.palette.text.secondary};
                  `}
                />
              ) : (
                <ExpandMore
                  css={(theme) => css`
                    color: ${theme.palette.text.secondary};
                  `}
                />
              )}
            </div>
          }
        />
        <div>
          <Popper
            id="popper"
            disablePortal={!disablePortal}
            open={panelOpen}
            anchorEl={panelAnchorEl.current}
            css={css`
              z-index: 9999999;
            `}
            placement={popperPlacement ?? 'bottom-start'}
            transition
          >
            {({ TransitionProps }) => (
              <ClickAwayListener
                onClickAway={closePopper}
                mouseEvent="onMouseUp"
              >
                <Fade {...TransitionProps} timeout={350}>
                  <div>
                    <Card
                      css={css`
                        z-index: 9999999;
                      `}
                    >
                      <div
                        css={css`
                          max-height: 400px;
                          display: flex;
                          flex-flow: column;
                          gap: 10px;
                          min-width: 400px;
                          padding: 10px;
                        `}
                      >
                        {!disableSearch && (
                          <SearchInput
                            tabIndex={-1}
                            onChange={(e) =>
                              onSearchChangeInternal(
                                e.target.value.toLowerCase()
                              )
                            }
                            placeholder={searchPlaceholder}
                            onKeyDown={(e) => {
                              if (e.key === 'Escape') {
                                // ESC
                                closePopper();
                              }
                            }}
                          />
                        )}
                        <div
                          css={css`
                            overflow-x: auto;
                            display: flex;
                            flex-flow: column;
                            gap: 10px;
                          `}
                        >
                          <div
                            css={css`
                              display: flex;
                              flex-flow: column;
                              gap: 10px;
                            `}
                          >
                            {displayedAvailableOptions?.map((option, i) => {
                              return (
                                <OptionRow
                                  multiple={!!multiple}
                                  key={option.key}
                                  option={option}
                                  checked={values?.includes(option.value)}
                                  onClick={(option) => {
                                    onChangeInternal(option.value);
                                  }}
                                  index={i}
                                />
                              );
                            })}
                            {displayedAvailableOptions?.length === 0 && (
                              <Typography
                                variant="body2"
                                color="textSecondary"
                                textAlign="center"
                              >
                                No search result
                              </Typography>
                            )}
                            {displayedAvailableOptions &&
                              availableOptions &&
                              availableOptions?.length >
                                displayedAvailableOptions?.length && (
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                  textAlign="center"
                                >
                                  +{' '}
                                  {availableOptions.length -
                                    displayedAvailableOptions.length}{' '}
                                  more
                                </Typography>
                              )}
                          </div>
                        </div>

                        {multiple && values.length > 0 && options.length > 3 && (
                          <div
                            css={css`
                              display: flex;
                              flex-flow: row;
                              justify-content: flex-end;
                              align-items: center;
                              gap: 10px;
                            `}
                          >
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => {
                                setShowSelectedOptionsOnly(
                                  !showSelectedOptionsOnly
                                );
                              }}
                            >
                              {showSelectedOptionsOnly
                                ? 'Show Selected Options Only'
                                : 'Show All Options'}
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={clear}
                            >
                              Clear All
                            </Button>
                          </div>
                        )}
                      </div>
                    </Card>
                  </div>
                </Fade>
              </ClickAwayListener>
            )}
          </Popper>
        </div>
      </div>
    </div>
  );
}
