import Gtk from "gi://Gtk?version=4.0";
import GLib from 'gi://GLib';
import app from "ags/gtk4/app";
import { WindowName } from "../../constants";
import { LockScreen } from "../LockScreen";

export function PowerButtonsWidget() {

    const modulesRightWindowName = WindowName.modulesRight;
    const lockScreen = LockScreen();

    return (
        <box orientation={Gtk.Orientation.HORIZONTAL} halign={Gtk.Align.CENTER} spacing={35}>
            <button label="" cssName="power-button" tooltipText="Lock Screen" onClicked={() => {
                app.toggle_window(modulesRightWindowName);
                lockScreen.show();
            }} />
            <button label="󰿅" cssName="power-button" tooltipText="Log Off" onClicked={() => {
                app.toggle_window(modulesRightWindowName);
                GLib.spawn_command_line_async('bash -c "niri msg action quit --skip-confirmation"');
            }} />

            <button label="" cssName="power-button" tooltipText="Reboot" onClicked={() => {
                app.toggle_window(modulesRightWindowName);
                GLib.spawn_command_line_async('bash -c "systemctl reboot"');
            }} />

            <button label="" cssName="power-button" tooltipText="Power Off" onClicked={() => {
                app.toggle_window(modulesRightWindowName);
                GLib.spawn_command_line_async('bash -c "systemctl poweroff"');
            }} />
        </box>
    );
}