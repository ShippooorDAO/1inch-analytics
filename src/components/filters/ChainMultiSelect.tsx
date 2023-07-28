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
  options: Chain[];
  value: Chain[];
  onChange: (asset: Chain[]) => void;
}

export function ChainMultiSelect({
  options,
  value,
  onChange,
  ...props
}: ChainMultiSelectProps) {
  const optionsInternal = options.map((chain) => {
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
  const onChangeInternal = (newValue: Chain[] | Chain | null) => {
    if (!newValue) {
      onChange([]);
      return;
    }

    if (!Array.isArray(newValue)) {
      newValue = [newValue];
    }

    onChange(newValue);
  };

  const label =
    props.label ??
    (() => {
      if (value.length === 0) {
        return 'Select chains';
      }
      if (value.length === 1) {
        return (
          optionsInternal.find((o) => o.value === value[0])?.label ??
          'Select chains'
        );
      }
      if (value.length === optionsInternal.length) {
        return 'All chains';
      }
      if (value.length > 1) {
        return `${value.length} chains`;
      }
    })();

  return (
    <SelectWithSearch
      {...props}
      label={label}
      value={value}
      getKey={(asset) => asset.id}
      multiple={true}
      options={optionsInternal ?? []}
      searchPlaceholder="Search by chain name or id"
      onChange={onChangeInternal}
      searchPredicate={searchPredicate}
      css={css`
        width: 400px;
      `}
    />
  );
}
