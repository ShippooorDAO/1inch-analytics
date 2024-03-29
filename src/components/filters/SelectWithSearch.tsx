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
import { lighten } from 'polished';
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
}: OptionRowProps<T>) {
  return (
    <div
      key={option.key}
      css={(theme) => [
        css`
          height: 48px;
          padding: 0 8px;
          display: flex;
          flex-flow: row;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          border-radius: 12px;
          &:hover {
            background-color: ${theme.customBackgrounds.secondary};
          }
        `,
      ]}
      onClick={() => {
        onClick(option);
      }}
    >
      {option.label}
      {!multiple ? (
        <Radio key={option.key} checked={checked} />
      ) : (
        <Checkbox key={option.key} checked={checked} />
      )}
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

  const forceCancelBlur = useRef<boolean>(false);
  const [search, setSearch] = useState<string>('');
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
    if (forceOpen) {
      openPopper();
    }
  }, [forceOpen]);

  const onSearchChangeInternal = (search: string) => {
    if (onSearchChange) {
      onSearchChange(search);
      return;
    }

    if (search === '') {
      setMatchingOptions(options);
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

  useEffect(() => {
    onSearchChangeInternal(search);
  }, [options, search]);

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

    return `${values.length} values`;
  })();

  const closePopper = () => {
    if (forceOpen) {
      return;
    }
    setPanelOpen(false);
    setTimeout(() => {
      setSearch('');
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
        width: 100%;
        max-width: 300px;
      `}
    >
      <div
        tabIndex={0}
        ref={panelAnchorEl}
        onMouseUp={(e) => {
          if (disabled) {
            return;
          }
          forceCancelBlur.current = true;
          openPopper();
          e.stopPropagation();
        }}
        onBlur={() =>
          setTimeout(() => {
            if (forceCancelBlur.current) {
              forceCancelBlur.current = false;
              return;
            }
            closePopper();
            forceCancelBlur.current = false;
          }, 100)
        }
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
              width: 100%;
              min-width: 200px;
              max-width: 450px;
              & .MuiChip-label {
                padding-left: 10px;
                padding-right: 10px;
                width: 100%;
              }
              border: 1px solid ${theme.borders.primary};
              &:hover,
              &:active {
                background-color: ${lighten(
                  0.1,
                  theme.customBackgrounds.secondary
                )};
              }
            `,
            panelOpen &&
              css`
                background-color: ${theme.customBackgrounds.secondary};
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
                      css={(theme) => css`
                        z-index: 9999999;
                        background-color: ${theme.customBackgrounds.light};
                      `}
                    >
                      <div
                        css={css`
                          max-height: 400px;
                          display: flex;
                          flex-flow: column;
                          gap: 12px;
                          min-width: 400px;
                          padding: 8px;
                        `}
                      >
                        {!disableSearch && (
                          <SearchInput
                            value={search}
                            tabIndex={-1}
                            onChange={(e) =>
                              setSearch(e.target.value.toLowerCase())
                            }
                            placeholder={searchPlaceholder}
                            onKeyDown={(e) => {
                              if (e.key === 'Escape') {
                                // ESC
                                closePopper();
                                setSearch('');
                              }
                            }}
                          />
                        )}
                        <div
                          css={css`
                            overflow-x: auto;
                            display: flex;
                            flex-flow: column;
                          `}
                        >
                          <div
                            css={css`
                              display: flex;
                              flex-flow: column;
                              gap: 2px;
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
                      </div>
                      {multiple && values.length > 0 && options.length > 3 && (
                        <div
                          css={(theme) => css`
                            display: flex;
                            flex-flow: row;
                            justify-content: space-between;
                            align-items: center;
                            padding: 16px 8px 16px;
                            border-top: 1px solid ${theme.palette.divider};
                          `}
                        >
                          <Button
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
                          <Button size="small" onClick={clear}>
                            Clear All
                          </Button>
                        </div>
                      )}
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
