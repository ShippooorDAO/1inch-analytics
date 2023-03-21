import { css } from '@emotion/react';
import { TextField } from '@mui/material';
import React from 'react';
import { InputAttributes, NumericFormat } from 'react-number-format';

import { CollateralValueSlider } from './CollateralValueSlider';

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

export interface CollateralValueSliderWithInputsProps {
  onChange?: ({
    minCollateralValueUsd,
    maxCollateralValueUsd,
  }: {
    minCollateralValueUsd?: number;
    maxCollateralValueUsd?: number;
  }) => void;
  onChangeCommitted?: () => void;
  value?: {
    minCollateralValueUsd?: number;
    maxCollateralValueUsd?: number;
  };
}

export function CollateralValueSliderWithInputs({
  onChange,
  onChangeCommitted,
  value,
}: CollateralValueSliderWithInputsProps) {
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
        value={value?.minCollateralValueUsd}
        onChange={(e) => {
          onChange?.({
            ...value,
            minCollateralValueUsd: Number(e.target.value),
          });
          onChangeCommitted?.();
        }}
      />
      <CollateralValueSlider
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
        value={value?.maxCollateralValueUsd}
        onChange={(e) => {
          onChange?.({
            ...value,
            maxCollateralValueUsd: Number(e.target.value),
          });
          onChangeCommitted?.();
        }}
      />
    </div>
  );
}
