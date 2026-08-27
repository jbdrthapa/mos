import Gtk from "gi://Gtk?version=4.0"
import GLib from "gi://GLib"
import PopupWindow from "../PopupWindow"
import { Astal } from "ags/gtk4"
import { ClockWidget } from "./ClockWidget"
import { CalendarWidget } from "./CalendarWidget"
import { WeatherBarWidget, WeatherDetailWidget } from "./WeatherWidget"
import { WindowName } from "../../constants"
import TimeService from "../../services/TimeService"
import { createBinding } from "gnim"

const windowName = WindowName.modulesCenter;

let popup: any;

export function ModulesCenter() {

    const clockWidget = ClockWidget();
    const calendarWidget = CalendarWidget();
    const weatherBarWidget = WeatherBarWidget();
    const weatherDetailWidget = WeatherDetailWidget();
    const timeService = TimeService.get_default();

    const button = (
        <box cssName={"date-time-weather-container"}>
            <button onClicked={() => popup.toggle()} >
                <box orientation={Gtk.Orientation.HORIZONTAL} spacing={20}>
                    <label label={createBinding(timeService, "time")} valign={Gtk.Align.CENTER} cssName={"bar-time"} />
                    <box orientation={Gtk.Orientation.VERTICAL}>
                        <label vexpand={true} valign={Gtk.Align.END} label={createBinding(timeService, "date")} cssName={"bar-date"} />
                        {weatherBarWidget}
                    </box>
                </box>
            </button>
        </box>
    ) as any;

    popup = new PopupWindow({
        name: windowName,
        namespace: windowName,
        anchor: Astal.WindowAnchor.TOP,
        margin: 8,
        child: (
            <box cssName="modules-center-container" orientation={Gtk.Orientation.HORIZONTAL} spacing={20}>
                <box orientation={Gtk.Orientation.VERTICAL}>
                    {clockWidget}
                    {weatherDetailWidget}
                </box>
                {calendarWidget}
            </box>
        )
    });

    // Reset the calendar when the popup is made visible

    popup.connect("notify::visible", () => {
        if (popup.visible) {
            calendarWidget.set_date(GLib.DateTime.new_now_local());
        }
    });

    button.popup = popup;

    return button;

}
