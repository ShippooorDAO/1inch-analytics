import { css } from '@emotion/react';
import { Typography } from '@mui/material';
import { useMemo } from 'react';

import { Timeseries } from '@/shared/Model/Timeseries';

import { SelectOptionLabel } from '../filters/SelectOptionLabel';
import {
  SelectWithSearch,
  SelectWithSearchProps,
} from '../filters/SelectWithSearch';
import { RoundedImageIcon } from '../icons/RoundedImageIcon';

export interface TimeseriesMultiSelectProps
  extends Omit<
    SelectWithSearchProps<Timeseries>,
    'onChange' | 'options' | 'searchPredicate' | 'value'
  > {
  options: Timeseries[];
  values: Timeseries[];
  onChange: (asset: Timeseries[]) => void;
}

export function TimeseriesMultiSelect({
  options,
  values,
  onChange,
  ...props
}: TimeseriesMultiSelectProps) {
  const optionsInternal = useMemo(
    () =>
      options.map((option) => {
        return {
          key: option.name,
          value: option,
          label: (
            <SelectOptionLabel
              name={option.name}
              icon={
                option.imageUrl ? (
                  <RoundedImageIcon size="small" src={option.imageUrl} />
                ) : option.color ? (
                  <span
                    css={css`
                      background-color: ${option.color};
                      height: 16px;
                      width: 16px;
                      border-radius: 24px;
                    `}
                  />
                ) : undefined
              }
            />
          ),
        };
      }),
    [options]
  );

  const searchPredicate = (search: string, option: Timeseries): boolean => {
    const predicates = search.split(' ');
    return predicates.every((predicate) => {
      return (
        !search || option.name.toLowerCase().includes(predicate.toLowerCase())
      );
    });
  };

  const onChangeInternal = (values: Timeseries[] | Timeseries | null) => {
    if (!values) {
      onChange([]);
      return;
    }

    if (!Array.isArray(values)) {
      values = [values];
    }

    onChange(values);
  };

  const label =
    props.label ??
    (() => {
      if (values.length === 0) {
        return 'Select timeseries';
      }
      if (values.length === 1) {
        return (
          optionsInternal.find((o) => o.key === values[0].name)?.label ??
          'Select timeseries'
        );
      }
      if (values.length > 1) {
        const firstTimeseriesLabel = optionsInternal.find(
          (o) => o.key === values[0].name
        )?.label;

        if (firstTimeseriesLabel) {
          return (
            <div
              css={css`
                display: flex;
                flex-flow: row;
                gap: 5px;
                align-content: flex-end;
              `}
            >
              <div>{firstTimeseriesLabel} </div>
              <div
                css={css`
                  display: flex;
                  flex-flow: column;
                  justify-content: center;
                `}
              >
                <Typography
                  variant="body1"
                  color="textSecondary"
                  css={css`
                    margin-top: 1px;
                  `}
                >
                  {`+ ${values.length - 1} other series`}
                </Typography>
              </div>
            </div>
          );
        }
        return `${values.length} timeseries`;
      }
      if (values.length === options.length) {
        return 'All timeseries';
      }
    })();

  return (
    <SelectWithSearch
      {...props}
      disableSearch
      label={label}
      value={values}
      getKey={(option: Timeseries) => option.name}
      multiple={true}
      options={optionsInternal ?? []}
      searchPlaceholder="Search by name or id"
      onChange={onChangeInternal}
      searchPredicate={searchPredicate}
      css={css`
        width: 400px;
      `}
    />
  );
}
