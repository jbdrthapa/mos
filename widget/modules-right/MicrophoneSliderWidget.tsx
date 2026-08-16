import Gtk from "gi://Gtk?version=4.0";
import AstalWp from "gi://AstalWp?version=0.1";
import { SliderAccordionController } from "./SliderAccordionController";
import { AudioSliderWidget } from "./AudioSliderWidget";

export function MicrophoneSliderWidget(controller: SliderAccordionController) {

    const { defaultMicrophone: microphone } = AstalWp.get_default()!

    const content = (
        <box orientation={Gtk.Orientation.VERTICAL} cssName="pill-content">
            <label label="Microphones" />
        </box>
    ) as Gtk.Box;

    return AudioSliderWidget({
        id: "microphone",
        controller: controller,
        endPoint: microphone,
        content,
    });
}
