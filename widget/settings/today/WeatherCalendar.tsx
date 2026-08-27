import Gtk from "gi://Gtk?version=4.0"
import { ClockWidget } from "./ClockWidget"
import { WeatherDetailWidget } from "./WeatherWidget"
import { CalendarWidget } from "./CalendarWidget"


export function WeatherCalendar() {

    const clockWidget = ClockWidget();
    const calendarWidget = CalendarWidget();
    const weatherDetailWidget = WeatherDetailWidget();

    return (
        <box cssName="modules-center-container" orientation={Gtk.Orientation.HORIZONTAL} spacing={20}>
            <box orientation={Gtk.Orientation.VERTICAL}>
                {clockWidget}
                {weatherDetailWidget}
            </box>
            {calendarWidget}
        </box>
    );
}