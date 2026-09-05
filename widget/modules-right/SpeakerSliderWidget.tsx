import Gtk from "gi://Gtk?version=4.0";
import AstalWp from "gi://AstalWp?version=0.1";
import { For, createBinding, createComputed } from "gnim";
import { SliderAccordionController } from "./SliderAccordionController";
import { AudioSliderWidget } from "./AudioSliderWidget";

export function SpeakerSliderWidget(controller: SliderAccordionController) {

    const DEVICE_DESCRIPTION_LENGTH = 50;

    const { defaultSpeaker: speaker } = AstalWp.get_default()!

    const wp = AstalWp.get_default();
    const speakersRawBinding = createBinding(wp.audio, "speakers");
    const speakersBinding = createComputed(() => {
        const list = speakersRawBinding() || [];

        return [...list].sort((a, b) => {
            const descA = a.description ?? "Unknown Device";
            const descB = b.description ?? "Unknown Device";
            return descA.localeCompare(descB);
        });
    });

    const content = (
        <box orientation={Gtk.Orientation.VERTICAL} cssName="slider-content">
            <label label="S P E A K E R S" cssName="slider-content-header" />
            <box orientation={Gtk.Orientation.VERTICAL} spacing={10}>
                <For each={speakersBinding}>
                    {(speaker) => {
                        const deviceDescriptions = createComputed(() => {
                            const rawDesc = createBinding(speaker, "description")() ?? "Unknown Device";
                            const shortDesc = rawDesc.length > DEVICE_DESCRIPTION_LENGTH ? `${rawDesc.slice(0, DEVICE_DESCRIPTION_LENGTH)}...` : rawDesc;
                            return {
                                short: shortDesc,
                                full: rawDesc
                            };
                        });

                        const shortDescription = createComputed(() => deviceDescriptions().short);
                        const fullDescription = createComputed(() => deviceDescriptions().full);
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
                                    <label label={shortDescription} tooltipText={fullDescription} cssName="slider-content-param" />
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
