package expo.modules.locktask

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class LockTaskModule : Module() {
  private val activity get() = appContext.activityProvider?.currentActivity

  override fun definition() = ModuleDefinition {
    Name("LockTask")

    // Entra no Lock Task Mode (quiosque): bloqueia status bar, home, recentes
    Function("start") {
      activity?.runOnUiThread {
        try {
          activity?.startLockTask()
        } catch (_: Exception) {}
      }
    }

    // Sai do Lock Task Mode (requer Device Owner configurado via ADB)
    Function("stop") {
      activity?.runOnUiThread {
        try {
          activity?.stopLockTask()
        } catch (_: Exception) {}
      }
    }
  }
}
