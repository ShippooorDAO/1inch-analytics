export class TreasuryTransactionLabelStore {
  constructor(
    private readonly treasuryTransactionLabels: {
      fromLabels: string[];
      toLabels: string[];
    }
  ) {}

  getAllFromLabels(): Array<string> {
    return [...this.treasuryTransactionLabels.fromLabels];
  }

  getAllToLabels(): Array<string> {
    return [...this.treasuryTransactionLabels.toLabels];
  }

  getAll() {
    return {
      fromLabels: this.getAllFromLabels(),
      toLabels: this.getAllToLabels(),
    };
  }
}
