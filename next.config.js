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
  });
