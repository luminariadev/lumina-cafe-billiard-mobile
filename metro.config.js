// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Performance: disable watch folders for node_modules to reduce memory
config.watcher = {
  ...config.watcher,
  healthCheck: {
    enabled: false,
  },
};

// Tree-shake large icons: only bundle used font sets
config.resolver.assetExts.push('ttf', 'otf');

module.exports = config;