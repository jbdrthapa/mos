import Gtk from "gi://Gtk?version=4.0"
import GLib from 'gi://GLib';
import { ClockWidget } from "./ClockWidget"
import { WeatherDetailWidget } from "./WeatherWidget"
import { CalendarWidget } from "./CalendarWidget"

const calendarWidget = CalendarWidget();

export function WeatherCalendar() {

    const clockWidget = ClockWidget();
    const weatherDetailWidget = WeatherDetailWidget();

    const content = (
        <box cssName="modules-center-container" orientation={Gtk.Orientation.HORIZONTAL} spacing={20}>
            <box orientation={Gtk.Orientation.VERTICAL}>
                {clockWidget}
                {weatherDetailWidget}
            </box>
            {calendarWidget}
        </box>
    ) as Gtk.Box;

    content.connect("notify::mapped", () => {
        calendarWidget.set_date(GLib.DateTime.new_now_local());
    });

    return content;
}

export function ResetCalendar(){
    calendarWidget.set_date(GLib.DateTime.new_now_local());
}