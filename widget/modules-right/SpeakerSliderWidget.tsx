import Gtk from "gi://Gtk?version=4.0";
import AstalWp from "gi://AstalWp?version=0.1";
import { SliderAccordionController } from "./SliderAccordionController";
import { AudioSliderWidget } from "./AudioSliderWidget";

export function SpeakerSliderWidget(controller: SliderAccordionController) {

    const { defaultSpeaker: speaker } = AstalWp.get_default()!

    const content = (
        <box orientation={Gtk.Orientation.VERTICAL} cssName="pill-content">
            <label label="Speakers" />
        </box>
    ) as Gtk.Box;

    return AudioSliderWidget({
        id: "speaker",
        controller: controller,
        endPoint: speaker,
        content,
    });
}
