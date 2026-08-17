import Gtk from "gi://Gtk?version=4.0";
import { SpeakerSliderWidget } from "./SpeakerSliderWidget";
import { MicrophoneSliderWidget } from "./MicrophoneSliderWidget";
import { SliderAccordionController } from "./SliderAccordionController";

export function AudioControlsWidget() {

    const controller = new SliderAccordionController();
    const speakerSlider = SpeakerSliderWidget(controller);
    const microphoneSlider = MicrophoneSliderWidget(controller);

    return (
        <box halign={Gtk.Align.CENTER} orientation={Gtk.Orientation.VERTICAL} cssName="audio-controls-container">
            {speakerSlider}
            {microphoneSlider}
        </box>
    );
}