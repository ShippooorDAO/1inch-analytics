export interface CashFlow {
  outflow: number;
  inflow: number;
  net: number;
}

export interface TreasuryCashflowBreakdown {
  inflow: number;
  outflow: number;
  net: number;
  stakingFees: CashFlow;
  spreadSurplus: CashFlow;
  operations: CashFlow;
  operationsFund: CashFlow;
  otherTransfersOut: CashFlow;
}
