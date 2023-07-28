export const ONE_INCH_ANALYTICS_API_URL = (() => {
  if (process.env.NEXT_PUBLIC_IGNORE_CORS === 'true') {
    return '/no_cors';
  }
  return process.env.NEXT_PUBLIC_ONE_INCH_ANALYTICS_API_URL || '';
})();
