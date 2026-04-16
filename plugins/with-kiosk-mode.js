// @ts-check
const { withAndroidManifest, withDangerousMod } = require('@expo/config-plugins');
const path = require('path');
const fs = require('fs');

/**
 * Adiciona o arquivo res/xml/device_admin.xml necessário para o DeviceAdminReceiver.
 * @param {import('@expo/config-plugins').ExpoConfig} config
 */
function withDeviceAdminXml(config) {
  return withDangerousMod(config, [
    'android',
    (config) => {
      const xmlDir = path.join(
        config.modRequest.platformProjectRoot,
        'app',
        'src',
        'main',
        'res',
        'xml',
      );
      fs.mkdirSync(xmlDir, { recursive: true });

      const xmlContent = `<?xml version="1.0" encoding="utf-8"?>
<device-admin>
  <uses-policies>
    <lock-screen />
  </uses-policies>
</device-admin>
`;
      fs.writeFileSync(path.join(xmlDir, 'device_admin.xml'), xmlContent, 'utf8');
      return config;
    },
  ]);
}

/**
 * Adiciona o KioskAdminReceiver ao AndroidManifest.xml.
 * @param {import('@expo/config-plugins').ExpoConfig} config
 */
function withAdminReceiver(config) {
  return withAndroidManifest(config, (config) => {
    const app = config.modResults.manifest.application[0];

    if (!app.receiver) app.receiver = [];

    const alreadyAdded = app.receiver.some(
      (r) => r.$?.['android:name'] === 'expo.modules.locktask.KioskAdminReceiver',
    );

    if (!alreadyAdded) {
      app.receiver.push({
        $: {
          'android:name': 'expo.modules.locktask.KioskAdminReceiver',
          'android:permission': 'android.permission.BIND_DEVICE_ADMIN',
          'android:exported': 'true',
        },
        'meta-data': [
          {
            $: {
              'android:name': 'android.app.device_admin',
              'android:resource': '@xml/device_admin',
            },
          },
        ],
        'intent-filter': [
          {
            action: [
              {
                $: { 'android:name': 'android.app.action.DEVICE_ADMIN_ENABLED' },
              },
            ],
          },
        ],
      });
    }

    return config;
  });
}

/**
 * Plugin principal que habilita o modo quiosque via Lock Task Mode do Android.
 * @param {import('@expo/config-plugins').ExpoConfig} config
 */
module.exports = function withKioskMode(config) {
  config = withDeviceAdminXml(config);
  config = withAdminReceiver(config);
  return config;
};
