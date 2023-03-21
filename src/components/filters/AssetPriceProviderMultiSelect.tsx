import { AssetPriceOptionLabel } from '../AssetPriceProviderOptionLabel';
import { RoundedImageIcon } from '../icons/RoundedImageIcon';
import { SelectWithSearch, SelectWithSearchProps } from './SelectWithSearch';

export interface AssetPriceProvider {
  imageUrl: string;
  name: string;
}

export interface AssetPriceProviderMultiSelectProps
  extends Omit<
    SelectWithSearchProps<AssetPriceProvider>,
    'onChange' | 'options' | 'searchPredicate' | 'value'
  > {
  assetPriceProviders: AssetPriceProvider[];
  values?: AssetPriceProvider[];
  onChange: (assetPriceProviders: AssetPriceProvider[]) => void;
}

export function AssetPriceMultiSelect({
  assetPriceProviders,
  values,
  onChange,
  ...props
}: AssetPriceProviderMultiSelectProps) {
  const options = assetPriceProviders.map((assetPriceProvider) => {
    const label = (
      <AssetPriceOptionLabel
        icon={
          <RoundedImageIcon size="small" src={assetPriceProvider.imageUrl} />
        }
        name={assetPriceProvider.name}
      />
    );

    return {
      key: assetPriceProvider.name,
      value: assetPriceProvider,
      label,
    };
  });

  const searchPredicate = (
    search: string,
    assetPriceProvider: AssetPriceProvider
  ): boolean => {
    return (
      !search ||
      search === '' ||
      assetPriceProvider.name.toLowerCase().includes(search.toLowerCase()) ||
      !!assetPriceProvider?.name.toLowerCase().includes(search.toLowerCase())
    );
  };

  const onChangeInternal = (
    values: AssetPriceProvider[] | AssetPriceProvider | null
  ) => {
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
      if (!values || values.length === 0) {
        return 'Select price feed';
      }
      if (values.length === 1) {
        return (
          options.find((o) => o.value === values[0])?.label ??
          'Select price feeds'
        );
      }
      if (values.length > 1) {
        return `${values.length} price feeds selected`;
      }
      if (values.length === assetPriceProviders.length) {
        return 'All price feeds selected';
      }
    })();

  return (
    <SelectWithSearch
      {...props}
      label={label}
      multiple={true}
      getKey={(assetPriceProvider) => assetPriceProvider.name}
      onChange={onChangeInternal}
      searchPredicate={searchPredicate}
      searchPlaceholder="Search price feed by name"
      options={options}
      value={values}
    />
  );
}
