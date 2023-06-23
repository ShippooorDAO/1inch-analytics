import { css } from '@emotion/react';

import { Asset } from '@/shared/Model/Asset';

import { AssetOptionLabel } from '../AssetOptionLabel';
import { SelectWithSearch, SelectWithSearchProps } from './SelectWithSearch';

export interface AssetMultiSelectProps
  extends Omit<
    SelectWithSearchProps<Asset>,
    'onChange' | 'options' | 'searchPredicate' | 'value'
  > {
  assets: Asset[];
  values: Asset[];
  onChange: (asset: Asset[]) => void;
  placeholder?: string;
}

export function AssetMultiSelect({
  assets,
  values,
  onChange,
  placeholder,
  ...props
}: AssetMultiSelectProps) {
  const options = assets.map((asset) => {
    return {
      key: asset.id,
      value: asset,
      label: <AssetOptionLabel asset={asset} />,
    };
  });

  const searchPredicate = (search: string, asset: Asset): boolean => {
    const predicates = search.split(' ');
    return predicates.every((predicate) => {
      const lcPredicate = predicate.toLowerCase();
      return (
        !search ||
        asset.symbol.toLowerCase().includes(lcPredicate) ||
        asset.name.toLowerCase().includes(lcPredicate) ||
        asset.displayName.toLowerCase().includes(lcPredicate) ||
        asset.address.toLowerCase().includes(lcPredicate)
      );
    });
  };
  const onChangeInternal = (values: Asset[] | Asset | null) => {
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
        return placeholder ?? 'Select tokens';
      }
      if (values.length === 1) {
        return (
          options.find((o) => o.value === values[0])?.label ??
          placeholder ??
          'Select tokens'
        );
      }
      if (values.length > 1) {
        return `${values.length} tokens selected`;
      }
      if (values.length === assets.length) {
        return 'All tokens selected';
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
      searchPlaceholder="Search by symbol, address or protocol"
      onChange={onChangeInternal}
      searchPredicate={searchPredicate}
      css={css`
        width: 500px;
      `}
    />
  );
}
