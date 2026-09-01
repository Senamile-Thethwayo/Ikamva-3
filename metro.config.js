const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Resolve .web.ts/.web.tsx files before .ts/.tsx on web platform
// This lets us provide web-safe stubs for expo-sqlite and other native modules
config.resolver.platforms = ["ios", "android", "native", "web"];

module.exports = config;
