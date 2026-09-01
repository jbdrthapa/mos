import { Settings } from "./widget/settings/Settings";
import { LockScreen } from "./widget/LockScreen";

let settingsInstance: ReturnType<typeof Settings> | null = null;
let lockScreenInstance: ReturnType<typeof LockScreen> | null = null;

export function GetSettingsWindow() {
  if (!settingsInstance) {
    settingsInstance = Settings();
  }
  return settingsInstance;
}

export function GetLockScreenWindow() {
  if (!lockScreenInstance) {
    lockScreenInstance = LockScreen();
  }
  return lockScreenInstance;
}

export function DisposeSettingsWindow() {
  if (settingsInstance) {
    settingsInstance.hide();
    settingsInstance = null;
  }
}

const WidgetManager = {
  GetSettingsWindow,
  GetLockScreenWindow,
  DisposeSettingsWindow,
};

export default WidgetManager;
