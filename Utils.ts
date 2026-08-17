import GLib from 'gi://GLib';

export function GetHomeDirectory() {
    return GLib.get_home_dir();
}

export function GetUserConfigDirectory() {
    return GLib.get_user_config_dir();
}

export function GetSessionType() {
    return GLib.getenv("XDG_CURRENT_DESKTOP") || "";
}

const Utils = {
    GetHomeDirectory,
    GetUserConfigDirectory,
    GetSessionType
};

export default Utils;