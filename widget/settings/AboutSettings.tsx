import Gtk from "gi://Gtk?version=4.0";
import app from "ags/gtk4/app"
import Utils from "../../Utils";

export function AboutSettings() {

    const CONFIG_DIR = `${Utils.GetUserConfigDirectory()}/mos`;

    const jsshellLogoPath = `${CONFIG_DIR}/assets/general/mos-vibrant-shell.svg`

    return (
        <box orientation={Gtk.Orientation.VERTICAL} spacing={10}>

            <label label="About" halign={Gtk.Align.START} cssName="section-heading" />

            <box spacing={10} orientation={Gtk.Orientation.VERTICAL} cssName="section-background">

                <image file={jsshellLogoPath} tooltipText={app.instanceName} pixelSize={256} cssName="settings-param-icon" valign={Gtk.Align.START} />

                <box orientation={Gtk.Orientation.HORIZONTAL} spacing={10}>
                    <label label="Title" xalign={0} cssName="settings-param-caption" />
                    <label label={app.instanceName} cssName="settings-param-value" halign={Gtk.Align.START} />
                </box>
                <box orientation={Gtk.Orientation.HORIZONTAL} spacing={10}>
                    <label label="Version" xalign={0} cssName="settings-param-caption" />
                    <label label={app.version} cssName="settings-param-value" halign={Gtk.Align.START} />
                </box>
            </box>

        </box>
    );
}



