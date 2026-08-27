import Gtk from "gi://Gtk?version=4.0";
import { Astal } from "ags/gtk4"
import app from "ags/gtk4/app"
import { WindowName } from "../../constants";
import PopupWindow from "../PopupWindow";
import { PowerSettings } from "./PowerSettings";
import { WallpaperSettings } from "./WallpaperSettings";
import { Preferences } from "./Preferences";
import { AboutSettings } from "./AboutSettings";
import { WeatherCalendar } from "./today/WeatherCalendar";


export function Settings() {

    const windowName = WindowName.settings;

    const weatherCalendar = WeatherCalendar() as any;
    const powerSettings = PowerSettings() as any;
    const wallpaperSettings = WallpaperSettings() as any;
    const preferences = Preferences() as any;
    const aboutSettings = AboutSettings() as any;

    let notebook = new Gtk.Notebook({
        tabPos: Gtk.PositionType.TOP,
        cssName: "settings-notebook",
        hexpand: true,
        vexpand: true,
    });

    notebook.append_page(weatherCalendar, new Gtk.Label({ label: "Today" }));
    notebook.append_page(powerSettings, new Gtk.Label({ label: "Power" }));
    notebook.append_page(wallpaperSettings, new Gtk.Label({ label: "Wallpaper" }));
    notebook.append_page(preferences, new Gtk.Label({ label: "Preferences" }));
    notebook.append_page(aboutSettings, new Gtk.Label({ label: "About" }));

    const SettingsPopup = new PopupWindow({
        name: windowName,
        namespace: windowName,
        anchor: Astal.WindowAnchor.TOP,
        exclusivity: Astal.Exclusivity.IGNORE,
        application: app,
        child: (
            <box cssName="settings-container">
                <box>
                    {notebook}
                </box>
            </box>
        )
    });

    const win = app.get_window(windowName);

    if (win) {
        (win as any).Settings = () => {
            notebook.set_current_page(0);
        };
        
        (win as any).Today = () => {
            notebook.set_current_page(0);
        };

        (win as any).Power = () => {
            notebook.set_current_page(1);
        };

        (win as any).Display = () => {
            notebook.set_current_page(2);
        };

        (win as any).Wallpaper = () => {
            notebook.set_current_page(3);
        };
    }

    return SettingsPopup;

}

