import Gtk from "gi://Gtk?version=4.0"
import PopupWindow from "../PopupWindow"
import { Astal } from "ags/gtk4"
import { SystemInfoWidget } from "./SystemInfoWidget"
import { PillWidgets } from "./PillWidgets"
import { DisplayControlsWidget } from "./DisplayControlsWidget"
import { AudioControlsWidget } from "./AudioControlsWidget"
import { MprisWidget } from "./MprisWidget"
import { PowerButtonsWidget } from "./PowerButtons"
import { WindowName } from "../../constants"

const windowName = WindowName.modulesRight;

let ModulesRightPopup: any;

export function ModulesRight() {

    const systemInfoWidget = SystemInfoWidget();

    const pillWidgets = PillWidgets();

    const displayControlsWidget = DisplayControlsWidget();

    const audioControlsWidget = AudioControlsWidget();

    const mprisWidget = MprisWidget();

    const powerButtonsWidget = PowerButtonsWidget();

    const button = (
        <box cssName={"app-launcher-background-right"}>
            <button onClicked={() => ModulesRightPopup.toggle()} cssName={"bar-module-button-right"}>
                <label label={"󰣇"} />
            </button>
        </box>
    ) as any;

    ModulesRightPopup = new PopupWindow({
        name: windowName,
        namespace: windowName,
        anchor: Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT,
        margin: 8,
        child: (
            <box cssName="modules-right-container" vexpand={true} orientation={Gtk.Orientation.VERTICAL}>
                <box orientation={Gtk.Orientation.VERTICAL} vexpand={true}  valign={Gtk.Align.START} spacing={20}>
                    <box orientation={Gtk.Orientation.VERTICAL} hexpand={false} halign={Gtk.Align.CENTER} cssName="system-info-pill-container">
                        {systemInfoWidget}
                        {pillWidgets}
                    </box>
                    {displayControlsWidget}
                    {audioControlsWidget}
                    {mprisWidget}
                </box>
                <box vexpand={false}  valign={Gtk.Align.END} halign={Gtk.Align.CENTER} cssName="power-button-container">
                    {powerButtonsWidget}
                </box>
            </box>

        )
    });

    ModulesRightPopup.connect("notify::visible", () => {
        if (ModulesRightPopup.visible) {
            // Reset things on UI visible
        }
    });

    button.popup = ModulesRightPopup;

    return button;

}
