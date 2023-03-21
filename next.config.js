const withTM = require("next-transpile-modules")([
  "@babel/preset-react",
]);

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(
  withTM({
    webpack(config) {
      config.module.rules.push({
        test: /\.svg$/,
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              svgoConfig: {
                plugins: [
                  {
                    name: 'removeViewBox',
                    active: false,
                  },
                ],
              },
            },
          },
        ],
      });

      return config;
    },
    async rewrites() {
      if (process.env.NEXT_PUBLIC_IGNORE_CORS) {
         return [
           {
             source: '/cors_light',
             destination: process.env.NEXT_PUBLIC_ONE_INCH_ANALYTICS_API_URL,
           },
         ];
      } 
      return [];
    },
  })
);
