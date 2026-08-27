import Gtk from "gi://Gtk?version=4.0"
import { createBinding, createComputed } from "ags"
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

export function WeatherDetailWidget() {
    const weatherService = WeatherService.get_default();

    const city = createBinding(weatherService, "city");
    const description = createBinding(weatherService, "description");
    const cityWeather = createComputed(() => { return `${city()}  :  ${description()}`; });

    return (
        <box orientation={Gtk.Orientation.VERTICAL} spacing={10}>
            <box orientation={Gtk.Orientation.HORIZONTAL}>
                <label label={createBinding(weatherService, "icon")} cssName="detail-weather-icon" />
                <label hexpand={true} halign={Gtk.Align.END} label={createBinding(weatherService, "temperature")} cssName="detail-weather-temp" />
            </box>
            <box orientation={Gtk.Orientation.VERTICAL} spacing={8}>
                <label xalign={0} label={cityWeather} cssName="detail-weather-details-label" />
                <box hexpand={true} halign={Gtk.Align.START}>
                    <label xalign={0} label="Low" cssName="detail-weather-details-label" />
                    <label xalign={0} label={createBinding(weatherService, "temperature_low")} cssName="detail-weather-details-value" />
                </box>
                <box hexpand={true} halign={Gtk.Align.START}>
                    <label xalign={0} label="High" cssName="detail-weather-details-label" />
                    <label xalign={0} label={createBinding(weatherService, "temperature_high")} cssName="detail-weather-details-value" />
                </box>
                <box hexpand={true} halign={Gtk.Align.START}>
                    <label xalign={0} label="Humidity" cssName="detail-weather-details-label" />
                    <label xalign={0} label={createBinding(weatherService, "humidity")} cssName="detail-weather-details-value" />
                </box>
                <box hexpand={true} halign={Gtk.Align.START}>
                    <label xalign={0} label="Wind Speed" cssName="detail-weather-details-label" />
                    <label xalign={0} label={createBinding(weatherService, "wind_speed").as((value) => String(value))} cssName="detail-weather-details-value" />
                </box>
                <box hexpand={true} halign={Gtk.Align.START}>
                    <label xalign={0} label="Wind Direction" cssName="detail-weather-details-label" />
                    <label xalign={0} label={createBinding(weatherService, "wind_direction").as((value) => String(value))} cssName="detail-weather-details-value" />
                </box>
            </box>
        </box>
    );
}