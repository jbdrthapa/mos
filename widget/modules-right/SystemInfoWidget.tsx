import Gtk from "gi://Gtk?version=4.0";
import GLib from 'gi://GLib';
import Gio from 'gi://Gio';
import app from "ags/gtk4/app";
import { WindowName } from "../../constants";
import SystemInfoService from "../../services/SystemInfoService";
import { createBinding } from "gnim";
import PopupWindow from "../PopupWindow";

const settingsWindowName = WindowName.settings
const modulesRightWindowName = WindowName.modulesRight;

export function SystemInfoWidget() {

    const systemInfoService = SystemInfoService.get_default();

    const avatarImg = createBinding(systemInfoService, "avatar");

    const dynamicGtkCss = avatarImg.as(path => {
        const finalPath = (path && path.startsWith("/")) ? path : "avatar-default";

        if (finalPath.startsWith("/")) {
            return `
            background-image: url('file://${finalPath}');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
        `;
        }

        return `
        background-image: icon('${finalPath}');
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
    `;
    });

    return (
        <box orientation={Gtk.Orientation.HORIZONTAL} cssName="system-info-container">
            <box hexpand={true} halign={Gtk.Align.START} cssName="user-avatar" css={dynamicGtkCss} />
            <box hexpand={true} halign={Gtk.Align.START}>
                <box orientation={Gtk.Orientation.VERTICAL} vexpand={false} valign={Gtk.Align.CENTER}>
                    <label label={createBinding(systemInfoService, "host_info")} cssName={"system-info-data-header"} hexpand={false} halign={Gtk.Align.START} />
                    <label label={createBinding(systemInfoService, "uptime_info")} cssName={"system-info-data"} hexpand={false} halign={Gtk.Align.START} />
                </box>
            </box>
            <box orientation={Gtk.Orientation.VERTICAL} halign={Gtk.Align.END} hexpand={false} vexpand={false} valign={Gtk.Align.CENTER}>
                <button label="" cssName="system-info-button" tooltipText="Settings" onClicked={() => {
                    app.toggle_window(modulesRightWindowName);
                    let settingsWindow = app.get_window(settingsWindowName);
                    settingsWindow?.toggle();
                }} />

                <button label="" cssName="system-info-button" tooltipText="Restart Shell" onClicked={() => {
                    GLib.spawn_command_line_async('bash -c "killall gjs; ~/.config/ags/js-shell"');
                }} />
            </box>
        </box>
    );
}