import type { NextApiRequest, NextApiResponse } from 'next';

import { GetTreasuryResponse } from '@/shared/API/interfaces/treasury';
import { getOneInchTreasuryWalletsBalances } from '@/shared/API/treasury/balances';
import { setCacheResponseHeaders } from '@/shared/API/utils/request';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const treasury = await getOneInchTreasuryWalletsBalances();

    const body: GetTreasuryResponse = {
      treasury,
    };
    await setCacheResponseHeaders(res, body);

    res.status(200).json(body);
  }
}
