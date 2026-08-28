import Gtk from "gi://Gtk?version=4.0"
import PopupWindow from "../widget/PopupWindow"
import { Astal } from "ags/gtk4"
import { WindowName } from "../constants"
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

let settings = WidgetManager.GetSettingsWindow() as SettingsWindow | null;

function ShowSettings(action: (() => void) | undefined) {
    action?.();
    settings?.toggle();
}


export function DesktopMenu() {

    let desktopMenu = new PopupWindow({
        name: windowName,
        namespace: windowName,
        anchor: Astal.WindowAnchor.TOP | Astal.WindowAnchor.LEFT,
        child: (
            <box orientation={Gtk.Orientation.VERTICAL}>
                <button cssName="desktop-menu-button" onClicked={() => {
                    ShowSettings(settings?.Apps);
                }}>Apps</button>
                
                <button cssName="desktop-menu-button" onClicked={() => {
                    ShowSettings(settings?.Wallpaper);
                }}>Wallpaper</button>

                <button cssName="desktop-menu-button" onClicked={() => {
                    ShowSettings(settings?.Power);
                }}>Power</button>

                <button cssName="desktop-menu-button" onClicked={() => {
                    ShowSettings(settings?.Settings);
                }}>Settings</button>
            </box>
        )
    });

    return desktopMenu;

}
