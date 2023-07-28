import { css } from '@emotion/react';

import { Asset } from '@/shared/Model/Asset';
import { Chain } from '@/shared/Model/Chain';

import { RoundedImageIcon } from '../icons/RoundedImageIcon';
import { SelectOptionLabel } from './SelectOptionLabel';
import { SelectWithSearch, SelectWithSearchProps } from './SelectWithSearch';

export interface ChainMultiSelectProps
  extends Omit<
    SelectWithSearchProps<Asset>,
    'onChange' | 'options' | 'searchPredicate' | 'value'
  > {
  chains: Chain[];
  values: Chain[];
  onChange: (asset: Chain[]) => void;
}

export function ChainMultiSelect({
  chains,
  values,
  onChange,
  ...props
}: ChainMultiSelectProps) {
  const options = chains.map((chain) => {
    return {
      key: chain.id,
      value: chain,
      label: (
        <SelectOptionLabel
          name={chain.displayName}
          icon={
            chain.imageUrl ? (
              <RoundedImageIcon size="small" src={chain.imageUrl} />
            ) : undefined
          }
        />
      ),
    };
  });

  const searchPredicate = (search: string, chain: Chain): boolean => {
    const predicates = search.split(' ');
    return predicates.every((predicate) => {
      const lcPredicate = predicate.toLowerCase();
      return (
        !search ||
        chain.name.toLowerCase().includes(lcPredicate) ||
        chain.displayName.toLowerCase().includes(lcPredicate) ||
        String(chain.chainId).includes(lcPredicate)
      );
    });
  };
  const onChangeInternal = (values: Chain[] | Chain | null) => {
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
        return 'Select chains';
      }
      if (values.length === 1) {
        return (
          options.find((o) => o.value === values[0])?.label ?? 'Select chains'
        );
      }
      if (values.length === chains.length) {
        return 'All chains';
      }
      if (values.length > 1) {
        return `${values.length} chains`;
      }
    })();

  return (
    <SelectWithSearch
      {...props}
      label={label}
      value={values}
      getKey={(asset) => asset.id}
      multiple={true}
      options={options ?? []}
      searchPlaceholder="Search by chain name or id"
      onChange={onChangeInternal}
      searchPredicate={searchPredicate}
      css={css`
        width: 400px;
      `}
    />
  );
}
