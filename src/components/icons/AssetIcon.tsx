import { Asset } from '@/shared/Model/Asset';

import { RoundedImageIcon, RoundedImageIconProps } from './RoundedImageIcon';

export interface AssetIconProps
  extends Omit<RoundedImageIconProps, 'src' | 'loading' | 'subIconSrc'> {
  asset?: Asset;
}

export function AssetIcon({ asset, ...props }: AssetIconProps) {
  const src = asset?.imageUrl ?? '/warden/unknown_token_dark.png';
  const subIconSrc = asset?.chain?.imageUrl ?? '';

  return (
    <RoundedImageIcon
      {...props}
      loading={!asset}
      src={src}
      subIconSrc={subIconSrc}
    />
  );
}
