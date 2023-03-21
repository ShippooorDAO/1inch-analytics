module.exports = (api) => {
  const target = api.caller((caller) => caller.target);

  api.cache.using(() => JSON.stringify({ target }));

  const presets = [
    [
      'next/babel',
      {
        'preset-react': {
          runtime: 'automatic',
          importSource: '@emotion/react',
        },
      },
    ],
  ];

  const plugins = ['@emotion/babel-plugin', 'babel-plugin-macros'];

  // Enable optimizations only for the `web` bundle.
  if (target === "web") {
    plugins.push([
      "babel-plugin-direct-import",
      {
        modules: [
          "@mui/lab",
          "@mui/material",
          "@mui/system",
          "@mui/icons-material",
          "react-feather",
        ],
      },
    ])
    plugins.push([
      'module-resolver',
      {
        alias: {
          '@': './src',
        },
      },
    ]);
  }

  return { presets, plugins };
};
