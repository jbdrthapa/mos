import { createRoot } from "ags"
import { Settings } from "./widget/settings/Settings"

let settingsInstance: ReturnType<typeof Settings> | undefined;
let dispose: (() => void) | undefined;


export function GetSettingsWindow() {
    if (!settingsInstance) {
        dispose = createRoot((d) => {
            settingsInstance = Settings()
            return d;
        })
    }
    return settingsInstance;
}

export function DisposeSettingsWindow() {
    dispose?.()
    dispose = undefined
    settingsInstance = undefined
}

const WidgetManager = {
    GetSettingsWindow,
};

export default WidgetManager;
