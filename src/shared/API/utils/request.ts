import crypto from 'crypto';
import { NextApiRequest, NextApiResponse } from 'next';

/**
 * Temporary fix for Cloudfront not supporting Next.js API routes with query params.
 * Extracts query params from a GET request or body from a POST request.
 *
 * @param request NextApiRequest
 * @returns
 */
export function extractGetMethodQueryParamsShim<T>(
  request: NextApiRequest
): T | null {
  if (request.method === 'GET') {
    return request.query as T;
  }
  if (request.method === 'POST') {
    return JSON.parse(request.body) as T;
  }
  return null;
}

const md5 = (data: any) => crypto.createHash('md5').update(data).digest('hex');

async function createEtag(body: string): Promise<string> {
  const hash = md5(body);
  return `W/"${hash}"`;
}

/**
 * Sets response headers to cache the response for a given duration.
 *
 * Based on method from Satellytes:
 * https://satellytes.com/blog/post/cloudfront-cache-efficiency/
 *
 * @param res
 * @param duration
 * @returns
 */
export async function setCacheResponseHeaders(
  res: NextApiResponse,
  body: any = null,
  duration: number = 86400
) {
  res.setHeader(
    'Cache-Control',
    `s-maxage=${duration}, max-age=${duration}, stale-while-revalidate`
  );
  res.setHeader('date', new Date().toUTCString());
  res.removeHeader('age');
  if (body) {
    const eTag = await createEtag(JSON.stringify(body));
    res.setHeader('ETag', eTag);
  }
  return res;
}
