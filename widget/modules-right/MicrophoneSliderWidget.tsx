import Gtk from "gi://Gtk?version=4.0";
import AstalWp from "gi://AstalWp?version=0.1";
import { For, createBinding, createComputed } from "gnim";
import { SliderAccordionController } from "./SliderAccordionController";
import { AudioSliderWidget } from "./AudioSliderWidget";

export function MicrophoneSliderWidget(controller: SliderAccordionController) {

    const { defaultMicrophone: microphone } = AstalWp.get_default()!

    const wp = AstalWp.get_default();
    const microphonesRawBinding = createBinding(wp.audio, "microphones");
    const microphonesBinding = createComputed(() => { return microphonesRawBinding() || []; });


    const content = (
        <box orientation={Gtk.Orientation.VERTICAL} cssName="slider-content">
            <label label="M I C R O P H O N E S" cssName="slider-content-header" />
            <box orientation={Gtk.Orientation.VERTICAL} spacing={10}>
                <For each={microphonesBinding}>
                    {(mic) => {
                        const description = createComputed(() => {
                            const rawDesc = createBinding(mic, "description");
                            return rawDesc() ?? "Unknown Device";
                        });

                        const isDefault = createBinding(mic, "isDefault");

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
                                            microphone.isDefault = self.active;
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
        id: "microphone",
        controller: controller,
        endPoint: microphone,
        content,
    });
}
