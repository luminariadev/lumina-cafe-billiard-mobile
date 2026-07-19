module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // react-native-reanimated/plugin dihapus — tidak kompatibel dengan Expo Go
    // (butuh native build / expo-dev-client)
  };
};
