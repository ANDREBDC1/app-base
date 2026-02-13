module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            axios: 'axios/dist/browser/axios.cjs',
          },
        },
      ],
    ],
  };
};
