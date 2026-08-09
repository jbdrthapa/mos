import AstalWp from "gi://AstalWp?version=0.1";
import Gtk from "gi://Gtk?version=4.0";
import { createBinding } from "ags"

export function AudioControlsWidget() {

    const { defaultSpeaker: speaker } = AstalWp.get_default()!
    const { defaultMicrophone: microphone } = AstalWp.get_default()!


    // simple component for a slider with an icon, used for both speaker and microphone
    function SliderSet({ endpoint }: { endpoint: AstalWp.Endpoint }) {
        const volumeIcon = createBinding(endpoint, "volumeIcon");
        const volume = createBinding(endpoint, "volume");
        const volumeText = volume.as((value) => String(Math.trunc(value * 100)));

        return (
            <box orientation={Gtk.Orientation.HORIZONTAL}  heightRequest={80}>
                <image
                    pixelSize={28}
                    iconName={volumeIcon} cssName={"audio-icon"} />
                <label valign={Gtk.Align.CENTER} label={volumeText} cssName={"audio-percent"} />
                <slider
                    cssClasses={["slider-control"]}
                    tooltipText={volumeText}
                    widthRequest={380}
                    onChangeValue={({ value }) => endpoint.set_volume(value)}
                    value={createBinding(endpoint, "volume")} />
            </box>
        );
    }

    return (
        <box halign={Gtk.Align.CENTER} orientation={Gtk.Orientation.VERTICAL} cssName="audio-controls-container">
            <SliderSet endpoint={speaker} />
            <SliderSet endpoint={microphone} />
        </box>
    );
}