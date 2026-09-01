import Gtk from "gi://Gtk?version=4.0";
import GLib from "gi://GLib";

import { ClockWidget } from "./ClockWidget";
import { WeatherDetailWidget } from "./WeatherWidget";
import { CalendarWidget } from "./CalendarWidget";

export function WeatherCalendar() {
    // Create a fresh calendar instance per WeatherCalendar
    const calendarWidget = CalendarWidget();

    const clockWidget = ClockWidget();
    const weatherDetailWidget = WeatherDetailWidget();

    const content = (
        <box
            cssName="modules-center-container"
            orientation={Gtk.Orientation.HORIZONTAL}
            spacing={20}
        >
            <box orientation={Gtk.Orientation.VERTICAL}>
                {clockWidget}
                {weatherDetailWidget}
            </box>
            {calendarWidget}
        </box>
    ) as Gtk.Box;

    // Update date when mapped
    content.connect("notify::mapped", () => {
        calendarWidget.set_date(GLib.DateTime.new_now_local());
    });

    // Return both widget + reset function
    return {
        widget: content,
        reset: () => {
            calendarWidget.set_date(GLib.DateTime.new_now_local());
        },
    };
}
