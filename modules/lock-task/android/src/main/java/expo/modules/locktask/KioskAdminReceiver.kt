package expo.modules.locktask

import android.app.admin.DeviceAdminReceiver
import android.content.Context
import android.content.Intent

// Componente necessário para registrar o app como Device Owner via ADB.
// Comando: adb shell dpm set-device-owner com.screenblocker/expo.modules.locktask.KioskAdminReceiver
class KioskAdminReceiver : DeviceAdminReceiver() {
  override fun onEnabled(context: Context, intent: Intent) = Unit
  override fun onDisabled(context: Context, intent: Intent) = Unit
}
