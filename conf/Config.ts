import GLib from 'gi://GLib';
import Gio from "gi://Gio";

let cachedConfig: any = null;
let monitor: Gio.FileMonitor | null = null;
let configPath = GLib.build_filenamev([
    GLib.get_home_dir(),
    ".config",
    "mos",
    "conf",
    "mos.json",
]);

function loadConfig() {
    const [ok, bytes] = GLib.file_get_contents(configPath);
    if (!ok) {
        cachedConfig = null;
        return;
    }

    try {
        cachedConfig = JSON.parse(new TextDecoder().decode(bytes));
    } catch (e) {
        print(`mos config parse error: ${e}`);
        cachedConfig = null;
    }
}

function reloadConfig() {
    loadConfig();

    if (!cachedConfig) {
        console.log("Unable to read config.")

    }

    return cachedConfig;
}

function saveConfig() {

    if (!cachedConfig) {
        console.log("No configuration to save.");
        return false;
    }

    try {
        console.log("stringify called");
        const jsonString = JSON.stringify(cachedConfig, null, 4);
        const bytes = new TextEncoder().encode(jsonString);
        const ok = GLib.file_set_contents(configPath, bytes);

        console.log("calling SetMeasurementUnits later on");

        if (!ok) {
            console.log(`Error: GLib failed to write to ${configPath}`);
            return false;
        }

        console.log("Configuration saved successfully.");
        return true;

    } catch (e) {
        console.log(`mos config save error: ${e}`);
        return false;
    }
}


function setupWatcher() {
    const file = Gio.File.new_for_path(configPath);

    monitor = file.monitor_file(Gio.FileMonitorFlags.NONE, null);

    monitor.connect("changed", (_monitor, _file, _otherFile, eventType) => {
        // Only reload on actual content change
        if (eventType === Gio.FileMonitorEvent.CHANGES_DONE_HINT ||
            eventType === Gio.FileMonitorEvent.CHANGED ||
            eventType === Gio.FileMonitorEvent.CREATED) {

            print("mos.json changed, reloading...");
            loadConfig();
        }
    });
}

// Setup file monitor
setupWatcher();

// Load config in the beginning
loadConfig();


// Export functions

export function GetOpenWeatherAPIKey() {
    if (!cachedConfig) return "";
    return cachedConfig.open_weather_api_key;
}

export function GetOpenWeatherCityCode() {
    if (!cachedConfig) return "";
    return cachedConfig.open_weather_city_code;
}

export function GetMeasurementUnits() {
    if (!cachedConfig) return "";
    return cachedConfig.measurement_units;
}

export function GetDockLaunchers() {
    if (!cachedConfig) return [];
    return Array.isArray(cachedConfig.dock_launchers)
        ? cachedConfig.dock_launchers
        : [];
}

export function SetMeasurementUnits(measurement_units: string) {
    console.log("calling SetMeasurementUnits");
    if (!reloadConfig()) return;

    console.log("reload config passed");

    try {
        console.log("saving measurement_units");
        cachedConfig.measurement_units = measurement_units;
        console.log("saveconfig called");
        saveConfig();
    }
    catch (e) {
        console.log("Failed to set measurement units.")
    }
}

const Config = {
    GetOpenWeatherAPIKey,
    GetOpenWeatherCityCode,
    GetMeasurementUnits,
    GetDockLaunchers,
    SetMeasurementUnits
};

export default Config;