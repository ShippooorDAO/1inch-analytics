const withTM = require("next-transpile-modules")([
  "@babel/preset-react",
]);

module.exports = 
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
             source: '/no_cors',
             destination: process.env.NEXT_PUBLIC_ONE_INCH_ANALYTICS_API_URL,
           },
         ];
      } 
      return [];
    },
  });
