import Gtk from "gi://Gtk?version=4.0"
import app from "ags/gtk4/app"
import { Astal } from "ags/gtk4"
import { WindowName } from "../constants"
import { createBinding } from "gnim";
import SystemInfoService from "../services/SystemInfoService";

const windowName = WindowName.lockScreen;

export function LockScreen() {

    const systemInfoService = SystemInfoService.get_default();

    const avatarImg = createBinding(systemInfoService, "avatar");
    const hostInfo = createBinding(systemInfoService, "host_info");
    const uptime = createBinding(systemInfoService, "uptime_info");
    const auth_message = createBinding(systemInfoService, "auth-message");

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

    const lockScreenWindow = (
        <window
            name={windowName}
            namespace={windowName}
            keymode={Astal.Keymode.EXCLUSIVE}
            layer={Astal.Layer.OVERLAY}
            visible={false}
            exclusivity={Astal.Exclusivity.IGNORE}
            anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.LEFT | Astal.WindowAnchor.RIGHT}
            application={app}
            cssName={""}
        >
            <box valign={Gtk.Align.CENTER} orientation={Gtk.Orientation.VERTICAL} css="background-color:$red;" spacing={20}>
                <box hexpand={true} halign={Gtk.Align.CENTER} cssName="user-avatar-lockscreen" css={dynamicGtkCss} />
                <label label={hostInfo} cssName="host-info" />
                <label label={uptime} cssName="uptime-info" />
                <entry
                    hexpand={false}
                    halign={Gtk.Align.CENTER}
                    visibility={false}
                    cssName="lockscreen-entry"
                    onActivate={(self) => {
                        systemInfoService.authenticate(self.text, () => {
                            lockScreenWindow.hide();
                            self.text = "";
                        });
                    }} />
                <label label={auth_message} cssName="auth-message" />
                {/* <button hexpand={false} halign={Gtk.Align.CENTER} onClicked={() => lockScreenWindow.hide()}>
                    <label label="Unlock" />
                </button> */}
            </box>
        </window>
    ) as Astal.Window;


    return lockScreenWindow;

}
