import { Chain } from '@/shared/Model/Chain';

import { RoundedImageIcon } from '../icons/RoundedImageIcon';
import { SelectOptionLabel } from '../SelectOptionLabel';
import { SelectWithSearch, SelectWithSearchProps } from './SelectWithSearch';

export interface ChainSelectProps
  extends Omit<
    SelectWithSearchProps<Chain>,
    'onChange' | 'options' | 'searchPredicate' | 'value'
  > {
  chains: Chain[];
  value?: Chain | null;
  onChange: (chain: Chain | null) => void;
}

export function ChainSelect({
  chains,
  value,
  onChange,
  ...props
}: ChainSelectProps) {
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
    return (
      !search ||
      search === '' ||
      chain.displayName.toLowerCase().includes(search.toLowerCase()) ||
      !!chain?.displayName.toLowerCase().includes(search.toLowerCase())
    );
  };

  const onChangeInternal = (values: Chain[] | Chain | null) => {
    if (!values) {
      onChange(null);
      return;
    }
    if (!Array.isArray(values)) {
      values = [values];
    }

    onChange(values[0]);
  };

  return (
    <SelectWithSearch
      {...props}
      disablePortal={true}
      popperPlacement="auto"
      multiple={false}
      getKey={(chain) => chain.id}
      onChange={onChangeInternal}
      searchPredicate={searchPredicate}
      searchPlaceholder="Search chain by name"
      options={options}
      value={value}
    />
  );
}
