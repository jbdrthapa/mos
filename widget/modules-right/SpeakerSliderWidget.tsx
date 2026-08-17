import Gtk from "gi://Gtk?version=4.0";
import AstalWp from "gi://AstalWp?version=0.1";
import { For, createBinding, createComputed } from "gnim";
import { SliderAccordionController } from "./SliderAccordionController";
import { AudioSliderWidget } from "./AudioSliderWidget";

export function SpeakerSliderWidget(controller: SliderAccordionController) {

    const { defaultSpeaker: speaker } = AstalWp.get_default()!

    const wp = AstalWp.get_default();
    const speakersRawBinding = createBinding(wp.audio, "speakers");
    const speakersBinding = createComputed(() => { return speakersRawBinding() || []; });


    const content = (
        <box orientation={Gtk.Orientation.VERTICAL} cssName="slider-content">
            <label label="S P E A K E R S" cssName="slider-content-header" />
            <box orientation={Gtk.Orientation.VERTICAL} spacing={10}>
                <For each={speakersBinding}>
                    {(speaker) => {
                        const description = createComputed(() => {
                            const rawDesc = createBinding(speaker, "description");
                            return rawDesc() ?? "Unknown Device";
                        });

                        const isDefault = createBinding(speaker, "isDefault");

                        return (
                            <box orientation={Gtk.Orientation.VERTICAL}>
                                <box orientation={Gtk.Orientation.HORIZONTAL} spacing={10}>
                                    <Gtk.Switch
                                        active={isDefault}
                                        hexpand={false}
                                        vexpand={false}
                                        halign={Gtk.Align.END}
                                        valign={Gtk.Align.CENTER}
                                        onNotifyActive={(self) => {
                                            speaker.isDefault = self.active;
                                        }} />
                                    <label label={description} cssName="slider-content-param" />
                                </box>
                            </box>
                        )
                    }}
                </For>
            </box>
        </box>
    ) as Gtk.Box;

    return AudioSliderWidget({
        id: "speaker",
        controller: controller,
        endPoint: speaker,
        content,
    });
}
