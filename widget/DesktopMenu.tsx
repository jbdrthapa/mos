import Gtk from "gi://Gtk?version=4.0";
import PopupWindow from "../widget/PopupWindow";
import { Astal } from "ags/gtk4";
import app from "ags/gtk4/app";
import { WindowName } from "../constants";
import WidgetManager from "../WidgetManager";

interface SettingsWindow extends PopupWindow {
    Settings: () => void;
    Today: () => void;
    Apps: () => void;
    Wallpaper: () => void;
    Power: () => void;
    toggle: () => void;
}

const windowName = WindowName.desktopMenu;

function ShowSettings(action: (() => void) | undefined, settings: SettingsWindow | null) {
    action?.();
    settings?.toggle();
}

export function DesktopMenu() {
    const settings = WidgetManager.GetSettingsWindow() as SettingsWindow | null;

    return new PopupWindow({
        name: windowName,
        namespace: windowName,
        anchor: Astal.WindowAnchor.TOP | Astal.WindowAnchor.LEFT,
        application: app,
        child: (
            <box orientation={Gtk.Orientation.VERTICAL}>
                <button
                    cssName="desktop-menu-button"
                    onClicked={() => ShowSettings(settings?.Apps, settings)}
                >
                    Apps
                </button>

                <button
                    cssName="desktop-menu-button"
                    onClicked={() => ShowSettings(settings?.Wallpaper, settings)}
                >
                    Wallpaper
                </button>

                <button
                    cssName="desktop-menu-button"
                    onClicked={() => ShowSettings(settings?.Power, settings)}
                >
                    Power
                </button>

                <button
                    cssName="desktop-menu-button"
                    onClicked={() => ShowSettings(settings?.Settings, settings)}
                >
                    Settings
                </button>
            </box>
        ),
    });
}
