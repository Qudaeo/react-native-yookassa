// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const blacklist = require('metro-config/src/defaults/blacklist');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const escape = require('escape-string-regexp');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pak = require('./package.json');

const peerDependencies = Object.keys(pak.peerDependencies);

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },

  projectRoot: path.resolve(__dirname, 'example'),
  watchFolders: [__dirname],

  resolver: {
    blacklistRE: blacklist([
      new RegExp(`^${escape(path.resolve(__dirname, 'node_modules'))}\\/.*$`),
    ]),
    providesModuleNodeModules: ['@babel/runtime', ...peerDependencies],
    extraNodeModules: {
      'react-native-payment': __dirname,
    },
  },
};
