import { css } from '@emotion/react';
import { TextField } from '@mui/material';
import React from 'react';
import { InputAttributes, NumericFormat } from 'react-number-format';

import { TotalAccountsValueSlider } from './TotalAccountsValueSlider';

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const NumberFormatCustom = React.forwardRef<
  // @ts-ignore
  NumericFormat<InputAttributes>,
  CustomProps
>(function NumberFormatCustom(props, ref) {
  const { onChange, ...other } = props;

  return (
    <NumericFormat
      {...other}
      decimalScale={2}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      valueIsNumericString
      prefix="$"
    />
  );
});

export interface TotalAccountsValueSliderWithInputsProps {
  onChange?: ({
    minAccountValueUsd,
    maxAccountValueUsd,
  }: {
    minAccountValueUsd?: number;
    maxAccountValueUsd?: number;
  }) => void;
  onChangeCommitted?: () => void;
  value?: {
    minAccountValueUsd?: number;
    maxAccountValueUsd?: number;
  };
}

export function TotalAccountsValueSliderWithInputs({
  onChange,
  onChangeCommitted,
  value,
}: TotalAccountsValueSliderWithInputsProps) {
  return (
    <div
      css={css`
        display: flex;
        flex-flow: row;
        align-items: flex-end;
        gap: 40px;
      `}
    >
      <TextField
        inputProps={{
          css: css`
            text-align: center;
          `,
        }}
        InputProps={{
          inputComponent: NumberFormatCustom as any,
        }}
        size="small"
        variant="outlined"
        value={value?.minAccountValueUsd}
        onChange={(e) => {
          onChange?.({
            ...value,
            minAccountValueUsd: Number(e.target.value),
          });
          onChangeCommitted?.();
        }}
      />
      <TotalAccountsValueSlider
        onChange={onChange}
        onChangeCommitted={onChangeCommitted}
        value={value}
      />
      <TextField
        inputProps={{
          css: css`
            text-align: center;
          `,
        }}
        InputProps={{
          inputComponent: NumberFormatCustom as any,
        }}
        size="small"
        variant="outlined"
        value={value?.maxAccountValueUsd}
        onChange={(e) => {
          onChange?.({
            ...value,
            maxAccountValueUsd: Number(e.target.value),
          });
          onChangeCommitted?.();
        }}
      />
    </div>
  );
}
