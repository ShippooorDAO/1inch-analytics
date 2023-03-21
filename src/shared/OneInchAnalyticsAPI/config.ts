export const ONE_INCH_ANALYTICS_API_URL = (() => {
  if (process.env.NEXT_PUBLIC_IGNORE_CORS === 'true') {
    return '/cors_light';
  }
  return process.env.NEXT_PUBLIC_ONE_INCH_ANALYTICS_API_URL || '';
})();
