import { Badge } from '@mui/material';

function getHealthFactorClass(healthFactor: number) {
  if (healthFactor <= 1) {
    return 'bg-red-600';
  }
  if (healthFactor < 1.1) {
    return 'bg-red-500';
  }
  if (healthFactor < 1.25) {
    return 'bg-red-400';
  }
  if (healthFactor < 1.5) {
    return 'bg-red-300';
  }
  if (healthFactor < 1.75) {
    return 'bg-red-200';
  }
  if (healthFactor < 2) {
    return 'bg-red-100';
  }
  return '';
}

export const HealthFactorBadge = ({
  healthFactor,
}: {
  healthFactor: number;
}) => {
  const healthFactorClass = getHealthFactorClass(healthFactor);
  return <Badge css={healthFactorClass}>{healthFactor.toFixed(2)}</Badge>;
};
