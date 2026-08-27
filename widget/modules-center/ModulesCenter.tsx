import Gtk from "gi://Gtk?version=4.0"
import TimeService from "../../services/TimeService"
import { createBinding } from "gnim"
import WidgetManager from "../../WidgetManager"
import WeatherService from "../../services/WeatherService";

export function WeatherBarWidget() {

    const weatherService = WeatherService.get_default();

    return (
        <box vexpand={true}>
            <label valign={Gtk.Align.START} label={createBinding(weatherService, "icon")} cssName="bar-weather-icon" />
            <label valign={Gtk.Align.CENTER} label={createBinding(weatherService, "temperature")} cssName="bar-weather-temperature" />
        </box>
    );
}

export function ModulesCenter() {

    const weatherBarWidget = WeatherBarWidget();
    const timeService = TimeService.get_default();

    const button = (
        <box cssName={"date-time-weather-container"}>
            <button onClicked={() => {
                let settings = WidgetManager.GetSettingsWindow();
                settings?.Today();
                settings?.toggle();
            }} >
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

    // Reset the calendar when the popup is made visible

    // popup.connect("notify::visible", () => {
    //     if (popup.visible) {
    //         calendarWidget.set_date(GLib.DateTime.new_now_local());
    //     }
    // });

    return button;

}
