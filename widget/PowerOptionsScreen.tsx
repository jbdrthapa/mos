import Gtk from "gi://Gtk?version=4.0";
import GLib from "gi://GLib";
import app from "ags/gtk4/app";
import { Astal } from "ags/gtk4";
import { WindowName } from "../constants";
import { createState } from "gnim";

const windowName = WindowName.powerOptions;

export function PowerOptionsScreen() {


    const [reveal, setReveal] = createState(true);

    const revealerWidget = (
        <revealer
            revealChild={reveal}
            transitionType={Gtk.RevealerTransitionType.CROSSFADE}
            transitionDuration={1000}
            vexpand={true}
            hexpand={true}
            cssName="power-options-background"

            $={() => {
                setTimeout(() => setReveal(true), 10);
            }}
        >
            <box vexpand={true} hexpand={true} valign={Gtk.Align.CENTER} halign={Gtk.Align.CENTER} orientation={Gtk.Orientation.VERTICAL} spacing={20}>
                <box orientation={Gtk.Orientation.HORIZONTAL} halign={Gtk.Align.CENTER} spacing={35}>

                    <box orientation={Gtk.Orientation.VERTICAL} spacing={40} cssName="power-button-container-large">
                        <button label="󰿅" cssName="power-button-large" onClicked={() => {
                            slideDownAndHide();
                            GLib.spawn_command_line_async('bash -c "niri msg action quit --skip-confirmation"');
                        }} />
                        <label label={"Log Off"} tooltipText="Log Off" cssName="power-button-caption" />
                    </box>

                    <box orientation={Gtk.Orientation.VERTICAL} spacing={40} cssName="power-button-container-large">
                        <button label="" cssName="power-button-large" onClicked={() => {
                            slideDownAndHide();
                            GLib.spawn_command_line_async('bash -c "systemctl reboot"');
                        }} />
                        <label label={"Reboot"} tooltipText="Reboot" cssName="power-button-caption" />
                    </box>

                    <box orientation={Gtk.Orientation.VERTICAL} spacing={40} cssName="power-button-container-large">
                        <button label="" cssName="power-button-large" onClicked={() => {
                            slideDownAndHide();
                            GLib.spawn_command_line_async('bash -c "systemctl poweroff"');
                        }} />
                        <label label={"Power Off"} tooltipText="Power Off" cssName="power-button-caption" />
                    </box>

                    <box orientation={Gtk.Orientation.VERTICAL} spacing={40} cssName="power-button-container-large">
                        <button label="" cssName="power-button-large" onClicked={() => {
                            slideDownAndHide();
                        }} />
                        <label label={"Cancel"} tooltipText="Cancel" cssName="power-button-caption" />
                    </box>
                </box>
            </box>
        </revealer>
    );

    const powerOptionsWindow = (
        <window
            name={windowName}
            namespace={windowName}
            keymode={Astal.Keymode.EXCLUSIVE}
            modal={true}
            layer={Astal.Layer.OVERLAY}
            visible={false}
            exclusivity={Astal.Exclusivity.IGNORE}
            css={"background: none; "}
            anchor={
                Astal.WindowAnchor.TOP |
                Astal.WindowAnchor.BOTTOM |
                Astal.WindowAnchor.LEFT |
                Astal.WindowAnchor.RIGHT
            }
            application={app}
        >
            {revealerWidget}
        </window>
    ) as Astal.Window;

    function slideDownAndHide() {

        setReveal(false);

        GLib.timeout_add(GLib.PRIORITY_DEFAULT, 1000, () => {
            powerOptionsWindow.hide();

            setReveal(true);

            return GLib.SOURCE_REMOVE;
        });
    }

    return powerOptionsWindow;
}
