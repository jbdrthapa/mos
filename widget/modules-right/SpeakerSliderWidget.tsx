import Gtk from "gi://Gtk?version=4.0";
import AstalWp from "gi://AstalWp?version=0.1";
import { SliderAccordionController } from "./SliderAccordionController";
import { AudioSliderWidget } from "./AudioSliderWidget";

export function SpeakerSliderWidget(controller: SliderAccordionController) {

    const { defaultSpeaker: speaker } = AstalWp.get_default()!

    const content = (
        <box orientation={Gtk.Orientation.VERTICAL} cssName="slider-content">
            <label label="S P E A K E R S" cssName="slider-content-header" />
        </box>
    ) as Gtk.Box;

    return AudioSliderWidget({
        id: "speaker",
        controller: controller,
        endPoint: speaker,
        content,
    });
}
