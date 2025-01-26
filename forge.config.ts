import type { ForgeConfig } from '@electron-forge/shared-types';
import FusesPlugin from '@electron-forge/plugin-fuses';
import { FuseV1Options, FuseVersion } from '@electron/fuses';

const config: ForgeConfig = {
  packagerConfig: {
    name: 'document-io',
    asar: true,
    protocols: [
      {
        name: 'document-io',
        schemes: ['document-io'],
      },
    ],

    // https://electron.github.io/packager/main/interfaces/Options.html#ignore
    ignore: [
      /^\/ui/,
      /^\/src/,
      /^\/tsconfig[.]json$/,
      /\.ts$/,
      /\.md$/,
      /\.map$/,
    ]
  },
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      platforms: ['darwin', 'win32'],
      config: {
        repository: {
          name: 'document.io-companion',
          owner: 'Sanjay-George'
        },
        prerelease: true,
        authToken: process.env.GITHUB_TOKEN,
      }
    }
  ],
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    // {
    //   name: '@electron-forge/maker-dmg',
    //   config: {
    //     format: 'ULFO'
    //   }
    // },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
      config: {},
    },
    // {
    //   name: '@electron-forge/maker-deb',
    //   config: {},
    // },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};

export default config;
