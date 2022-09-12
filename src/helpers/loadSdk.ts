import SafeAppsSDK, { SafeInfo } from '@gnosis.pm/safe-apps-sdk';

export async function loadSdk(): Promise<SafeInfo | undefined> {
  const appsSdk = new SafeAppsSDK();

  try {
    return await appsSdk.safe.getInfo();
  } catch (e) {
    console.error(e);
  }
}
