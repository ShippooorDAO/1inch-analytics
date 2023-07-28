import { Asset } from '@/shared/Model/Asset';

import { AssetOptionLabel } from './AssetOptionLabel';
import { SelectWithSearch, SelectWithSearchProps } from './SelectWithSearch';

export interface AssetSelectProps
  extends Omit<
    SelectWithSearchProps<Asset>,
    'onChange' | 'options' | 'searchPredicate' | 'value'
  > {
  assets: Asset[];
  value?: Asset | null;
  onChange: (asset: Asset | null) => void;
}

export function AssetSelect({
  assets,
  value,
  onChange,
  ...props
}: AssetSelectProps) {
  const options = assets.map((asset) => {
    return {
      key: asset.id,
      value: asset,
      label: <AssetOptionLabel asset={asset} />,
    };
  });

  const searchPredicate = (search: string, asset: Asset): boolean => {
    const predicates = search.split(' ');
    return predicates.some((predicate) => {
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
      onChange(null);
      return;
    }
    if (!Array.isArray(values)) {
      values = [values];
    }

    onChange(values[0]);
  };

  const label = options.find((o) => o.value === value)?.label ?? 'Choose asset';
  return (
    <SelectWithSearch
      {...props}
      label={label}
      multiple={false}
      getKey={(asset) => asset.id}
      onChange={onChangeInternal}
      searchPredicate={searchPredicate}
      options={options}
      value={value}
    />
  );
}
