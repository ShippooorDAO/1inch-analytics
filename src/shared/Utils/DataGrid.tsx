import styled from '@emotion/styled';
import { Badge, Box } from '@mui/material';
import {
  GridRenderCellParams,
  GridValueFormatterParams,
} from '@mui/x-data-grid-premium';
import Link from 'next/link';
import { ReactNode } from 'react';
import Blockies from 'react-blockies';

import { HealthFactorBadge } from '@/components/HealthFactorBadge';
import { AccountTableCell } from '@/components/table/AccountTableCell';
import { AssetAmount } from '@/shared/Currency/AssetAmount';
import { CurrencyAmount } from '@/shared/Currency/CurrencyAmount';
import { UsdAmount } from '@/shared/Currency/UsdAmount';
import { Asset } from '@/shared/Model/Asset';

import { getAddressShorthand } from './Format';

const RoundBlockies = styled(Blockies)`
  display: inline;
  margin: 0.75rem;
  margin-left: 0;
  border-radius: 9999px;
`;

export function PercentageGridValueFormatter(
  params: GridValueFormatterParams<number>
) {
  if (params.value == null) {
    return '';
  }

  const valueFormatted = Number(params.value * 100).toLocaleString();
  return `${valueFormatted} %`;
}

export function TokenRenderCell(params: GridRenderCellParams<Asset>) {
  if (!params.value) {
    return 'Unknown';
  }
  // const iconImageUri = getIconForSymbol(params.value.symbol.toLowerCase());
  // if (iconImageUri) {
  //   return (
  //     <Badge className="badge-outline h-8">
  //       <img className="h-6 mr-3" src={iconImageUri} />
  //       <span>{params.value.symbol}</span>
  //     </Badge>
  //   );
  // }
  return params.value.symbol;
}

export function HealthScoreRenderCell(
  params: GridRenderCellParams<number>
): ReactNode {
  const healthScore = params.value;
  if (!healthScore) {
    return '';
  }
  return <HealthFactorBadge healthFactor={healthScore} />;
}

export function AmountFormatter(
  params: GridValueFormatterParams<CurrencyAmount>
) {
  if (!params.value) {
    return '';
  }
  return params.value.toDisplayString();
}

export function AssetAmountWithUsdValueFormatter(
  params: GridValueFormatterParams<{ amount: AssetAmount } | UsdAmount>
) {
  if (!params.value) {
    return '';
  }
  if (params.value instanceof UsdAmount) {
    return params.value.toDisplayString();
  }
  const { amount } = params.value;
  return `${amount.toDisplayString()} (${amount.toUsd().toDisplayString()})`;
}

export function AccountRenderCell(
  params: GridRenderCellParams<{ address: string; tag: string }>
) {
  if (!params.value || !params.value.address) {
    return null;
  }
  return (
    <Link href={`/accounts/${params.value.address}`}>
      <div>
        <AccountTableCell
          address={params.value.address}
          tag={params.value.tag}
        />
      </div>
    </Link>
  );
}

export function AccountAddressRenderCell(params: GridRenderCellParams<string>) {
  if (!params.value) {
    return '';
  }
  return (
    <Link href={`/accounts/${params.value}`}>
      <Box sx={{ cursor: 'pointer' }}>
        <RoundBlockies seed={params.value} size={10} scale={4} />
        <span>{getAddressShorthand(params.value)}</span>
      </Box>
    </Link>
  );
}

export function AccountTagRenderCell(params: GridRenderCellParams<string>) {
  if (!params.value) {
    return '';
  }
  return <Badge>{params.value}</Badge>;
}

export function DatetimeFormatter(params: GridValueFormatterParams<Date>) {
  return params.value.toLocaleString();
}
