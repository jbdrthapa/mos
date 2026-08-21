import { Astal, Gtk, Gdk } from "ags/gtk4"
import { createBinding, createState } from "ags"
import Wp from "gi://AstalWp"
import { WindowName } from "../../constants"

const ANIMATION_TIME = 2000
let delayId: any = null
let initCount = 2

export default function OsdMicrophone(gdkmonitor: Gdk.Monitor) {

    const windowName = WindowName.osd;

    const microphone = Wp.get_default()?.get_audio().defaultMicrophone
    if (!microphone) return <box />

    const volumeBinding = createBinding(microphone, "volume")
    const iconBinding = volumeBinding.as(v => {
        if (v === 0) return "audio-input-microphone-muted-symbolic";
        if (v < 0.33) return "audio-input-microphone-low-symbolic";
        if (v < 0.66) return "audio-input-microphone-low-symbolic";
        if (v <= 1.0) return "audio-input-microphone-high-symbolic";
        return "audio-input-microphone-high-symbolic";
    });


    // Destructure the accessor [0] and the setter function [1]
    const [visible, setVisible] = createState(false)

    function showOsd() {

        // Added so it doesn't show the OSD when initializing. 
        // This is due to 2 subscription to WirePlumber signals ("notify::volume","notify::mute").

        if (initCount > 0) {
            initCount--;

            return;
        }

        // FIXED: Call the setter function directly
        setVisible(true)

        if (delayId) {
            clearTimeout(delayId)
        }
        delayId = setTimeout(() => {
            // FIXED: Call the setter function directly
            setVisible(false)
            delayId = null
        }, ANIMATION_TIME)
    }

    microphone.connect("notify::volume", () => showOsd())
    microphone.connect("notify::mute", () => showOsd())

    const osdMicrophone = (<window
        name={windowName}
        namespace={windowName}
        gdkmonitor={gdkmonitor}
        cssName={"osd-window"}
        anchor={Astal.WindowAnchor.BOTTOM}
        layer={Astal.Layer.OVERLAY}
        visible={visible} // Pass the read-only accessor object here
    >
        <box cssName={"osd-box"} orientation={Gtk.Orientation.HORIZONTAL} spacing={8}>
            <label label={"Microphone"} hexpand={false} halign={Gtk.Align.CENTER} cssName="osd-device-name" />
            <image iconName={iconBinding} pixelSize={32} cssName={"osd-box-icon"} />
            <label label={volumeBinding.as(v => `${Math.round(v * 100)}`)} cssName={"osd-box-label"} />
            <levelbar
                widthRequest={100}
                heightRequest={25}
                cssClasses={["osd-bar"]}
                minValue={0}
                maxValue={1.5}
                value={volumeBinding.as(v => v)}
                valign={Gtk.Align.CENTER}
                hexpand={true}
            />
        </box>
    </window>
    ) as Gtk.Window;

    return osdMicrophone;
}
