import Gtk from "gi://Gtk?version=4.0"
import PopupWindow from "../widget/PopupWindow"
import { Astal } from "ags/gtk4"
import { WindowName } from "../constants"
import app from "ags/gtk4/app";
import WidgetManager from "../WidgetManager";

const windowName = WindowName.desktopMenu;
const settingsWindowName = WindowName.settings

export function DesktopMenu() {

    let desktopMenu = new PopupWindow({
        name: windowName,
        namespace: windowName,
        anchor: Astal.WindowAnchor.TOP | Astal.WindowAnchor.LEFT,
        child: (
            <box orientation={Gtk.Orientation.VERTICAL}>


                <button cssName="desktop-menu-button" onClicked={() => {
                    let settings = WidgetManager.GetSettingsWindow();
                    settings?.Display();
                    settings?.toggle();
                }}>Display</button>

                <button cssName="desktop-menu-button" onClicked={() => {
                    let settings = WidgetManager.GetSettingsWindow();
                    settings?.Wallpaper();
                    settings?.toggle();
                }}>Wallpaper</button>

                <button cssName="desktop-menu-button" onClicked={() => {
                    let settings = WidgetManager.GetSettingsWindow();
                    settings?.Settings();
                    settings?.toggle();

                }}>Settings</button>

            </box>
        )
    });

    return desktopMenu;

}
