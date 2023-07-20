import { GetTreasuryBalancesQuery } from '@/gql/graphql';

export const mockTreasuryBalancesResponse: GetTreasuryBalancesQuery = {
  treasuryBalances: {
    pageNumber: 1,
    pageSize: 100,
    totalEntries: 8,
    totalPages: 1,
    treasuryBalances: [
      {
        amount: 12810711.583056,
        amountUsd: 12821715.984305846,
        asset: {
          id: 'cbd33d36-18eb-4757-8103-7c8c90601767',
        },
        id: '789fa42e-c180-4276-b95e-c33398735d16',
      },
      {
        amount: 1000000,
        amountUsd: 1000859,
        asset: {
          id: '6ae6d63f-1871-4cdc-9e93-0f65d2387095',
        },
        id: '12bc9b9b-4429-4377-8f46-3bee2133162b',
      },
      {
        amount: 2771497.048872972,
        amountUsd: 944276.7595215099,
        asset: {
          id: '976fc249-1c66-4f8d-9158-00626769de8b',
        },
        id: 'ae472d77-352a-470a-ac44-25a5fe70c294',
      },
      {
        amount: 257.52387689448096,
        amountUsd: 489818.13956960954,
        asset: {
          id: '11acb110-b353-4da2-8a5b-116be8dd6cab',
        },
        id: 'c03bcbbb-bdf2-46b4-9f62-2fc58546f7ac',
      },
      {
        amount: 243.4520460563897,
        amountUsd: 463053.0951606349,
        asset: {
          id: 'b3095a84-8a23-45de-ba3e-5ae3d559bfda',
        },
        id: '5bf313e3-a27c-40b1-8ed3-334a8b19aeb1',
      },
      {
        amount: 301984.03301300004,
        amountUsd: 302396.5432020957,
        asset: {
          id: '9c4a2713-3b15-4363-af48-f4c9e5309c5a',
        },
        id: '1616376d-f5f3-4201-b009-a1f85f36fb90',
      },
      {
        amount: 197520.59386425305,
        amountUsd: 197615.7987904956,
        asset: {
          id: 'dee190a6-37da-45b2-81af-ea758d43e5ea',
        },
        id: '0920797a-0da5-4167-9a5a-79aab0cf3fcb',
      },
      {
        amount: 1.9206895199999998,
        amountUsd: 57391.4128919976,
        asset: {
          id: '308dc990-7dbf-49f2-83ac-4a7b5e67535b',
        },
        id: 'f7f9e4ad-4564-4635-8546-23d145066ad5',
      },
    ],
  },
};
